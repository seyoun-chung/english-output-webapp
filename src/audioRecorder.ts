export type RecordingState = {
  status: "idle" | "requesting" | "recording" | "stopping" | "ready" | "error";
  url: string | null;
  error: string | null;
};

export const emptyRecording = (): RecordingState => ({
  status: "idle",
  url: null,
  error: null,
});

// Browser APIs are injected so lifecycle and permission races can be tested
// without opening a microphone or persisting audio anywhere.
export type RecordingEnvironment = {
  isSupported: () => boolean;
  requestStream: () => Promise<MediaStream>;
  createRecorder: (stream: MediaStream) => MediaRecorder;
  createUrl: (blob: Blob) => string;
  revokeUrl: (url: string) => void;
};

export function preferredRecordingMimeType(
  userAgent: string,
  isTypeSupported: (type: string) => boolean,
): string | undefined {
  // iPhone/iPad Safari can report WebM support, but MP4 is the native
  // recording/playback path. Other browsers keep their existing preference.
  const appleMobile = /iPhone|iPad|iPod/i.test(userAgent);
  const candidates = appleMobile
    ? ["audio/mp4", "audio/webm;codecs=opus", "audio/ogg;codecs=opus"]
    : ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"];
  return candidates.find((type) => isTypeSupported(type));
}

export const browserRecordingEnvironment: RecordingEnvironment = {
  isSupported: () =>
    typeof window !== "undefined" &&
    window.isSecureContext &&
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined",
  requestStream: () =>
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }),
  createRecorder: (stream) => {
    const mimeType = preferredRecordingMimeType(
      navigator.userAgent,
      (type) => MediaRecorder.isTypeSupported?.(type) ?? false,
    );
    return new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  },
  createUrl: (blob) => URL.createObjectURL(blob),
  revokeUrl: (url) => URL.revokeObjectURL(url),
};

function recordingError(error: unknown): string {
  const name =
    error && typeof error === "object" && "name" in error ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "마이크 사용이 허용되지 않았어요. 브라우저 사이트 권한과 기기의 마이크 설정을 확인해주세요. 녹음 없이도 학습할 수 있어요.";
  }
  if (name === "NotFoundError")
    return "마이크를 찾지 못했어요. 마이크 연결을 확인하거나 녹음 없이 진행해주세요.";
  if (name === "NotReadableError" || name === "AbortError") {
    return "마이크를 사용할 수 없어요. 다른 앱의 사용 여부와 기기 설정을 확인한 뒤 다시 시도해주세요.";
  }
  return "녹음을 완료하지 못했어요. 다시 시도하거나 녹음 없이 진행해주세요.";
}

export function createAudioRecorder(
  environment: RecordingEnvironment,
  onChange: (state: RecordingState) => void,
) {
  let state = emptyRecording();
  let stream: MediaStream | null = null;
  let recorder: MediaRecorder | null = null;
  let parts: Blob[] = [];
  let generation = 0;
  let disposed = false;

  const publish = (next: RecordingState) => {
    state = next;
    if (!disposed) onChange(next);
  };
  const stopTracks = (target: MediaStream | null) => {
    target?.getTracks().forEach((track) => track.stop());
  };
  const releaseStream = () => {
    stopTracks(stream);
    stream = null;
  };
  const detachRecorder = () => {
    if (!recorder) return;
    recorder.ondataavailable = null;
    recorder.onstop = null;
    recorder.onerror = null;
    if (recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        /* Tracks are always released below. */
      }
    }
    recorder = null;
  };
  const release = () => {
    generation++;
    detachRecorder();
    releaseStream();
    parts = [];
    if (state.url) environment.revokeUrl(state.url);
  };
  const fail = (message: string) => {
    release();
    publish({ status: "error", url: null, error: message });
  };

  return {
    getState: () => state,
    async start() {
      if (
        disposed ||
        ["requesting", "recording", "stopping"].includes(state.status)
      )
        return;
      release();
      if (!environment.isSupported()) {
        publish({
          status: "error",
          url: null,
          error:
            "이 환경에서는 녹음을 사용할 수 없어요. localhost 또는 HTTPS 주소를 일반 브라우저에서 열어주세요. 녹음 없이도 학습할 수 있어요.",
        });
        return;
      }
      const request = generation;
      publish({ status: "requesting", url: null, error: null });
      try {
        const acquired = await environment.requestStream();
        // Permission may be granted after navigation, cancellation, or unmount.
        if (disposed || request !== generation) {
          stopTracks(acquired);
          return;
        }
        stream = acquired;
        const active = environment.createRecorder(acquired);
        recorder = active;
        active.ondataavailable = (event) => {
          if (!disposed && request === generation && event.data.size > 0)
            parts.push(event.data);
        };
        active.onerror = () => {
          if (!disposed && request === generation) fail(recordingError(null));
        };
        active.onstop = () => {
          if (disposed || request !== generation) return;
          const type =
            active.mimeType || parts.find((part) => part.type)?.type || "";
          const audio = new Blob(parts, { type });
          parts = [];
          detachRecorder();
          releaseStream();
          if (!audio.size) {
            fail("녹음된 소리가 없어요. 마이크를 확인하고 다시 녹음해주세요.");
            return;
          }
          try {
            publish({
              status: "ready",
              url: environment.createUrl(audio),
              error: null,
            });
          } catch {
            fail(recordingError(null));
          }
        };
        active.start();
        publish({ status: "recording", url: null, error: null });
      } catch (error) {
        if (!disposed && request === generation) fail(recordingError(error));
      }
    },
    stop() {
      if (disposed || state.status !== "recording" || !recorder) return;
      publish({ ...state, status: "stopping" });
      try {
        if (recorder.state !== "inactive") recorder.stop();
        // Do not keep the microphone active while waiting for the final data event.
        releaseStream();
      } catch (error) {
        fail(recordingError(error));
      }
    },
    clear() {
      if (disposed) return;
      release();
      publish(emptyRecording());
    },
    playbackError() {
      if (!disposed)
        fail(
          "녹음을 재생할 수 없어요. 다시 녹음하거나 다른 브라우저에서 시도해주세요.",
        );
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      release();
      state = emptyRecording();
    },
  };
}
