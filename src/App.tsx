import { useEffect, useReducer, useRef, useState } from "react";
import type { Dispatch } from "react";
import { chunks } from "./data/chapter3";
import { VoicePractice } from "./VoicePractice";
import { ConversationScreen, conversationViewLabel } from "./ConversationScreen";
import { ratingLabels } from "./learningLabels";
import { OutputPractice } from "./OutputPractice";
import { ReviewScreen } from "./ReviewScreen";
import { buildReviewItems } from "./exerciseProgress";
import { WritingScreen } from "./WritingScreen";
import { AboutScreen } from "./AboutScreen";
import { GrammarScreen } from "./GrammarScreen";
import { coreCompletion, isPassReady } from "./chapterCompletion";
import {
  initialProgress,
  parseProgress,
  STORAGE_KEY,
  updateProgress,
  weakIds,
} from "./progress";
import type { Action, Progress, Rating, ReadMode, Screen } from "./progress";

const steps: { screen: Screen; title: string; description: string }[] = [
  {
    screen: "overview",
    title: "Chapter Overview",
    description: "오늘의 학습 살펴보기",
  },
  {
    screen: "read",
    title: "My Story Read",
    description: "읽고, 의미 이해하기",
  },
  {
    screen: "recall",
    title: "Chunk Recall",
    description: "조금씩 꺼내 말하기",
  },
  {
    screen: "full",
    title: "Full Recall",
    description: "하나의 이야기로 말하기",
  },
];
const chapterSections = [
  { screen: "conversation", title: "Real Conversations", kind: "Required" },
  { screen: "output", title: "Output Practice", kind: "Required" },
  { screen: "grammar", title: "Grammar Focus", kind: "Recommended" },
  { screen: "about", title: "What About You?", kind: "Recommended" },
  { screen: "writing", title: "Weekly Writing", kind: "Required" },
  { screen: "review", title: "Chapter Review", kind: "Practice" },
] as const;
type ScreenProps = { progress: Progress; dispatch: Dispatch<Action> };

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M12 5v15M3 4.5c3-1 6-.5 9 1.5 3-2 6-2.5 9-1.5V18c-3-1-6-.5-9 1.5-3-2-6-2.5-9-1.5z" />
    </svg>
  );
}

function SourceNote() {
  return (
    <p className="source-note">
      출처 · 메인 교재 Chapter 3, My Story · 한국어 p.50 / 영어 p.51
    </p>
  );
}

function Overview({ progress, dispatch }: ScreenProps) {
  const studied = Object.values(progress.chunkRatings).filter(Boolean).length;
  const resumeLabel = progress.lastSection === "myStory" ? "My Story" : chapterSections.find((section) => section.screen === progress.lastSection)?.title ?? "My Story";
  const core = coreCompletion(progress);
  return (
    <>
      <section className="chapter-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            CHAPTER 03 <span className="hero-dot">·</span> PASS 1
          </span>
          <h1 tabIndex={-1}>
            Personality
            <br />
            Traits<span className="blue-period">.</span>
          </h1>
          <p>
            나의 성격을 이야기하는 영어.
            <br />
            읽고, 기억하고, 내 목소리로 꺼내보세요.
          </p>
          <div className="hero-tags">
            <span>My Story</span>
            <span>6 chunks</span>
          </div>
        </div>
        <div className="chapter-art" aria-hidden="true">
          <div className="art-orbit" />
          <div className="art-number">03</div>
          <div className="art-label">A LITTLE AT A TIME</div>
          <div className="art-star">✳</div>
        </div>
      </section>
      <div className="overview-grid">
        <section className="panel section-list">
          <div className="section-heading">
            <h2>In this chapter</h2>
            <span className="badge">Pass 1</span>
          </div>
          <button
            className="section-row available"
            onClick={() => dispatch({ type: "navigate", screen: progress.resumeScreen })}
          >
            <span className="section-icon">
              <BookIcon />
            </span>
            <span className="section-info">
              <strong>My Story</strong>
              <small>
                {progress.fullRecallCompleted
                  ? "Completed"
                  : "Read and recall"}
              </small>
            </span>
            <span className="status-tag">Required</span>
            <span aria-hidden="true">↗</span>
          </button>
          {chapterSections.map(({ screen, title, kind }, i) => (
            <button key={screen} className="section-row section-link" onClick={() => dispatch({ type: "navigate", screen })}>
              <span className="section-number">0{i + 2}</span>
              <span className="section-info">
                <strong>{title}</strong>
                {kind && <small>{kind}</small>}
              </span>
              <span className="section-link-arrow" aria-hidden="true">{core.find((item) => item.id === screen)?.completed ? "✓" : "↗"}</span>
            </button>
          ))}
          <button className="section-row" disabled><span className="section-number">08</span><span className="section-info"><strong>Pronunciation</strong></span><span className="later-tag">Coming later</span></button>
          <button className="secondary full-width chapter-progress-link" onClick={() => dispatch({ type: "navigate", screen: "complete" })}>Chapter progress <span aria-hidden="true">→</span></button>
        </section>
        <aside className="overview-aside">
          <section className="panel start-card">
            <span className="eyebrow">작은 시작, 꾸준한 기억</span>
            <h2>{resumeLabel}</h2>
            <p>
              처음부터 완벽하지 않아도 괜찮아요.
              <br />한 문장씩, 익숙해지는 만큼.
            </p>
            <div className="progress-label">
              <span>{progress.lastSection === "myStory" ? "Chunks rated" : "Core sections practiced"}</span>
              <strong>{progress.lastSection === "myStory" ? `${studied} / 6` : `${core.filter((item) => item.completed).length} / 4`}</strong>
            </div>
            <progress max={progress.lastSection === "myStory" ? 6 : 4} value={progress.lastSection === "myStory" ? studied : core.filter((item) => item.completed).length} aria-label={progress.lastSection === "myStory" ? "Chunks rated" : "Core sections practiced"} />
            <button
              className="primary full-width"
              onClick={() => dispatch({ type: "resume" })}
            >
              {progress.lastStudiedAt ? "Continue" : "Start"}{" "}
              <span aria-hidden="true">→</span>
            </button>
            {progress.lastStudiedAt && (
              <button
                className="text-button"
                onClick={() => dispatch({ type: "navigate", screen: "read" })}
              >
                Read again
              </button>
            )}
          </section>
          <div className="gentle-note">
            <span aria-hidden="true">✦</span>
            <div>
              <strong>Completion &gt; Perfection</strong>
              <p>
                속도보다 반복이 중요해요.
                <br />
                언제든 쉬었다가 이어갈 수 있어요.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function ScreenHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1 tabIndex={-1}>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

function Reader({ progress, dispatch }: ScreenProps) {
  const modes: { id: ReadMode; label: string }[] = [
    { id: "korean", label: "Korean" },
    { id: "english", label: "English" },
    { id: "together", label: "Both" },
  ];
  return (
    <>
      <ScreenHeading
        eyebrow="01 / READ"
        title="My Story"
        description="Read the story at your own pace."
      />
      <section className="panel reader-panel">
        <div className="reader-toolbar">
          <h2>Personality Traits</h2>
          <div className="segmented" role="group" aria-label="본문 언어 선택">
            {modes.map((mode) => (
              <button
                key={mode.id}
                aria-pressed={progress.readMode === mode.id}
                onClick={() => dispatch({ type: "readMode", mode: mode.id })}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <div
          className={`story-content ${progress.readMode === "together" ? "bilingual" : ""}`}
        >
          {chunks.map((chunk) => (
            <div className="story-row" key={chunk.id}>
              <span className="chunk-number">
                {String(chunk.id).padStart(2, "0")}
              </span>
              {progress.readMode !== "english" && (
                <p lang="ko">{chunk.korean.join(" ")}</p>
              )}
              {progress.readMode !== "korean" && (
                <p lang="en" className="english-text">
                  {chunk.english.join(" ")}
                </p>
              )}
            </div>
          ))}
        </div>
        <SourceNote />
      </section>
      <div className="page-actions">
        <button
          className="secondary"
          onClick={() => dispatch({ type: "navigate", screen: "overview" })}
        >
          ← Overview
        </button>
        <button
          className="primary"
          onClick={() => dispatch({ type: "practice" })}
        >
          Start recall <span aria-hidden="true">→</span>
        </button>
      </div>
    </>
  );
}

function Recall({ progress, dispatch }: ScreenProps) {
  const chunk = chunks.find(
    (c) => c.id === progress.queue[progress.queueIndex],
  )!;
  const [hint, setHint] = useState<0 | 1 | 2>(0);
  const [answer, setAnswer] = useState(false);
  const isWeakPractice = progress.queue.length !== 6;
  const revealHint = (level: 1 | 2) => {
    setHint(level);
    dispatch({ type: "hint", level });
  };
  return (
    <>
      <ScreenHeading
        eyebrow={`02 / ${isWeakPractice ? "PRACTICE AGAIN" : "CHUNK RECALL"}`}
        title={isWeakPractice ? "Review chunks" : "Recall in chunks"}
        description="Read the Korean text. Recall it in English."
      />
      <section className="panel recall-panel">
        <div className="recall-top">
          <span>My Story · Chunk {chunk.id}</span>
          <strong>
            {progress.queueIndex + 1} <span>/ {progress.queue.length}</span>
          </strong>
        </div>
        <progress
          value={progress.queueIndex + 1}
          max={progress.queue.length}
          aria-label="현재 연습 위치"
        />
        <div className="prompt-block">
          <span className="eyebrow">Korean</span>
          <div className="prompt-text">
            {chunk.korean.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
        <VoicePractice />
        <div className="hint-actions">
          <button
            className="secondary"
            aria-pressed={hint === 1}
            onClick={() => revealHint(1)}
          >
            Hint 1
          </button>
          <button
            className="secondary"
            aria-pressed={hint === 2}
            onClick={() => revealHint(2)}
          >
            Hint 2
          </button>
          <button
            className="primary"
            aria-expanded={answer}
            onClick={() => setAnswer(!answer)}
          >
            {answer ? "Hide answer" : "Show answer"}
          </button>
        </div>
        <div aria-live="polite">
          {hint > 0 && !answer && (
            <div className="hint-box">
              <span className="eyebrow">
                Hint {hint} · {hint === 1 ? "Sentence starters" : "Fill in the blanks"}
              </span>
              {(hint === 1 ? chunk.hint1 : chunk.hint2).map((line, i) => (
                <p lang="en" key={i}>
                  {line}
                </p>
              ))}
            </div>
          )}
          {answer && (
            <div className="answer-box">
              <span className="eyebrow">English</span>
              {chunk.english.map((line, i) => (
                <p lang="en" key={i}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
        {answer && (
          <div className="rating-area">
            <h2>어땠나요?</h2>
            <p>
              선택하면 저장하고{" "}
              {progress.queueIndex === progress.queue.length - 1
                ? "Full Recall로 이동해요."
                : "다음 Chunk로 이동해요."}
            </p>
            <div className="rating-buttons">
              {(Object.keys(ratingLabels) as Rating[]).map((rating) => (
                <button
                  key={rating}
                  className={`rating ${rating}`}
                  onClick={() => dispatch({ type: "rate", rating })}
                >
                  <span aria-hidden="true">
                    {rating === "immediate"
                      ? "✓"
                      : rating === "effort"
                        ? "≈"
                        : "↻"}
                  </span>
                  {ratingLabels[rating]}
                </button>
              ))}
            </div>
          </div>
        )}
        <SourceNote />
      </section>
      <div className="page-actions">
        <button
          className="secondary"
          onClick={() =>
            progress.queueIndex > 0
              ? dispatch({ type: "previous" })
              : dispatch({ type: "navigate", screen: "read" })
          }
        >
          ← {progress.queueIndex > 0 ? "Previous chunk" : "Read story"}
        </button>
        <button
          className="text-button"
          onClick={() => dispatch({ type: "navigate", screen: "overview" })}
        >
          Back to overview
        </button>
      </div>
    </>
  );
}

function FullRecall({ progress, dispatch }: ScreenProps) {
  const [spoken, setSpoken] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const weak = weakIds(progress);
  const remembered = chunks.filter(
    (c) => progress.chunkRatings[c.id] === "immediate",
  );
  const unassessed = chunks.filter((c) => !progress.chunkRatings[c.id]);
  return (
    <>
      <ScreenHeading
        eyebrow="03 / FULL RECALL"
        title="Recall the whole story"
      />
      <section className="panel full-story">
        <div className="section-heading">
          <h2>My Story · Korean</h2>
          <span className="badge">Step 1</span>
        </div>
        <div className="full-korean">
          {chunks.map((c) => (
            <p key={c.id}>{c.korean.join(" ")}</p>
          ))}
        </div>
        <VoicePractice />
        <button className="primary full-width" onClick={() => setSpoken(true)}>
          {spoken ? "Done ✓" : "Done speaking"}
        </button>
        <SourceNote />
      </section>
      {(spoken || progress.fullRecallCompleted) && (
        <section className="panel reflection">
          <div className="section-heading">
            <h2>
              {progress.fullRecallCompleted
                ? "My Story complete"
                : "Your progress"}
            </h2>
            <span className="badge">Self check</span>
          </div>
          <div className="reflection-grid">
            <div>
              <h3>
                Recalled easily <span>{remembered.length}</span>
              </h3>
              {remembered.length ? (
                <ul>
                  {remembered.map((c) => (
                    <li key={c.id}>
                      <strong>Chunk {c.id}</strong>
                      <span>
                        {ratingLabels[progress.chunkRatings[c.id] as Rating]}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">천천히 다시 만나도 괜찮아요.</p>
              )}
            </div>
            <div>
              <h3>
                To review <span>{weak.length}</span>
              </h3>
              {weak.length ? (
                <ul>
                  {weak.map((id) => (
                    <li key={id}>
                      <strong>Chunk {id}</strong>
                      <span>
                        {ratingLabels[progress.chunkRatings[id] as Rating]}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No chunks to review</p>
              )}
            </div>
          </div>
          {unassessed.length > 0 && (
            <p className="muted">
              Not rated yet: {unassessed.map((c) => `Chunk ${c.id}`).join(", ")}
            </p>
          )}
          <div className="reflection-actions">
            <button
              className="secondary"
              disabled={!weak.length}
              onClick={() => dispatch({ type: "practice", weakOnly: true })}
            >
              Review chunks{weak.length > 0 && ` (${weak.length})`}
            </button>
            <button
              className="primary"
              disabled={!spoken && !progress.fullRecallCompleted}
              onClick={() => {
                dispatch({ type: "complete" });
                dispatch({ type: "navigate", screen: "overview" });
              }}
            >
              Finish
            </button>
          </div>
        </section>
      )}
      <div className="page-actions">
        <button
          className="secondary"
          onClick={() => dispatch({ type: "practice" })}
        >
          ← Practice all chunks
        </button>
        <button
          className="text-button"
          aria-expanded={showAnswer}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? "Hide English" : "Show English"}
        </button>
      </div>
      {showAnswer && (
        <section className="panel answer-box" aria-label="전체 영어 원문">
          {chunks.map((c) => (
            <p lang="en" key={c.id}>
              {c.english.join(" ")}
            </p>
          ))}
        </section>
      )}
    </>
  );
}

function ChapterCompletion({ progress, dispatch }: ScreenProps) {
  const items = coreCompletion(progress);
  const ready = isPassReady(progress);
  const complete = ready && progress.pass1CompletedAt !== null;
  return (
    <>
      <ScreenHeading eyebrow="CHAPTER 3 / PASS 1" title={complete ? "One chapter, more confidence." : "Your chapter, at your pace."} description={complete ? "Keep what you learned. Come back whenever you like." : "Build on what you’ve practiced. There’s no need to rush."} />
      <section className="panel chapter-completion">
        <div className="section-heading"><h2>{complete ? "Pass 1 complete" : "Core learning"}</h2><span className="badge">Chapter 3</span></div>
        <ul className="conversation-checklist">
          {items.map((item) => (
            <li key={item.id}><button className="text-button" onClick={() => dispatch({ type: "navigate", screen: item.id === "myStory" ? progress.resumeScreen : item.id })}>{item.label} <span aria-hidden="true">↗</span></button><span className={item.completed ? "is-complete" : "muted"}>{item.completed ? "Practiced ✓" : "Open to practice"}</span></li>
          ))}
        </ul>
        <p className="muted">Grammar Focus and What About You? are optional for this pass.</p>
        <div className="conversation-cta">
          {ready && !complete && <button className="primary" onClick={() => dispatch({ type: "finishPass" })}>Finish Pass 1 <span aria-hidden="true">✓</span></button>}
          <button className={complete ? "primary" : "secondary"} onClick={() => dispatch({ type: "navigate", screen: "review" })}>Chapter Review <span aria-hidden="true">→</span></button>
          <button className="secondary" onClick={() => dispatch({ type: "navigate", screen: "overview" })}>Overview</button>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [storageError, setStorageError] = useState(false);
  const [progress, dispatch] = useReducer(updateProgress, undefined, () => {
    try {
      return parseProgress(localStorage.getItem(STORAGE_KEY));
    } catch {
      return initialProgress();
    }
  });
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  const chunkId = progress.queue[progress.queueIndex];
  const conversationPosition = `${progress.conversation.view}-${progress.conversation.role}-${progress.conversation.positions[progress.conversation.role]}`;
  const outputPosition = `${progress.output.mode}-${progress.output.cursors[progress.output.mode]}-${progress.output.finished[progress.output.mode]}`;
  const reviewPosition = `${progress.review.queue.join(",")}-${progress.review.index}-${progress.review.completed}`;
  useEffect(() => {
    main.current?.querySelector<HTMLHeadingElement>("h1")?.focus();
    window.scrollTo(0, 0);
  }, [progress.currentScreen, chunkId, conversationPosition, outputPosition, reviewPosition]);
  const stepIndex = steps.findIndex((s) => s.screen === progress.currentScreen);
  const rated = Object.values(progress.chunkRatings).filter(Boolean).length;
  const sectionTitle = chapterSections.find((section) => section.screen === progress.currentScreen)?.title;
  const isStoryScreen = stepIndex >= 0;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => dispatch({ type: "navigate", screen: "overview" })}
        >
          <span className="brand-icon">
            <BookIcon />
          </span>
          English Output
          <span className="brand-caption">배운 영어를, 내 영어로.</span>
        </button>
        <span className="topbar-label">
          CHAPTER 03 <span> / </span> PASS 1
        </span>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <span className="eyebrow">MY LEARNING</span>
            <h2>Chapter 3</h2>
            <p>Personality Traits</p>
          </div>
          <nav aria-label="Chapter 3 학습 단계" className={!isStoryScreen ? "story-navigation-collapsed" : undefined}>
            <ol className="step-list">
              {steps.map((step, i) => (
                <li key={step.screen}>
                  <button
                    aria-current={
                      progress.currentScreen === step.screen
                        ? "step"
                        : undefined
                    }
                    onClick={() =>
                      dispatch({ type: "navigate", screen: step.screen })
                    }
                  >
                    <span className="step-number">
                      {i === 0 ? "⌂" : `0${i}`}
                    </span>
                    <span>
                      <strong>{step.title}</strong>
                      <small>{step.description}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <nav className="chapter-section-nav" aria-label="Chapter sections">
            <span className="eyebrow">EXPLORE CHAPTER 3</span>
            {!isStoryScreen && <button onClick={() => dispatch({ type: "navigate", screen: progress.resumeScreen })}>← My Story</button>}
            {chapterSections.map((section) => <button key={section.screen} aria-current={progress.currentScreen === section.screen ? "page" : undefined} onClick={() => dispatch({ type: "navigate", screen: section.screen })}>{section.title}</button>)}
            <button aria-current={progress.currentScreen === "complete" ? "page" : undefined} onClick={() => dispatch({ type: "navigate", screen: "complete" })}>Chapter progress</button>
          </nav>
          <div className="sidebar-progress">
            <span>My Story progress</span>
            <strong>
              {rated}
              <small> / 6 Chunk</small>
            </strong>
            <progress max={6} value={rated} aria-label="평가한 Chunk 수" />
            <p>
              {progress.fullRecallCompleted
                ? "전체 말하기 완료 ✓"
                : "한 번 더 꺼내볼 때마다 익숙해져요."}
            </p>
          </div>
        </aside>
        <main id="main-content" ref={main}>
          <nav className="breadcrumb" aria-label="현재 위치">
            <span>Chapter 3</span>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            {(stepIndex > 0 || progress.currentScreen === "conversation") && (
              <>
                <span>{progress.currentScreen === "conversation" ? "Real Conversations" : "My Story"}</span>
                <span className="breadcrumb-separator" aria-hidden="true">/</span>
              </>
            )}
            <span aria-current="page">
              {progress.currentScreen === "conversation" ? conversationViewLabel(progress.conversation) : sectionTitle ?? (progress.currentScreen === "complete" ? "Pass 1" : stepIndex > 0
                ? steps[stepIndex].title.replace("My Story ", "")
                : "Overview")}
            </span>
          </nav>
          {storageError && (
            <div className="storage-warning" role="alert">
              진행 기록을 저장할 수 없어요. 현재 학습은 가능하지만 새로고침하면
              사라질 수 있어요. 브라우저 저장 공간 설정을 확인해주세요.
            </div>
          )}
          {progress.currentScreen === "overview" && (
            <Overview progress={progress} dispatch={dispatch} />
          )}
          {progress.currentScreen === "read" && (
            <Reader progress={progress} dispatch={dispatch} />
          )}
          {progress.currentScreen === "recall" && (
            <Recall
              key={`${progress.queue.join("-")}:${progress.queueIndex}`}
              progress={progress}
              dispatch={dispatch}
            />
          )}
          {progress.currentScreen === "full" && (
            <FullRecall progress={progress} dispatch={dispatch} />
          )}
          {progress.currentScreen === "conversation" && <ConversationScreen progress={progress.conversation} dispatch={(action) => dispatch({ type: "conversation", action })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} />}
          {progress.currentScreen === "output" && <OutputPractice progress={progress.output} onChange={(value) => dispatch({ type: "output", value })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} />}
          {progress.currentScreen === "review" && <ReviewScreen progress={progress.review} onChange={(value) => dispatch({ type: "review", value })} eligibleItems={buildReviewItems({ chunkRatings: progress.chunkRatings, conversationRatings: progress.conversation.ratings, outputRatings: progress.output.ratings })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} />}
          {progress.currentScreen === "writing" && <WritingScreen progress={progress.writing} onChange={(value) => dispatch({ type: "writing", value })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} />}
          {progress.currentScreen === "about" && <AboutScreen progress={progress.about} onChange={(value) => dispatch({ type: "about", value })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} />}
          {progress.currentScreen === "grammar" && <GrammarScreen progress={progress.grammar} onChange={(value) => dispatch({ type: "grammar", value })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} />}
          {progress.currentScreen === "complete" && <ChapterCompletion progress={progress} dispatch={dispatch} />}
          <footer className="page-footer">
            <span>조금씩, 꾸준히, 내 것으로.</span>
            <span>Chapter 3 · {sectionTitle ?? (progress.currentScreen === "complete" ? "Pass 1" : "My Story")}</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
