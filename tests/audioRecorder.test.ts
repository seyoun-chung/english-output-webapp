import { describe, expect, it, vi } from "vitest";
import { createAudioRecorder, emptyRecording, MICROPHONE_PERMISSION_TIMEOUT_MS, preferredRecordingMimeType } from "../src/audioRecorder";
import type { RecordingEnvironment } from "../src/audioRecorder";

class FakeRecorder {
  state = "inactive";
  mimeType = "audio/webm;codecs=opus";
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  start = vi.fn(() => {
    this.state = "recording";
  });
  stop = vi.fn(() => {
    this.state = "inactive";
  });
  data(value = "test audio bytes") {
    this.ondataavailable?.({
      data: new Blob([value], { type: this.mimeType }),
    });
  }
  finish() {
    this.state = "inactive";
    this.onstop?.();
  }
}

function setup() {
  const tracks = [{ stop: vi.fn() }, { stop: vi.fn() }];
  const stream = { getTracks: () => tracks } as unknown as MediaStream;
  const fake = new FakeRecorder();
  const environment = {
    isSupported: vi.fn(() => true),
    requestStream: vi.fn(async () => stream),
    createRecorder: vi.fn(() => fake as unknown as MediaRecorder),
    createUrl: vi.fn((_blob: Blob) => "blob:local-test"),
    revokeUrl: vi.fn(),
  } satisfies RecordingEnvironment;
  const changes = vi.fn();
  const controller = createAudioRecorder(environment, changes);
  return { controller, environment, changes, fake, tracks, stream };
}

describe("optional, memory-only voice recording", () => {
  it("prefers MP4 on iPhone even when WebM is also reported as supported", () => {
    const supports = vi.fn(() => true);
    expect(preferredRecordingMimeType("Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X)", supports)).toBe("audio/mp4");
    expect(supports).toHaveBeenCalledWith("audio/mp4");
  });

  it("falls back to WebM on iPhone when MP4 is unavailable", () => {
    expect(preferredRecordingMimeType("iPhone", (type) => type === "audio/webm;codecs=opus")).toBe("audio/webm;codecs=opus");
  });

  it("keeps WebM first on non-Apple browsers", () => {
    expect(preferredRecordingMimeType("Mozilla/5.0 (Linux; Android 15) Chrome/130", () => true)).toBe("audio/webm;codecs=opus");
  });

  it("never requests the microphone before an explicit start", () => {
    const { controller, environment } = setup();
    expect(controller.getState()).toEqual(emptyRecording());
    expect(environment.requestStream).not.toHaveBeenCalled();
  });

  it("waits for final data before creating a playable URL and stops every track immediately", async () => {
    const { controller, fake, environment, tracks } = setup();
    await controller.start();
    expect(controller.getState().status).toBe("recording");
    fake.data("first");
    controller.stop();
    expect(controller.getState().status).toBe("stopping");
    tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
    expect(environment.createUrl).not.toHaveBeenCalled();
    fake.data("last");
    fake.finish();
    expect(controller.getState()).toEqual({
      status: "ready",
      url: "blob:local-test",
      error: null,
    });
    const blob = environment.createUrl.mock.calls[0][0];
    expect(await blob.text()).toBe("firstlast");
    expect(blob.type).toBe("audio/webm;codecs=opus");
  });

  it("ignores duplicate start and stop clicks", async () => {
    const { controller, environment, fake } = setup();
    const pending = controller.start();
    await controller.start();
    await pending;
    await controller.start();
    expect(environment.requestStream).toHaveBeenCalledOnce();
    controller.stop();
    controller.stop();
    expect(fake.stop).toHaveBeenCalledOnce();
  });

  it("releases a late permission grant after cancellation or unmount", async () => {
    for (const action of ["clear", "dispose"] as const) {
      const { controller, environment, stream, tracks } = setup();
      let grant!: (stream: MediaStream) => void;
      environment.requestStream.mockImplementation(
        () =>
          new Promise((resolve) => {
            grant = resolve;
          }),
      );
      const pending = controller.start();
      expect(controller.getState().status).toBe("requesting");
      controller[action]();
      grant(stream);
      await pending;
      expect(environment.createRecorder).not.toHaveBeenCalled();
      tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
      expect(controller.getState()).toEqual(emptyRecording());
    }
  });

  it("ignores late permission rejection after navigation", async () => {
    const { controller, environment, changes } = setup();
    let reject!: (error: Error) => void;
    environment.requestStream.mockImplementation(
      () =>
        new Promise((_, fail) => {
          reject = fail;
        }),
    );
    const pending = controller.start();
    controller.dispose();
    changes.mockClear();
    reject(new DOMException("denied", "NotAllowedError"));
    await pending;
    expect(changes).not.toHaveBeenCalled();
  });

  it("times out an unanswered permission request and releases a late grant", async () => {
    vi.useFakeTimers();
    try {
      const { controller, environment, stream, tracks } = setup();
      let grant!: (stream: MediaStream) => void;
      environment.requestStream.mockImplementation(
        () => new Promise((resolve) => { grant = resolve; }),
      );
      const pending = controller.start();

      await vi.advanceTimersByTimeAsync(MICROPHONE_PERMISSION_TIMEOUT_MS);
      await pending;
      expect(controller.getState().status).toBe("error");
      expect(controller.getState().error).toContain("사이트 마이크 권한");

      grant(stream);
      await Promise.resolve();
      tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
      controller.dispose();
    } finally {
      vi.useRealTimers();
    }
  });

  it("discards queued data and stop events after leaving the screen", async () => {
    const { controller, fake, environment, tracks, changes } = setup();
    await controller.start();
    const lateData = fake.ondataavailable;
    const lateStop = fake.onstop;
    fake.data();
    controller.dispose();
    changes.mockClear();
    lateData?.({ data: new Blob(["late"]) });
    lateStop?.();
    tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
    expect(environment.createUrl).not.toHaveBeenCalled();
    expect(changes).not.toHaveBeenCalled();
    expect(fake.stop).toHaveBeenCalledOnce();
  });

  it.each(["clear", "dispose", "start"] as const)(
    "revokes finished audio on %s",
    async (action) => {
      const { controller, fake, environment } = setup();
      await controller.start();
      fake.data();
      controller.stop();
      fake.finish();
      await controller[action]();
      expect(environment.revokeUrl).toHaveBeenCalledExactlyOnceWith(
        "blob:local-test",
      );
      expect(controller.getState().url).toBeNull();
      controller.dispose();
    },
  );

  it.each([
    "NotAllowedError",
    "NotFoundError",
    "NotReadableError",
    "AbortError",
  ])("handles %s and permits retry", async (name) => {
    const { controller, environment } = setup();
    environment.requestStream.mockRejectedValueOnce(
      new DOMException("error", name),
    );
    await controller.start();
    expect(controller.getState().status).toBe("error");
    expect(controller.getState().error).toBeTruthy();
    expect(controller.getState().url).toBeNull();
    await controller.start();
    expect(controller.getState().status).toBe("recording");
    controller.dispose();
  });

  it("does not request permissions in an unsupported or insecure environment", async () => {
    const { controller, environment } = setup();
    environment.isSupported.mockReturnValue(false);
    await controller.start();
    expect(controller.getState().status).toBe("error");
    expect(environment.requestStream).not.toHaveBeenCalled();
  });

  it("releases acquired tracks if recorder construction fails", async () => {
    const { controller, environment, tracks } = setup();
    environment.createRecorder.mockImplementation(() => {
      throw new Error("unsupported codec");
    });
    await controller.start();
    expect(controller.getState().status).toBe("error");
    tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
  });

  it("releases acquired tracks if recording cannot start", async () => {
    const { controller, fake, tracks } = setup();
    fake.start.mockImplementation(() => {
      throw new Error("busy");
    });
    await controller.start();
    expect(controller.getState().status).toBe("error");
    tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
  });

  it("releases the microphone if stopping throws", async () => {
    const { controller, fake, tracks } = setup();
    await controller.start();
    fake.stop.mockImplementation(() => {
      throw new Error("device lost");
    });
    controller.stop();
    expect(controller.getState().status).toBe("error");
    tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
  });

  it("discards audio and frees resources on recorder errors", async () => {
    const { controller, fake, environment, tracks } = setup();
    await controller.start();
    fake.data();
    fake.onerror?.();
    fake.finish();
    expect(controller.getState().status).toBe("error");
    expect(environment.createUrl).not.toHaveBeenCalled();
    tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
  });

  it("handles automatic stream termination and empty recordings", async () => {
    const { controller, fake, environment, tracks } = setup();
    await controller.start();
    fake.data("");
    fake.finish();
    expect(controller.getState().status).toBe("error");
    expect(environment.createUrl).not.toHaveBeenCalled();
    tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
  });

  it("removes an unplayable recording without affecting study progress", async () => {
    const { controller, fake, environment } = setup();
    await controller.start();
    fake.data();
    fake.finish();
    controller.playbackError();
    expect(controller.getState().status).toBe("error");
    expect(controller.getState().url).toBeNull();
    expect(environment.revokeUrl).toHaveBeenCalledWith("blob:local-test");
  });
});
