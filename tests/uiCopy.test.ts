import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { VoicePractice } from "../src/VoicePractice";
import * as audio from "../src/audioRecorder";
import { initialProgress, updateProgress } from "../src/progress";
import type { Progress, Screen } from "../src/progress";
import { exactExercises } from "../src/data/outputPractice";
import { completeWriting, editWritingDraft } from "../src/writingProgress";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function renderScreen(screen: Screen, overrides: Partial<Progress> = {}) {
  const progress = { ...initialProgress(), ...overrides, currentScreen: screen };
  vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(progress) });
  return renderToStaticMarkup(createElement(App));
}

function readyProgress(): Progress {
  const progress = initialProgress();
  progress.fullRecallCompleted = true;
  progress.conversation.fullRecallCompleted = true;
  for (const id of Object.keys(progress.conversation.ratings)) progress.conversation.ratings[Number(id)] = "effort";
  for (const exercise of exactExercises) progress.output.ratings[exercise.id] = "review";
  progress.writing = completeWriting(editWritingDraft(progress.writing, "My own reflection."));
  return progress;
}

function backButtonClasses(html: string) {
  return [...html.matchAll(/<button\b([^>]*)>(?:(?!<\/button>)[\s\S])*?Back to overview(?:(?!<\/button>)[\s\S])*?<\/button>/g)]
    .map((match) => match[1].match(/class="([^"]*)"/)?.[1] ?? "");
}

describe("approved UI copy and preserved Korean exceptions", () => {
  it("uses concise overview labels and keeps only the unimplemented pronunciation section disabled", () => {
    const html = renderScreen("overview");
    for (const label of ["In this chapter", "필수 학습 완료", "Read and recall", "Required", "Optional · 5 example pairs", ">Start "]) {
      expect(html).toContain(label);
    }
    expect(html.match(/Coming later/g)).toHaveLength(1);
    expect(html.match(/<button[^>]*disabled=""/g)).toHaveLength(1);
    expect(html).toMatch(/<button class="section-row" disabled=""[^]*?Pronunciation[^]*?Coming later/);
    expect(html.match(/class="section-row section-link"/g)).toHaveLength(6);
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

  it("keeps chapter progress separate from the last visited optional section", () => {
    const html = renderScreen("overview", { lastSection: "grammar" });
    expect(html).toContain("필수 학습 완료");
    expect(html).toContain("0 / 4");
    expect(html).toContain("Grammar Focus");
    expect(html).not.toContain("Core sections practiced");
  });

  it("shows core progress without a pass count on Home", () => {
    const html = renderScreen("overview");
    expect(html).not.toMatch(/Pass\s*1|1회독|현재\s*\d+회독/i);
    expect(html).toContain("0 / 4");
    expect(html).toContain("Required");
    expect(html).toContain("Optional");
  });

  it("offers Finish chapter on Home only after all four required sections are done", () => {
    expect(renderScreen("overview")).not.toContain("Finish chapter");
    const html = renderScreen("overview", readyProgress());
    expect(html).toContain("4 / 4");
    expect(html).toContain("READY TO FINISH");
    expect(html).toContain("Finish chapter");
    expect(html.match(/Finish chapter/g)).toHaveLength(1);
    expect(html).not.toContain("Chapter 3 complete ✓");
  });

  it("keeps the completed chapter clear after visiting Review and returning Home", () => {
    const finished = updateProgress(readyProgress(), { type: "finishPass" });
    const reviewed = updateProgress(finished, { type: "navigate", screen: "review" });
    const returned = updateProgress(reviewed, { type: "navigate", screen: "overview" });
    const home = renderScreen("overview", returned);
    expect(home).toContain("Chapter 3 complete ✓");
    expect(home).toContain("Chapter 4 isn&#x27;t available in this pilot yet.");
    expect(home).toContain("Chapter Review");
    expect(home).not.toContain("Finish chapter");
    const progress = renderScreen("complete", returned);
    expect(progress).toContain("Chapter 3 complete");
    expect(progress).toContain("Completed ✓");
    expect(progress).not.toContain("Finish chapter");
  });

  it.each(["read", "recall", "full", "conversation", "output", "grammar", "about", "writing", "review", "complete"] as const)(
    "does not show a learning-pass count on %s",
    (screen) => {
      const html = renderScreen(screen);
      expect(html).not.toMatch(/Pass\s*1|1회독|현재\s*\d+회독/i);
    },
  );

  it.each(["read", "recall", "full", "conversation", "output", "grammar", "about", "writing", "review", "complete"] as const)(
    "uses a boxed Back to overview button wherever it appears on %s",
    (screen) => {
      const html = renderScreen(screen);
      const classes = backButtonClasses(html);
      expect(classes.length).toBeGreaterThan(0);
      for (const className of classes) {
        expect(className.split(/\s+/)).toContain("secondary");
        expect(className.split(/\s+/)).not.toContain("text-button");
      }
    },
  );

  it("starts with all nested chapter sections collapsed on Home", () => {
    const html = renderScreen("overview");
    const navigation = html.match(/<nav class="chapter-navigation"[\s\S]*?<\/nav>/)?.[0] ?? "";
    expect(navigation).toContain('class="chapter-nav-home" aria-current="page"');
    expect(navigation).toContain('class="chapter-nav-home-icon"');
    for (const section of ["My Story", "Real Conversations", "Output Practice", "Weekly Writing"]) {
      expect(navigation).toContain(`<strong>${section}</strong>`);
    }
    expect(navigation.match(/aria-expanded="false"/g)).toHaveLength(4);
    expect(navigation).not.toContain('class="chapter-nav-children"');
    expect(navigation).not.toContain("EXPLORE CHAPTER 3");
  });

  it("marks the current Real Conversations substep in the shared navigation", () => {
    const progress = initialProgress();
    const html = renderScreen("conversation", { conversation: { ...progress.conversation, view: "role", role: "B" } });
    const navigation = html.match(/<nav class="chapter-navigation"[\s\S]*?<\/nav>/)?.[0] ?? "";
    expect(navigation).toContain('aria-current="page">Play B</button>');
  });

  it.each([
    ["output", ["Exact recall", "Variation", "No hint"]],
    ["writing", ["Free", "Guided", "Template"]],
  ] as const)("expands the %s modes only in their active section", (screen, labels) => {
    const html = renderScreen(screen);
    const navigation = html.match(/<nav class="chapter-navigation"[\s\S]*?<\/nav>/)?.[0] ?? "";
    expect(navigation).toContain('aria-expanded="true"');
    for (const label of labels) expect(navigation).toContain(`>${label}</button>`);
  });

  it("keeps Grammar actions in one footer with a single next step", () => {
    const html = renderScreen("grammar");
    const footer = html.match(/<div class="action-footer"[\s\S]*?<\/div><\/div>/)?.[0] ?? "";
    expect(footer).toMatch(/action-footer-back[\s\S]*?Back to overview[\s\S]*?action-footer-middle[\s\S]*?Mark studied[\s\S]*?action-footer-forward[\s\S]*?Next: What About You\?/);
    expect(footer).not.toMatch(/Skip to|Next: Weekly Writing/);
  });

  it("keeps Full Dialogue completion actions together inside its summary card", () => {
    const progress = initialProgress();
    const html = renderScreen("conversation", { conversation: { ...progress.conversation, view: "full", fullRecallCompleted: true } });
    const summary = html.match(/<section class="panel conversation-panel conversation-summary"[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(summary).toMatch(/Back to overview[\s\S]*?Play A[\s\S]*?Next: Output Practice/);
    expect(html.match(/Back to overview/g)).toHaveLength(1);
  });

  it.each(["read", "recall", "full"] as const)(
    "retains the Korean guidance when My Story is expanded on %s",
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
    for (const label of ["My Story · Chunk Recall", "Hint 1", "Hint 2", "Show answer", "Read story", "Back to overview"]) {
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
    for (const label of ["My Story · Full Recall", "My Story complete", "My Story · Korean", "Recalled easily", "To review", "Review chunks", "Next: Real Conversations", "Practice all chunks", "Not rated yet", "Show English"]) {
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
