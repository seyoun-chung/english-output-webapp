import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { VoicePractice } from "../src/VoicePractice";
import * as audio from "../src/audioRecorder";
import { initialProgress } from "../src/progress";
import type { Progress, Screen } from "../src/progress";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function renderScreen(screen: Screen, overrides: Partial<Progress> = {}) {
  const progress = { ...initialProgress(), ...overrides, currentScreen: screen };
  vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(progress) });
  return renderToStaticMarkup(createElement(App));
}

describe("approved UI copy and preserved Korean exceptions", () => {
  it("uses concise overview labels and keeps future sections disabled", () => {
    const html = renderScreen("overview");
    for (const label of ["In this chapter", "Chunks rated", "Read and recall", "Required", "Recommended", "6 chunks", ">Start "]) {
      expect(html).toContain(label);
    }
    expect(html.match(/Coming later/g)).toHaveLength(6);
    expect(html.match(/<button[^>]*disabled=""/g)).toHaveLength(6);
    expect(html).not.toMatch(/별도 학습|나의 속도로|다음 Phase/);
  });

  it("uses Continue and Read again without changing completion state", () => {
    const html = renderScreen("overview", {
      lastStudiedAt: new Date().toISOString(),
      fullRecallCompleted: true,
    });
    expect(html).toContain("Continue");
    expect(html).toContain("Read again");
    expect(html).toContain("Completed");
  });

  it.each(["overview", "read", "recall", "full"] as const)(
    "retains all four Korean sidebar descriptions on %s",
    (screen) => {
      const html = renderScreen(screen);
      for (const label of ["오늘의 학습 살펴보기", "읽고, 의미 이해하기", "조금씩 꺼내 말하기", "하나의 이야기로 말하기"]) {
        expect(html).toContain(label);
      }
    },
  );

  it("translates the reader controls without replacing the source text", () => {
    const html = renderScreen("read", { readMode: "together" });
    for (const label of ["Korean", "English", "Both", "Start recall", "Read the story at your own pace."]) {
      expect(html).toContain(label);
    }
    expect(html).toContain("너 MBTI 검사해 본 적 있어?");
    expect(html).toContain("Have you taken the MBTI test?");
  });

  it("keeps the English answer hidden on entering recall", () => {
    const html = renderScreen("recall");
    for (const label of ["Recall in chunks", "Hint 1", "Hint 2", "Show answer", "Read story", "Back to overview"]) {
      expect(html).toContain(label);
    }
    expect(html).not.toContain("Have you taken the MBTI test?");
    expect(html).toContain("너 MBTI 검사해 본 적 있어?");
  });

  it("translates summary categories but preserves all self-rating labels", () => {
    const html = renderScreen("full", {
      fullRecallCompleted: true,
      chunkRatings: { 1: "immediate", 2: "effort", 3: "review", 4: null, 5: null, 6: null },
    });
    for (const label of ["Recall the whole story", "My Story complete", "My Story · Korean", "Recalled easily", "To review", "Review chunks", "Finish", "Practice all chunks", "Not rated yet", "Show English"]) {
      expect(html).toContain(label);
    }
    for (const label of ["Self check", "바로 나왔어요", "생각해서 나왔어요", "다시 봐야 해요"]) {
      expect(html).toContain(label);
    }
    expect(html).toContain("Review chunks (2)");
  });

  it.each([
    ["read", "Read"],
    ["recall", "Chunk Recall"],
    ["full", "Full Recall"],
  ] as const)("uses the same two breadcrumb separators on %s", (screen, label) => {
    const html = renderScreen(screen);
    const breadcrumb = html.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/)?.[0] ?? "";
    expect(breadcrumb).toContain("Chapter 3");
    expect(breadcrumb).toContain("My Story");
    expect(breadcrumb).toContain(`aria-current="page">${label}</span>`);
    expect(breadcrumb.match(/class="breadcrumb-separator" aria-hidden="true">\//g)).toHaveLength(2);
  });
});

describe("recording copy changes are limited to the approved controls", () => {
  it.each([
    ["idle", null, "Record"],
    ["requesting", null, "Waiting for permission…"],
    ["recording", null, "Stop recording"],
    ["stopping", null, "Preparing audio…"],
    ["ready", "blob:test-recording", "Record again"],
  ] as const)("preserves the intended button and guidance in %s", (status, url, label) => {
    vi.spyOn(audio, "emptyRecording").mockReturnValue({ status, url, error: null });
    vi.spyOn(audio.browserRecordingEnvironment, "isSupported").mockReturnValue(true);
    const html = renderToStaticMarkup(createElement(VoicePractice));
    expect(html).toContain(label);
    expect(html).toContain('class="badge">Optional</span>');
    expect(html).not.toContain("<strong>내 목소리로 점검하기</strong>");
    if (status === "ready") {
      expect(html).toContain('class="secondary recording-delete"');
      expect(html).toContain('class="recording-delete-label"');
      expect(html).toContain('</svg>Delete</span></button>');
      expect(html).not.toContain("Delete recording");
      // The destructive action sits on its own row, after the centered recording controls.
      expect(html).toMatch(/<div class="voice-actions">[\s\S]*?Record again<\/button><\/div><button class="secondary recording-delete"/);
      expect(html).toMatch(/recording-delete[^]*?<svg[^>]*aria-hidden="true"/);
      expect(html).not.toContain("녹음 삭제");
      expect(html).toContain("Your recording");
      expect(html).toContain('aria-label="Your recording"');
      expect(html).toContain("Listen and compare.");
    }
    if (status === "idle") {
      expect(html).not.toContain("recording-delete");
      expect(html).not.toContain("녹음 없이 진행해도 괜찮아요.");
      expect(html).toContain("이동하거나 새로고침하면 앱 안의 녹음은 삭제돼요.");
    }
    if (status === "requesting") {
      expect(html).toContain(">Cancel</button>");
      expect(html).toContain("마이크 사용을 허용해주세요.");
    }
    if (status === "stopping") {
      expect(html.match(/Preparing audio…/g)).toHaveLength(1);
      expect(html).not.toContain("마이크 사용이 종료됐어요.");
    }
  });
});
