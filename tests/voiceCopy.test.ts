import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RecordingNotice } from "../src/VoicePractice";
import { emptyRecording } from "../src/audioRecorder";
import type { RecordingState } from "../src/audioRecorder";
import App from "../src/App";
import { initialProgress } from "../src/progress";

afterEach(() => vi.unstubAllGlobals());

const renderNotice = (
  status: RecordingState["status"],
  supported = true,
  error: string | null = null,
) =>
  renderToStaticMarkup(
    createElement(RecordingNotice, {
      recording: { ...emptyRecording(), status, error },
      supported,
    }),
  );

describe("concise recording guidance", () => {
  it("keeps deletion guidance without repeating the Optional badge before starting", () => {
    const html = renderNotice("idle");
    expect(html).not.toContain("녹음 없이 진행해도 괜찮아요.");
    expect(html).not.toContain('role="status"');
    expect(html).not.toContain("외부 전송·영구 저장");
    expect(html).toContain("앱 안의 녹음은 삭제돼요.");
    expect(html.match(/voice-privacy/g)).toHaveLength(1);
    expect(html).not.toContain("음성 인식·자동 채점");
  });

  it.each(["requesting", "recording", "stopping", "ready"] as const)(
    "does not repeat start guidance while %s",
    (status) => {
      const html = renderNotice(status);
      if (status === "stopping") {
        expect(html).not.toContain('role="status"');
        expect(html).not.toContain("마이크 사용이 종료됐어요.");
      } else {
        expect(html).toContain('role="status"');
      }
      expect(html).not.toContain("voice-privacy");
      expect(html).not.toContain("녹음 없이 진행");
      expect(html).not.toContain("외부 전송");
    },
  );

  it("uses the approved short English recording and playback guidance", () => {
    expect(renderNotice("recording")).toContain("Recording…");
    expect(renderNotice("recording")).not.toContain("마이크를 사용하고 있어요");
    expect(renderNotice("ready")).toContain("Listen and compare.");
    expect(renderNotice("ready")).not.toContain("재생하면서 원문과 비교해보세요.");
  });

  it("shows the actionable error without a duplicate generic status", () => {
    const html = renderNotice("error", true, "마이크 연결을 확인해주세요.");
    expect(html).toContain('role="alert"');
    expect(html).toContain("마이크 연결을 확인해주세요.");
    expect(html).not.toContain('role="status"');
    expect(html).toContain("앱 안의 녹음은 삭제돼요.");
    expect(html).not.toContain("외부 전송·영구 저장");
  });

  it("shows only the unsupported-environment explanation when unavailable", () => {
    const html = renderNotice("idle", false);
    expect(html).toContain("녹음을 지원하지 않는 환경이에요.");
    expect(html).not.toContain("voice-status");
    expect(html).not.toContain("voice-privacy");
  });

  it("uses Chunk consistently and removes the sidebar storage explanation", () => {
    const progress = { ...initialProgress(), currentScreen: "read" };
    vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(progress) });
    const html = renderToStaticMarkup(createElement(App));
    expect(html).toContain("6 chunks");
    expect(html).toContain("Chunk Recall");
    expect(html).not.toMatch(/학습 구간|구간별 말하기/);
    expect(html).not.toContain("진행 기록은 이 브라우저에 저장돼요.");
    expect(html).not.toContain("다른 기기와는 공유되지 않아요.");
  });

  it("shows Self check without the redundant classification explanation", () => {
    const progress = { ...initialProgress(), currentScreen: "full", fullRecallCompleted: true };
    progress.chunkRatings[1] = "immediate";
    progress.chunkRatings[2] = "effort";
    vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(progress) });
    const html = renderToStaticMarkup(createElement(App));
    expect(html).toContain("Self check");
    expect(html).toContain("Recalled easily");
    expect(html).toContain("To review");
    expect(html).toContain("Chunk 1");
    expect(html).toContain("Chunk 2");
    expect(html).not.toMatch(/자기평가 기록|구간별 말하기에서|다시 볼 부분에 모았어요/);
  });
});
