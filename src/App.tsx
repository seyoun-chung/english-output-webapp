import { createPortal } from "react-dom";
import { createContext, useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import type { Dispatch, ReactNode } from "react";
import { chapterCatalog, chapterCode, chapterLabel, chapterName, type ChapterId, type ChapterMetadata } from "./data/chapters";
import { chapterContentById } from "./data/chapterContent";
import { VoicePractice } from "./VoicePractice";
import { ConversationScreen, conversationViewLabel } from "./ConversationScreen";
import { isConversationComplete } from "./conversationProgress";
import { ratingLabels } from "./learningLabels";
import { OutputPractice } from "./OutputPractice";
import { ReviewScreen } from "./ReviewScreen";
import { buildReviewItems, isVariationComplete, studyRatings, hasCompletedReview } from "./exerciseProgress";
import type { PracticeMode } from "./exerciseProgress";
import { WritingScreen } from "./WritingScreen";
import type { WritingMode } from "./writingProgress";
import { AboutScreen } from "./AboutScreen";
import { GrammarScreen } from "./GrammarScreen";
import { ActionFooter } from "./ActionFooter";
import { RecallRatingButtons } from "./RecallRatingButtons";
import { completionForPass, coreCompletion, isPassReady } from "./chapterCompletion";
import {
  activePassProgress,
  initialProgress,
  STORAGE_KEY,
  weakIds,
} from "./progress";
import type { Action, PassProgress, Rating, ReadMode, Screen } from "./progress";
import { updateAppProgress, type AppProgress, type AppAction } from "./appProgress";
import { readProtectedProgress, restoreProgressBackup, saveProgressIfUnchanged } from './progressBackup';
import { ProgressBackupPanel } from './ProgressBackupPanel';
import { LocalSyncPanel } from './LocalSyncPanel';
import { AccountSyncPanel } from './AccountSyncPanel';
import type { SyncTransport } from './syncClient';
import { ChapterContentProvider, useChapterContent } from "./ChapterContentContext";
import { AutomaticScreen } from "./AutomaticScreen";
import { usageEventsForTransition, type UsageRecorder } from "./usageTracking";
import { trackAnalyticsPage } from './googleAnalytics';

const storySteps: { screen: Screen; title: string; description: string }[] = [
  {
    screen: "read",
    title: "Read",
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
const conversationSteps = [
  { key: "read", title: "Read" },
  { key: "A", title: "Play A" },
  { key: "B", title: "Play B" },
  { key: "full", title: "Full Dialogue" },
] as const;
const outputModes: { mode: PracticeMode; title: string }[] = [
  { mode: "exact", title: "Exact recall" },
  { mode: "variation", title: "Variation" },
  { mode: "no-hint", title: "No hint" },
];
const writingModes: { mode: WritingMode; title: string }[] = [
  { mode: "free", title: "Free" },
  { mode: "guided", title: "Guided" },
  { mode: "template", title: "Template" },
];
const chapterSections = [
  { screen: "conversation", title: "Real Conversations", kind: "Required" },
  { screen: "output", title: "Output Practice", kind: "Required" },
  { screen: "grammar", title: "Grammar Focus", kind: "Optional" },
  { screen: "about", title: "What About You?", kind: "Optional" },
  { screen: "writing", title: "Weekly Writing", kind: "Required" },
  { screen: "review", title: "Chapter Review", kind: "Practice" },
] as const;
type ScreenProps = { progress: PassProgress; dispatch: Dispatch<Action> };
function MobileLearningMenu({ activeId, onSelect, sectionLabel, children }: { activeId: ChapterId; onSelect: (id: ChapterId) => void; sectionLabel: string; children: ReactNode }) {
  const [pane, setPane] = useState<"chapters" | "sections" | null>(null);
  const open = pane === "chapters";
  const current = chapterCatalog.find(chapter => chapter.id === activeId)!;
  return <div className="learning-menu">
    <section className="mobile-chapter-picker" aria-label="챕터와 학습 영역 선택">
    <button className="mobile-chapter-toggle" aria-expanded={open} aria-controls="mobile-chapter-options" onClick={() => setPane(open ? null : "chapters")}>
      <span><strong>챕터 선택 · Chapter {activeId} / 12</strong><small>{current.title}</small></span>
      <span aria-hidden="true">{open ? "⌃" : "⌄"}</span>
    </button>
    {open && <div id="mobile-chapter-options" className="mobile-chapter-options">
      {chapterCatalog.map(chapter => <button key={chapter.id} aria-label={`Chapter ${chapter.id} · ${chapter.title}`} aria-current={chapter.id === activeId ? "page" : undefined} disabled={!chapterContentById[chapter.id]} onClick={() => { setPane(null); onSelect(chapter.id); }}>
        <strong>Chapter {String(chapter.id).padStart(2, "0")}</strong><small>{chapter.title}</small>
      </button>)}
    </div>}
    <button className="mobile-chapter-toggle mobile-section-toggle" aria-expanded={pane === "sections"} aria-controls="mobile-learning-options" onClick={() => setPane(pane === "sections" ? null : "sections")}>
      <span><strong>학습 영역 · {sectionLabel}</strong><small>현재 챕터에서 공부할 내용</small></span><span aria-hidden="true">{pane === "sections" ? "⌃" : "⌄"}</span>
    </button>
    </section>
    <div id="mobile-learning-options" className="learning-menu-sections" data-open={pane === "sections"} onClick={event => {
      const button = (event.target as Element).closest("button");
      if (button && !button.hasAttribute("aria-expanded")) setPane(null);
    }}>{children}</div>
  </div>;
}
function ChapterLibrary({ progress, onOpen, onAutomatic, onHome }: { progress: AppProgress; onOpen: (chapterId: ChapterId) => void; onAutomatic: () => void; onHome: () => void }) {
  return (
    <div className="library-shell">
      <header className="topbar library-topbar">
        <span className="brand" aria-label="English Output">
          <span className="brand-icon"><img src="/favicon.svg" alt="" /></span>
          English Output
          <span className="brand-caption">배운 영어를, 내 영어로.</span>
        </span>
        <span className="topbar-label">CHAPTER LIBRARY</span>
        <button className="topbar-library library-home" onClick={onHome} title={`Chapter ${progress.activeChapterId} Home으로 돌아가기`}><HomeIcon /><span>Home</span></button>
      </header>
      <main className="chapter-library" id="main-content">
        <header className="library-heading">
          <p className="eyebrow">MY TEXTBOOK</p>
          <h1 tabIndex={-1}>Choose a chapter</h1>
          <p>학습할 Chapter를 선택하세요. 각 Chapter의 진도는 따로 저장돼요.</p>
        </header>
        <section className="automatic-library-entry">
          <div>
            <p className="eyebrow">PASS 4+ · AUTOMATIC</p>
            <h2>Mixed review across chapters</h2>
            <p>여러 Chapter의 복습 문제를 섞어 풀고, 배운 표현으로 글을 써요.</p>
          </div>
          <button className="primary" onClick={onAutomatic}>Open Pass 4+ <span aria-hidden="true">→</span></button>
        </section>
        <div className="chapter-grid">
          {chapterCatalog.map((chapter) => {
            const available = chapterContentById[chapter.id] !== undefined;
            const saved = progress.chapters[chapter.id];
            const pass = saved?.activePass ?? 1;
            return (
              <article className={`chapter-card ${available ? "is-available" : "is-locked"}`} key={chapter.id}>
                <div><span className="eyebrow">{chapterCode(chapter)} · WEEK {chapter.week}</span><h2>{chapter.title}</h2></div>
                {available ? (
                  <button className="primary" onClick={() => onOpen(chapter.id)}>
                    {saved ? `Continue Pass ${pass}` : "Start Pass 1"} <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <span className="badge">Source setup in progress</span>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function breadcrumbParts(progress: PassProgress, metadata: ChapterMetadata): string[] {
  const name = chapterName(metadata);
  const chapter = progress.pass > 1 ? `${name} · Pass ${progress.pass}` : name;
  switch (progress.currentScreen) {
    case "overview": return [chapter, "Overview"];
    case "read": return [chapter, "My Story", "Read"];
    case "recall": return [chapter, "My Story", "Chunk Recall"];
    case "full": return [chapter, "My Story", "Full Recall"];
    case "conversation": return [chapter, "Real Conversations", conversationViewLabel(progress.conversation)];
    case "output": return [chapter, "Output Practice", { exact: "Exact recall", variation: "Variation", "no-hint": "No hint" }[progress.output.mode]];
    case "writing": return [chapter, "Weekly Writing", { free: "Free", guided: "Guided", template: "Template" }[progress.writing.mode]];
    case "review": return [chapter, "Chapter Review"];
    case "grammar": return [chapter, "Grammar Focus"];
    case "about": return [chapter, "What About You?"];
    case "complete": return [chapter, "Chapter progress"];
  }
}

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

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 21v-7h6v7" />
    </svg>
  );
}

function ChapterNavigation({ progress, dispatch }: ScreenProps) {
  const { metadata } = useChapterContent();
  const currentChapterName = chapterName(metadata);
  const currentChapterCode = chapterCode(metadata);
  const isStory = progress.currentScreen === "read" || progress.currentScreen === "recall" || progress.currentScreen === "full";
  const isConversation = progress.currentScreen === "conversation";
  type Group = "story" | "conversation" | "output" | "writing";
  const activeGroup: Group | null = isStory ? "story" : isConversation ? "conversation"
    : progress.currentScreen === "output" ? "output" : progress.currentScreen === "writing" ? "writing" : null;
  const [expanded, setExpanded] = useState<Group | null>(activeGroup);
  useEffect(() => setExpanded(activeGroup), [activeGroup]);
  const toggle = (group: Group) => setExpanded(current => current === group ? null : group);
  const conversationActive = (key: typeof conversationSteps[number]["key"]) =>
    isConversation && (key === "read" ? progress.conversation.view === "read"
      : key === "full" ? progress.conversation.view === "full"
      : (progress.conversation.view === "role" || progress.conversation.view === "role-summary") && progress.conversation.role === key);
  const openConversation = (key: typeof conversationSteps[number]["key"]) => {
    dispatch({ type: "navigate", screen: "conversation" });
    dispatch({ type: "conversation", action: key === "A" || key === "B"
      ? { type: "role", role: key }
      : { type: "view", view: key } });
  };
  const openOutput = (mode: PracticeMode) => {
    setExpanded("output");
    dispatch({ type: "output", value: { ...progress.output, mode } });
  };
  const openWriting = (mode: WritingMode) => {
    setExpanded("writing");
    dispatch({ type: "writing", value: { ...progress.writing, mode } });
  };
  const storyChildren = () => storySteps.map((step) => (
    <li key={step.screen}>
      <button aria-current={progress.currentScreen === step.screen ? "page" : undefined} onClick={() => dispatch({ type: "navigate", screen: step.screen })}>
        <span>{step.title}</span><small>{step.description}</small>
      </button>
    </li>
  ));
  const conversationChildren = () => conversationSteps.map((step) => (
    <li key={step.key}>
      <button aria-current={conversationActive(step.key) ? "page" : undefined} onClick={() => openConversation(step.key)}>{step.title}</button>
    </li>
  ));
  const outputChildren = () => outputModes.map(({ mode, title }) => (
    <li key={mode}><button aria-current={progress.currentScreen === "output" && progress.output.mode === mode ? "page" : undefined} onClick={() => openOutput(mode)}>{title}</button></li>
  ));
  const writingChildren = () => writingModes.map(({ mode, title }) => (
    <li key={mode}><button aria-current={progress.currentScreen === "writing" && progress.writing.mode === mode ? "page" : undefined} onClick={() => openWriting(mode)}>{title}</button></li>
  ));
  const disclosure = (group: Group, label: string, number: string, count: string) => (
    <button className="chapter-nav-parent" aria-expanded={expanded === group} onClick={() => toggle(group)}>
      <span className="chapter-nav-number">{number}</span><strong>{label}</strong><small>{count}</small><span className="chapter-nav-chevron" aria-hidden="true">⌄</span>
    </button>
  );
  return (
    <nav className="chapter-navigation" aria-label={`${currentChapterName} navigation`}>
      <button className="chapter-nav-home" aria-current={progress.currentScreen === "overview" ? "page" : undefined} onClick={() => dispatch({ type: "navigate", screen: "overview" })}>
        <span className="chapter-nav-home-icon"><HomeIcon /></span>
        <span><strong>Home</strong><small>오늘의 학습 살펴보기</small></span>
      </button>
      <span className="eyebrow chapter-nav-label">{currentChapterCode}</span>
      <span className="mobile-learning-label">현재 챕터의 학습 영역</span>
      <ol className="chapter-nav-list">
        <li className={isStory ? "chapter-nav-group is-active" : "chapter-nav-group"}>
          {disclosure("story", "My Story", "01", "3 steps")}
          {expanded === "story" && <ol id="chapter-nav-story" className="chapter-nav-children">{storyChildren()}</ol>}
        </li>
        {progress.pass === 2 ? <>
          <li className={isConversation ? "chapter-nav-group is-active" : "chapter-nav-group"}>
            {disclosure("conversation", "Real Conversations", "02", "4 steps")}
            {expanded === "conversation" && <ol id="chapter-nav-conversation" className="chapter-nav-children">{conversationChildren()}</ol>}
          </li>
          <li className={progress.currentScreen === "output" ? "chapter-nav-group is-active" : "chapter-nav-group"}>
            {disclosure("output", "Output Practice", "03", "3 modes")}
            {expanded === "output" && <ol id="chapter-nav-output" className="chapter-nav-children">{outputChildren()}</ol>}
          </li>
          {chapterSections.slice(2).map((section, index) => (
            <li className={progress.currentScreen === section.screen ? "chapter-nav-group is-active" : "chapter-nav-group"} key={section.screen}>
              {section.screen === "writing"
                ? <>{disclosure("writing", section.title, `0${index + 4}`, "3 modes")}{expanded === "writing" && <ol id="chapter-nav-writing" className="chapter-nav-children">{writingChildren()}</ol>}</>
                : section.screen === "review"
                  ? <button className="chapter-nav-parent" aria-current={progress.currentScreen === "review" ? "page" : undefined} onClick={() => dispatch({ type: "navigate", screen: "review" })}><span className="chapter-nav-number">0{index + 4}</span><strong>{section.title}</strong><small>Core</small></button>
                  : <button className="chapter-nav-parent" disabled><span className="chapter-nav-number">0{index + 4}</span><strong>{section.title}</strong><small>Next pass</small></button>}
            </li>
          ))}
        </> : <>
          <li className={isConversation ? "chapter-nav-group is-active" : "chapter-nav-group"}>
            {disclosure("conversation", "Real Conversations", "02", "4 steps")}
            {expanded === "conversation" && <ol id="chapter-nav-conversation" className="chapter-nav-children">{conversationChildren()}</ol>}
          </li>
          {chapterSections.slice(1).map((section, index) => (
            <li className={progress.currentScreen === section.screen ? "chapter-nav-group is-active" : "chapter-nav-group"} key={section.screen}>
              {section.screen === "output" || section.screen === "writing"
                ? <>
                  {disclosure(section.screen, section.title, `0${index + 3}`, "3 modes")}
                  {expanded === section.screen && <ol id={`chapter-nav-${section.screen}`} className="chapter-nav-children">{section.screen === "output" ? outputChildren() : writingChildren()}</ol>}
                </>
                : <button className="chapter-nav-parent" aria-current={progress.currentScreen === section.screen ? "page" : undefined} onClick={() => dispatch({ type: "navigate", screen: section.screen })}>
                  <span className="chapter-nav-number">0{index + 3}</span><strong>{section.title}</strong>
                </button>}
            </li>
          ))}
        </>}
      </ol>
      {expanded && (
        <ol className="chapter-nav-mobile-steps" aria-label={`${expanded} choices`}>
          {expanded === "story" ? storyChildren() : expanded === "conversation" ? conversationChildren() : expanded === "output" ? outputChildren() : writingChildren()}
        </ol>
      )}
      <button className="chapter-nav-progress" aria-current={progress.currentScreen === "complete" ? "page" : undefined} onClick={() => dispatch({ type: "navigate", screen: "complete" })}><span>Chapter progress</span><span aria-hidden="true">↗</span></button>
      {progress.pass === 2 && <button className="text-button" onClick={() => dispatch({ type: "selectPass", pass: 1 })}>Review Pass 1</button>}
      {progress.pass === 3 && <><button className="text-button" onClick={() => dispatch({ type: "selectPass", pass: 2 })}>Review Pass 2</button><button className="text-button" onClick={() => dispatch({ type: "selectPass", pass: 1 })}>Review Pass 1</button></>}
    </nav>
  );
}

function SourceNote() {
  const { metadata } = useChapterContent();
  return (
    <p className="source-note">
      출처 · 메인 교재 {chapterName(metadata)}, My Story · 한국어 p.{metadata.pages.myStoryKorean} / 영어 p.{metadata.pages.myStoryEnglish}
    </p>
  );
}

function Pass2Overview({ progress, dispatch }: ScreenProps) {
  const content = useChapterContent();
  const { metadata } = content;
  const currentChapterName = chapterName(metadata);
  const currentChapterCode = chapterCode(metadata);
  const storyComplete = progress.fullRecallCompleted;
  const conversationComplete = isConversationComplete(progress.conversation, content.conversations);
  const outputComplete = isVariationComplete(progress.output, content.exercises);
  const reviewComplete = hasCompletedReview(progress.review);
  const writingComplete = progress.writing.completed;
  const complete = isPassReady(progress, content) && progress.completedAt !== null;
  const coreCompleted = [storyComplete, conversationComplete, outputComplete, reviewComplete, writingComplete].filter(Boolean).length;
  const next = !storyComplete ? {
    eyebrow: "PASS 2 · REINFORCE", title: "Full Recall first",
    description: "영어를 보기 전에 한국어 이야기 전체를 떠올려보세요.", label: "Start Full Recall",
    action: () => dispatch({ type: "navigate", screen: "full" }),
  } : !conversationComplete ? {
    eyebrow: "MY STORY COMPLETE", title: "Real Conversations next",
    description: "A와 B 역할, Full Dialogue를 새 기록으로 다시 꺼내보세요.", label: "Start Real Conversations",
    action: () => dispatch({ type: "navigate", screen: "conversation" }),
  } : !outputComplete ? {
    eyebrow: "CONVERSATION COMPLETE", title: "Variation next",
    description: "Source에 있는 여섯 문장을 다른 상황에서 다시 꺼내보세요.", label: "Start Variation",
    action: () => dispatch({ type: "output", value: { ...progress.output, mode: "variation" } }),
  } : !reviewComplete ? {
    eyebrow: "OUTPUT COMPLETE", title: "Chapter Review next",
    description: "Review all questions or just the difficult ones.", label: "Start Chapter Review",
    action: () => dispatch({ type: "navigate", screen: "review" }),
  } : !writingComplete ? {
    eyebrow: "REVIEW COMPLETE", title: "Weekly Writing next",
    description: `이번 회독의 새 글을 하나 완성해 ${currentChapterName} 표현을 내 이야기로 연결하세요.`, label: "Start Weekly Writing",
    action: () => dispatch({ type: "navigate", screen: "writing" }),
  } : !complete ? {
    eyebrow: "5 CORE AREAS COMPLETE", title: "Ready to finish Pass 2",
    description: "다섯 Core 기록이 모두 저장됐어요. 완료 상태는 마지막 확인 후 명시적으로 저장됩니다.", label: "Review completion",
    action: () => dispatch({ type: "navigate", screen: "complete" }),
  } : {
    eyebrow: "PASS 2 COMPLETE", title: `${currentChapterName} · Pass 2 complete ✓`,
    description: "완료 상태와 다섯 Core 기록이 이 브라우저에 저장됐어요.", label: "View completion",
    action: () => dispatch({ type: "navigate", screen: "complete" }),
  };
  return (
    <>
      <section className="chapter-hero">
        <div className="hero-copy">
          <span className="eyebrow">{currentChapterCode} · PASS 2 · REINFORCE</span>
          <h1 tabIndex={-1}>{metadata.title}<span className="blue-period">.</span></h1>
          <p>전체 이야기를 다시 꺼내고, 대화와 Source Variation으로 이어가세요.<br />필요할 때 보조 경로로 돌아갈 수 있어요.</p>
        </div>
        <div className="chapter-art" aria-hidden="true">
          <div className="art-orbit" /><div className="art-number">02</div>
          <div className="art-label">REINFORCE</div><div className="art-star">✳</div>
        </div>
      </section>
      <div className="overview-grid">
        <section className="panel section-list">
          <div className="section-heading">
            <h2>Pass 2 focus</h2><span className="badge">5 Core areas</span>
          </div>
          <div className="chapter-core-progress">
            <div className="progress-label"><span>Pass 2 core practice</span><strong>{coreCompleted} / 5</strong></div>
            <progress max={5} value={coreCompleted} aria-label="Pass 2 핵심 영역 완료 상태" />
          </div>
          <button className="section-row available" onClick={() => dispatch({ type: "resume" })}>
            <span className="section-icon"><BookIcon /></span>
            <span className="section-info"><strong>My Story</strong><small>{storyComplete ? "Full Recall complete" : "Start with Full Recall"}</small></span>
            <span className="status-tag">Core</span><span aria-hidden="true">↗</span>
          </button>
          <button className="section-row available" onClick={() => dispatch({ type: "navigate", screen: "conversation" })}>
            <span className="section-number">02</span>
            <span className="section-info"><strong>Real Conversations</strong><small>{conversationComplete ? "A, B, and Full Dialogue complete" : "Play A · Play B · Full Dialogue"}</small></span>
            <span className="status-tag">Core</span><span aria-hidden="true">↗</span>
          </button>
          <button className="section-row available" onClick={() => dispatch({ type: "output", value: { ...progress.output, mode: "variation" } })}>
            <span className="section-number">03</span>
            <span className="section-info"><strong>Output Practice</strong><small>{outputComplete ? "6 source variations complete" : "Start with 6 source variations"}</small></span>
            <span className="status-tag">Core</span><span aria-hidden="true">↗</span>
          </button>
          <button className="section-row" disabled><span className="section-number">04</span><span className="section-info"><strong>Grammar Focus</strong><small>Does not block Pass 2</small></span><span className="later-tag">Next pass</span></button>
          <button className="section-row" disabled><span className="section-number">05</span><span className="section-info"><strong>What About You?</strong><small>Does not block Pass 2</small></span><span className="later-tag">Next pass</span></button>
          <button className="section-row available" onClick={() => dispatch({ type: "navigate", screen: "writing" })}><span className="section-number">06</span><span className="section-info"><strong>Weekly Writing</strong><small>{writingComplete ? "New Pass 2 draft complete" : "Complete one new draft"}</small></span><span className="status-tag">Core</span><span aria-hidden="true">↗</span></button>
          <button className="section-row available" onClick={() => dispatch({ type: "navigate", screen: "review" })}><span className="section-number">07</span><span className="section-info"><strong>Chapter Review</strong><small>{reviewComplete ? "Review set complete" : "All questions or difficult ones"}</small></span><span className="status-tag">Core</span><span aria-hidden="true">↗</span></button>
          <button className="section-row" disabled><span className="section-number">08</span><span className="section-info"><strong>Pronunciation</strong><small>Separate learning area</small></span><span className="later-tag">Next pass</span></button>
        </section>
        <OverviewAside>
          <section className="panel start-card">
            <span className="eyebrow">{next.eyebrow}</span>
            <h2>{next.title}</h2>
            <p>{next.description}</p>
            <button className="primary full-width" onClick={next.action}>
              {next.label} <span aria-hidden="true">→</span>
            </button>
            <button className="text-button" onClick={() => dispatch({ type: "navigate", screen: "read" })}>Read story</button>
            <button className="text-button" onClick={() => dispatch({ type: "selectPass", pass: 1 })}>Review Pass 1</button>
          </section>
          <div className="gentle-note"><span aria-hidden="true">✦</span><div><strong>Recall before review</strong><p>막히면 Hint나 Read로 돌아가도 괜찮아요.</p></div></div>
        </OverviewAside>
      </div>
    </>
  );
}

function Pass3Overview({ progress, dispatch }: ScreenProps) {
  const content = useChapterContent();
  const { metadata } = content;
  const currentChapterName = chapterName(metadata);
  const currentChapterCode = chapterCode(metadata);
  const items = completionForPass(progress, content);
  const completed = items.filter(item => item.completed).length;
  const finished = isPassReady(progress, content) && progress.completedAt !== null;
  const next = items.find(item => !item.completed);
  const open = (id: typeof items[number]["id"]) => id === "myStory"
    ? dispatch({ type: "navigate", screen: "full" })
    : id === "output"
      ? dispatch({ type: "output", value: { ...progress.output, mode: "no-hint" } })
      : dispatch({ type: "navigate", screen: id });
  return <>
    <section className="chapter-hero">
      <div className="hero-copy"><span className="eyebrow">{currentChapterCode} · PASS 3 · COMPLETE</span><h1 tabIndex={-1}>{metadata.title}<span className="blue-period">.</span></h1><p>도움 장치를 줄이고 {currentChapterName} 전체를 내 영어로 완성하세요.</p></div>
      <div className="chapter-art" aria-hidden="true"><div className="art-orbit" /><div className="art-number">03</div><div className="art-label">COMPLETE</div><div className="art-star">✳</div></div>
    </section>
    <div className="overview-grid">
      <section className="panel section-list">
        <div className="section-heading"><h2>Pass 3 focus</h2><span className="badge">7 Required areas</span></div>
        <div className="chapter-core-progress"><div className="progress-label"><span>Pass 3 required practice</span><strong>{completed} / {items.length}</strong></div><progress max={items.length} value={completed} aria-label="Pass 3 필수 영역 완료 상태" /></div>
        {items.map((item, index) => <button className="section-row available" key={item.id} onClick={() => open(item.id)}><span className="section-number">{String(index + 1).padStart(2, "0")}</span><span className="section-info"><strong>{item.label}</strong><small>{item.completed ? "Completed" : item.id === "output" ? "No hint" : "Required"}</small></span><span className="status-tag">{item.completed ? "Done ✓" : "Required"}</span><span aria-hidden="true">↗</span></button>)}
        <button className="section-row" disabled><span className="section-number">08</span><span className="section-info"><strong>Pronunciation</strong><small>Separate learning area</small></span><span className="later-tag">Separate</span></button>
      </section>
      <OverviewAside><section className="panel start-card"><span className="eyebrow">{finished ? `${currentChapterCode} COMPLETE` : next ? "CONTINUE PASS 3" : "READY TO FINISH"}</span><h2>{finished ? `${currentChapterName} · Pass 3 complete ✓` : next ? next.label : `Ready to complete ${currentChapterName}`}</h2><p>{finished ? "Pass 1–3 progress is saved in this browser." : next ? "Finish each required area at your own pace." : "All required practice is complete. Save the final completion when you’re ready."}</p><button className="primary full-width" onClick={() => next ? open(next.id) : dispatch({ type: "navigate", screen: "complete" })}>{finished ? "View completion" : next ? `Continue: ${next.label}` : "Review completion"} <span aria-hidden="true">→</span></button><button className="text-button" onClick={() => dispatch({ type: "selectPass", pass: 2 })}>Review Pass 2</button></section><div className="gentle-note"><span aria-hidden="true">✦</span><div><strong>Completion &gt; Perfection</strong><p>정답률이 아니라 실제로 꺼내본 기록으로 완료해요.</p></div></div></OverviewAside>
    </div>
  </>;
}

const ResumeTargetContext = createContext<HTMLElement | null>(null);
function OverviewAside({ children }: { children: ReactNode }) {
  const target = useContext(ResumeTargetContext);
  const card = <aside className="overview-aside">{children}</aside>;
  return target ? createPortal(card, target) : card;
}

function Overview({ progress, dispatch, hasPass2 }: ScreenProps & { hasPass2: boolean }) {
  const content = useChapterContent();
  const { metadata } = content;
  const currentChapterName = chapterName(metadata);
  const currentChapterCode = chapterCode(metadata);
  if (progress.pass === 3) return <Pass3Overview progress={progress} dispatch={dispatch} />;
  if (progress.pass === 2) return <Pass2Overview progress={progress} dispatch={dispatch} />;
  const resumeLabel = progress.lastSection === "myStory" ? "My Story" : chapterSections.find((section) => section.screen === progress.lastSection)?.title ?? "My Story";
  const core = coreCompletion(progress, content);
  const coreCompleted = core.filter((section) => section.completed).length;
  const ready = isPassReady(progress, content);
  const complete = ready && progress.completedAt !== null;
  return (
    <>
      <section className="chapter-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            {currentChapterCode}
          </span>
          <h1 tabIndex={-1}>
            {metadata.title}<span className="blue-period">.</span>
          </h1>
          <p>
            {metadata.title}.
            <br />
            읽고, 기억하고, 내 목소리로 꺼내보세요.
          </p>
        </div>
        <div className="chapter-art" aria-hidden="true">
          <div className="art-orbit" />
          <div className="art-number">{String(metadata.id).padStart(2, "0")}</div>
          <div className="art-label">A LITTLE AT A TIME</div>
          <div className="art-star">✳</div>
        </div>
      </section>
      <div className="overview-grid">
        <section className="panel section-list">
          <div className="section-heading">
            <h2>In this chapter</h2>
            <span className="badge">Required · 4 sections</span>
          </div>
          <div className="chapter-core-progress">
            <div className="progress-label">
              <span>필수 학습 완료</span>
              <strong>{coreCompleted} / {core.length}</strong>
            </div>
            <progress max={core.length} value={coreCompleted} aria-label="필수 학습 완료 수" />
            <ul className="core-checklist" aria-label="필수 학습 영역별 진행 상태">
              {core.map((section) => (
                <li key={section.id}>
                  <span aria-hidden="true" className={section.completed ? "core-done" : "core-pending"}>{section.completed ? "✓" : "○"}</span>
                  <span>{section.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="section-row available"
            onClick={() => dispatch({ type: "navigate", screen: progress.lastSection === "myStory" ? progress.resumeScreen : "read" })}
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
                <small>{screen === "grammar" ? `Optional · ${content.grammar.subtitle}` : kind}</small>
              </span>
              <span className="section-link-arrow" aria-hidden="true">{core.find((item) => item.id === screen)?.completed || (screen === "grammar" && progress.grammar.studied) || (screen === "about" && progress.about.completedQuestionIds.length > 0) ? "✓" : "↗"}</span>
            </button>
          ))}
          <button className="section-row" disabled><span className="section-number">08</span><span className="section-info"><strong>Pronunciation</strong><small>듣고 따라 말하며 발음과 억양을 연습해요.</small></span><span className="later-tag">Coming later</span></button>
          <button className="secondary full-width chapter-progress-link" onClick={() => dispatch({ type: "navigate", screen: "complete" })}>Chapter progress <span aria-hidden="true">→</span></button>
        </section>
        <OverviewAside>
          <section className="panel start-card">
            {complete ? <>
              <span className="eyebrow">CHAPTER COMPLETE</span>
              <h2>{currentChapterName} complete ✓</h2>
              <p>Pass 1 is saved. Start Pass 2 when you're ready to reinforce My Story.</p>
              <button className="primary full-width" onClick={() => dispatch({ type: "startPass2" })}>{hasPass2 ? "Continue Pass 2" : "Start Pass 2"} <span aria-hidden="true">→</span></button>
              <button className="text-button" onClick={() => dispatch({ type: "navigate", screen: "review" })}>Review Pass 1</button>
            </> : ready ? <>
              <span className="eyebrow">READY TO FINISH</span>
              <h2>Core learning done</h2>
              <p>All four required sections are complete. Finish the chapter when you're ready.</p>
              <button className="primary full-width" onClick={() => dispatch({ type: "finishPass" })}>Finish chapter <span aria-hidden="true">✓</span></button>
            </> : <>
              <span className="eyebrow">CONTINUE LEARNING</span>
              <h2>{resumeLabel}</h2>
              <p className="resume-description">Pick up where you left off.</p>
              <button className="primary full-width" onClick={() => dispatch({ type: "resume" })}>
                {progress.lastStudiedAt ? "Continue" : "Start"}{" "}<span aria-hidden="true">→</span>
              </button>
              {progress.lastStudiedAt && <button className="text-button" onClick={() => dispatch({ type: "navigate", screen: "read" })}>Read again</button>}
            </>}
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
        </OverviewAside>
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
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1 tabIndex={-1}>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}

function Reader({ progress, dispatch }: ScreenProps) {
  const { metadata, chunks } = useChapterContent();
  const currentChapterLabel = chapterLabel(metadata);
  const modes: { id: ReadMode; label: string }[] = [
    { id: "korean", label: "Korean" },
    { id: "english", label: "English" },
    { id: "together", label: "Both" },
  ];
  return (
    <>
      <ScreenHeading
        eyebrow={progress.pass > 1 ? `${currentChapterLabel} · PASS ${progress.pass} · CORE` : `${currentChapterLabel} · REQUIRED`}
        title="My Story · Read"
        description="Read the story at your own pace."
      />
      <section className="panel reader-panel">
        <div className="reader-toolbar">
          <h2>{metadata.title}</h2>
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
        <ActionFooter
          back={<button className="secondary" onClick={() => dispatch({ type: "navigate", screen: "overview" })}>← Back to overview</button>}
          forward={<button className="primary" onClick={() => dispatch({ type: "practice" })}>Start recall <span aria-hidden="true">→</span></button>}
        />
      </section>
    </>
  );
}

function Recall({ progress, dispatch }: ScreenProps) {
  const { metadata, chunks } = useChapterContent();
  const currentChapterLabel = chapterLabel(metadata);
  const chunk = chunks.find(
    (c) => c.id === progress.queue[progress.queueIndex],
  )!;
  const [hint, setHint] = useState<0 | 1 | 2>(0);
  const [answer, setAnswer] = useState(false);
  const isWeakPractice = progress.queue.length !== chunks.length;
  const revealHint = (level: 1 | 2) => {
    setHint(level);
    dispatch({ type: "hint", level });
  };
  return (
    <>
      <ScreenHeading
        eyebrow={progress.pass > 1 ? `${currentChapterLabel} · PASS ${progress.pass} · CORE` : `${currentChapterLabel} · REQUIRED`}
        title="My Story · Chunk Recall"
        description={isWeakPractice ? "Review the chunks you marked to revisit." : "Read the Korean text. Recall it in English."}
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
            <RecallRatingButtons onRate={(rating) => dispatch({ type: "rate", rating })} />
          </div>
        )}
        <SourceNote />
        <ActionFooter
          back={<button className="secondary" onClick={() => dispatch({ type: "navigate", screen: "overview" })}>← Back to overview</button>}
          middle={<button className="secondary" onClick={() => progress.queueIndex > 0 ? dispatch({ type: "previous" }) : dispatch({ type: "navigate", screen: "read" })}>
            {progress.queueIndex > 0 ? "Previous chunk" : "Read story"}
          </button>}
        />
      </section>
    </>
  );
}

function FullRecall({ progress, dispatch }: ScreenProps) {
  const content = useChapterContent();
  const { metadata, chunks } = content;
  const currentChapterLabel = chapterLabel(metadata);
  const [showAnswer, setShowAnswer] = useState(false);
  const weak = weakIds(progress, content);
  const remembered = chunks.filter(
    (c) => progress.chunkRatings[c.id] === "immediate",
  );
  const unassessed = chunks.filter((c) => !progress.chunkRatings[c.id]);
  return (
    <>
      <ScreenHeading
        eyebrow={progress.pass > 1 ? `${currentChapterLabel} · PASS ${progress.pass} · CORE` : `${currentChapterLabel} · REQUIRED`}
        title="My Story · Full Recall"
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
        <button className="primary full-width" onClick={() => dispatch({ type: "complete" })}>
          {progress.fullRecallCompleted ? "Done ✓" : "Done speaking"}
        </button>
        <SourceNote />
        <div className="conversation-answer-toggle">
          <button className="text-button" aria-expanded={showAnswer} onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? "Hide English" : "Show English"}
          </button>
        </div>
        {showAnswer && (
          <div className="answer-box" aria-label="전체 영어 원문">
            {chunks.map((c) => <p lang="en" key={c.id}>{c.english.join(" ")}</p>)}
          </div>
        )}
        {!progress.fullRecallCompleted && <ActionFooter
          back={<button className="secondary" onClick={() => dispatch({ type: "navigate", screen: "overview" })}>← Back to overview</button>}
          middle={<button className="secondary" onClick={() => dispatch({ type: "practice" })}>Practice all chunks</button>}
        />}
      </section>
      {progress.fullRecallCompleted && (
        <section className="panel reflection">
          <div className="section-heading">
            <h2>
              {progress.pass === 3 ? "My Story completed" : progress.pass === 2 ? "My Story reinforced" : "My Story complete"}
            </h2>
            <span className="badge">Self check</span>
          </div>
          {progress.pass > 1 && <p>Full Recall을 완료했어요. 필요하면 Chunk Recall로 돌아가 보강할 수 있어요.</p>}
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
          <div className="reflection-practice-actions">
            <button className="secondary" onClick={() => dispatch({ type: "practice" })}>Practice all chunks</button>
            {weak.length > 0 && <button className="secondary" onClick={() => dispatch({ type: "practice", weakOnly: true })}>Review chunks ({weak.length})</button>}
          </div>
          <ActionFooter
            back={<button className="secondary" onClick={() => dispatch({ type: "navigate", screen: "overview" })}>← Back to overview</button>}
            forward={<button className="primary" onClick={() => dispatch({ type: "navigate", screen: "conversation" })}>Next: Real Conversations <span aria-hidden="true">→</span></button>}
          />
        </section>
      )}
    </>
  );
}

function ChapterCompletion({ progress, dispatch, hasPass2, hasPass3 }: ScreenProps & { hasPass2: boolean; hasPass3: boolean }) {
  const content = useChapterContent();
  const currentChapterName = chapterName(content.metadata);
  const currentChapterLabel = chapterLabel(content.metadata);
  const items = completionForPass(progress, content);
  const ready = isPassReady(progress, content);
  const complete = ready && progress.completedAt !== null;
  const pass2 = progress.pass === 2;
  const pass3 = progress.pass === 3;
  const areaCount = pass3 ? "seven required areas" : pass2 ? "five core areas" : "four required sections";
  return (
    <>
      <ScreenHeading eyebrow={`${currentChapterLabel} · PASS ${progress.pass}`} title={complete ? pass3 ? `${currentChapterName} · Pass 3 complete` : `${currentChapterName} · Pass ${progress.pass} complete` : "Chapter progress"} description={complete ? `All ${areaCount} are complete. Your Pass ${progress.pass} progress is saved.` : ready ? `All ${areaCount} are done. Finish Pass ${progress.pass} when you're ready.` : "Build on what you’ve practiced. There’s no need to rush."} />
      <section className="panel chapter-completion">
        <div className="section-heading"><h2>{complete ? "Core learning complete" : "Core learning"}</h2><span className="badge">{complete ? "Completed ✓" : `${items.filter((item) => item.completed).length} / ${items.length} ${pass2 ? 'core' : 'required'}`}</span></div>
        <ul className="conversation-checklist">
          {items.map((item) => (
            <li key={item.id}><button className="text-button" onClick={() => dispatch({ type: "navigate", screen: item.id === "myStory" ? progress.resumeScreen : item.id })}>{item.label} <span aria-hidden="true">↗</span></button><span className={item.completed ? "is-complete" : "muted"}>{item.completed ? "Practiced ✓" : "Open to practice"}</span></li>
          ))}
        </ul>
        <p className="muted">{pass3 ? `All ${currentChapterName} learning areas are required in Pass 3. Pronunciation remains separate.` : pass2 ? "Grammar Focus and What About You? do not block this Pass 2 completion. Pronunciation remains a separate learning area." : "Grammar Focus and What About You? are optional."}</p>
        <ActionFooter
          back={<button className="secondary" onClick={() => dispatch({ type: "navigate", screen: "overview" })}>← Back to overview</button>}
          middle={ready ? <button className="secondary" onClick={() => dispatch({ type: "navigate", screen: "review" })}>{complete ? `Review Pass ${progress.pass}` : "Chapter Review"}</button> : undefined}
          forward={ready && !complete
            ? <button className="primary" onClick={() => dispatch({ type: "finishPass" })}>Finish Pass {progress.pass} <span aria-hidden="true">✓</span></button>
            : complete && progress.pass === 1
              ? <button className="primary" onClick={() => dispatch({ type: "startPass2" })}>{hasPass2 ? "Continue Pass 2" : "Start Pass 2"} <span aria-hidden="true">→</span></button>
              : complete && pass2
                ? <button className="primary" onClick={() => dispatch({ type: "startPass3" })}>{hasPass3 ? "Continue Pass 3" : "Start Pass 3"} <span aria-hidden="true">→</span></button>
              : complete
                ? <button className="primary" onClick={() => dispatch({ type: "navigate", screen: "overview" })}>{pass3 ? `Back to ${currentChapterName} overview` : "Back to Pass 2 overview"} <span aria-hidden="true">→</span></button>
              : <button className="secondary" onClick={() => dispatch({ type: "navigate", screen: "review" })}>Chapter Review <span aria-hidden="true">→</span></button>}
        />
      </section>
    </>
  );
}

export default function App({ storage, syncTransport, usageRecorder, registerFlush }: { storage?: Storage; syncTransport?: SyncTransport; usageRecorder?: UsageRecorder; registerFlush?: (flush: (() => Promise<boolean>) | null) => void } = {}) {
  const progressStorage = storage ?? {
    getItem: (key: string) => localStorage.getItem(key), setItem: (key: string, value: string) => localStorage.setItem(key, value),
  };
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const [boot] = useState(() => readProtectedProgress({
    getItem: key => progressStorage.getItem(key), setItem: (key, value) => progressStorage.setItem(key, value),
  }));
  const [storageWarning, setStorageWarning] = useState<string | null>(boot.message);
  const [accountReady, setAccountReady] = useState(!syncTransport);
  const protectedRecord = useRef(boot.protected);
  const originalRecord = useRef(boot.original);
  const [appProgress, internalDispatch] = useReducer(
    (state: AppProgress, action: AppAction | { type: 'restoreBackup'; progress: AppProgress } | { type: 'applyProgress'; progress: AppProgress }) =>
      action.type === 'restoreBackup' || action.type === 'applyProgress' ? action.progress : updateAppProgress(state, action),
    boot.progress);
  const latestProgress = useRef(appProgress);
  latestProgress.current = appProgress;
  const appDispatch: Dispatch<AppAction> = (action) => {
    const previous = latestProgress.current;
    const next = updateAppProgress(previous, action);
    if (next === previous) return;
    latestProgress.current = next;
    internalDispatch({ type: 'applyProgress', progress: next });
    const events = usageEventsForTransition(previous, next, action);
    if (events.length) usageRecorder?.record(events);
  };
  const activeContent = chapterContentById[appProgress.activeChapterId] ?? chapterContentById[3]!;
  const chapterProgress = appProgress.chapters[appProgress.activeChapterId] ?? initialProgress(activeContent);
  const analyticsProgress = activePassProgress(chapterProgress);
  const currentChapterName = chapterName(activeContent.metadata);
  const currentChapterCode = chapterCode(activeContent.metadata);
  const dispatch: Dispatch<Action> = (action) => appDispatch({ type: "chapter", action });
  const main = useRef<HTMLElement>(null);
  const [wideOverview, setWideOverview] = useState(() => typeof window !== "undefined" && window.innerWidth > 900);
  const [resumeTarget, setResumeTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px)");
    const update = () => setWideOverview(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.title = appProgress.view === "library" ? "Chapter Library · English Output" : appProgress.view === "automatic" ? "Pass 4+ Automatic · English Output" : `${currentChapterName} · English Output`;
  }, [appProgress.view, currentChapterName]);
  useEffect(() => {
    if (!accountReady) return;
    if (appProgress.view === 'library') {
      trackAnalyticsPage({ screen: 'chapter_library', title: 'Chapter Library · English Output', path: '/app/chapters' });
      return;
    }
    if (appProgress.view === 'automatic') {
      trackAnalyticsPage({ screen: 'automatic_review', title: 'Pass 4+ Automatic · English Output', path: '/app/automatic' });
      return;
    }
    const pass = analyticsProgress.pass;
    const screen = analyticsProgress.currentScreen;
    trackAnalyticsPage({
      screen: `chapter_${screen}`,
      title: `${currentChapterName} · English Output`,
      path: `/app/chapter/${appProgress.activeChapterId}/pass/${pass}/${screen}`,
    });
  }, [accountReady, appProgress.activeChapterId, appProgress.view, analyticsProgress.currentScreen, analyticsProgress.pass, currentChapterName]);
  useEffect(() => {
    if (!accountReady || !usageRecorder) return;
    usageRecorder.recordOnce('app-open', {
      eventName: 'app_open', chapterId: appProgress.activeChapterId,
      pass: activePassProgress(appProgress.chapters[appProgress.activeChapterId] ?? initialProgress(activeContent)).pass,
    });
  }, [accountReady, usageRecorder]);
  useEffect(() => {
    if (protectedRecord.current) return;
    let cancelled = false;
    if (!navigator.locks) {
      setStorageWarning('Safe saving is unavailable in this browser. Download a backup before leaving.');
      return;
    }
    void navigator.locks.request(STORAGE_KEY, () => {
      if (cancelled || protectedRecord.current) return;
      try {
        originalRecord.current = saveProgressIfUnchanged(progressStorage, originalRecord.current, appProgress);
        setStorageWarning(null);
      } catch {
        protectedRecord.current = true;
        setStorageWarning('Progress could not be saved safely. Another tab may have changed it, or storage is full. Download a backup before reloading.');
      }
    }).catch(() => setStorageWarning('Saving failed. Download a backup before leaving.'));
    return () => { cancelled = true; };
  }, [appProgress]);
  const restore = async (text: string, expected?: string) => {
      if (!navigator.locks) throw new Error('Use a browser with safe storage support to restore a backup.');
      await navigator.locks.request(STORAGE_KEY, () => {
        if (!alive.current) throw new Error('Account changed. No record was replaced.');
        if (expected !== undefined && JSON.stringify(latestProgress.current) !== expected) throw new Error('Your browser record changed during sync. Sync again; nothing was replaced.');
        const result = restoreProgressBackup(progressStorage, text, originalRecord.current, `${Date.now()}-${crypto.randomUUID()}`);
        originalRecord.current = result.saved;
        protectedRecord.current = false;
        setStorageWarning(null);
        latestProgress.current = result.progress;
        internalDispatch({ type: 'restoreBackup', progress: result.progress });
      });
    };
  const safetyPanel = <>
    {storageWarning && <ProgressBackupPanel progress={appProgress} original={originalRecord.current} warning={storageWarning} onRestore={restore} storage={storage} />}
    {syncTransport && <AccountSyncPanel progress={appProgress} disabled={Boolean(storageWarning)} onRestore={restore} transport={syncTransport} storage={storage} onReady={() => setAccountReady(true)} registerFlush={registerFlush ?? (() => {})} />}
    {import.meta.env.DEV && import.meta.env.VITE_LOCAL_SYNC_TEST === '1' && <LocalSyncPanel progress={appProgress} disabled={Boolean(storageWarning)} onRestore={restore} />}</>;
  const progress = activePassProgress(chapterProgress);
  const chunkId = progress.queue[progress.queueIndex];
  const conversationPosition = `${progress.conversation.view}-${progress.conversation.role}-${progress.conversation.positions[progress.conversation.role]}`;
  const outputPosition = `${progress.output.mode}-${progress.output.cursors[progress.output.mode]}-${progress.output.finished[progress.output.mode]}`;
  const reviewPosition = `${progress.review.queue.join(",")}-${progress.review.index}-${progress.review.completed}`;
  useEffect(() => {
    main.current?.querySelector<HTMLHeadingElement>("h1")?.focus();
    window.scrollTo(0, 0);
  }, [appProgress.view, appProgress.activeChapterId, progress.currentScreen, chunkId, conversationPosition, outputPosition, reviewPosition]);
  const rated = Object.values(progress.chunkRatings).filter(Boolean).length;
  const sectionTitle = chapterSections.find((section) => section.screen === progress.currentScreen)?.title;
  const locationParts = breadcrumbParts(progress, activeContent.metadata);
  useLayoutEffect(() => {
    const root = main.current?.closest<HTMLElement>(".has-sidebar-resume");
    const top = root?.querySelector<HTMLElement>(".sidebar-overview-top");
    if (!root || !top) return;
    const align = () => root.style.setProperty("--skin-hero-height", `${top.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(align);
    observer.observe(top);
    align();
    return () => { observer.disconnect(); root.style.removeProperty("--skin-hero-height"); };
  }, [accountReady, appProgress.view, appProgress.activeChapterId, progress.currentScreen, progress.pass, wideOverview, resumeTarget]);
  if (!accountReady) return <>{safetyPanel}<main className="account-card"><p role="status">학습 기록을 불러오고 있어요…</p></main></>;
  if (appProgress.view === "library") {
    return <>{safetyPanel}<ChapterLibrary progress={appProgress} onOpen={(chapterId) => appDispatch({ type: "selectChapter", chapterId })} onAutomatic={() => appDispatch({ type: "showAutomatic" })} onHome={() => {
      appDispatch({ type: "selectChapter", chapterId: appProgress.activeChapterId });
      dispatch({ type: "navigate", screen: "overview" });
    }} /></>;
  }
  if (appProgress.view === "automatic") return <>{safetyPanel}<AutomaticScreen progress={appProgress} dispatch={appDispatch} /></>;
  return (
    <>{safetyPanel}
    <ResumeTargetContext.Provider value={resumeTarget}>
    <ChapterContentProvider content={activeContent}>
    <div className={`app-shell study-cafe${wideOverview && progress.currentScreen === "overview" ? " has-sidebar-resume" : ""}`}>
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
          {currentChapterCode} <span>· PASS {progress.pass}</span>
        </span>
        <button className="topbar-library" onClick={() => appDispatch({ type: "showLibrary" })}>All chapters</button>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-overview-top">
          <div className="sidebar-heading">
            <span className="eyebrow">MY LEARNING</span>
            <h2>{currentChapterName}</h2>
            <p>{activeContent.metadata.title}</p>
            {progress.pass === 2 && <span className="badge">Pass 2 · Reinforce</span>}
            {progress.pass === 3 && <span className="badge">Pass 3 · Complete</span>}
          </div>
          {wideOverview && progress.currentScreen === "overview" && <div className="sidebar-resume-slot" ref={setResumeTarget} />}
          </div>
          <MobileLearningMenu key={activeContent.metadata.id} activeId={activeContent.metadata.id} sectionLabel={locationParts.slice(1).join(" · ")} onSelect={chapterId => appDispatch({ type: "selectChapter", chapterId })}>
            <ChapterNavigation progress={progress} dispatch={dispatch} />
          </MobileLearningMenu>
          <div className="sidebar-progress">
            <span>Chunks self-checked</span>
            <strong>
              {rated}
              <small> / {activeContent.chunks.length} chunks</small>
            </strong>
            <progress max={activeContent.chunks.length} value={rated} aria-label="평가한 Chunk 수" />
            <p>
              {progress.fullRecallCompleted
                ? "Full Recall complete ✓"
                : "한 번 더 꺼내볼 때마다 익숙해져요."}
            </p>
          </div>
        </aside>
        <main id="main-content" ref={main}>
          <nav className="breadcrumb" aria-label="현재 위치">
            {locationParts.map((part, index) => (
              <span className="breadcrumb-part" key={`${index}-${part}`}>
                {index > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
                <span aria-current={index === locationParts.length - 1 ? "page" : undefined}>{part}</span>
              </span>
            ))}
          </nav>
          {progress.currentScreen === "overview" && (
            <Overview progress={progress} dispatch={dispatch} hasPass2={chapterProgress.passes[2] !== null} />
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
          {progress.currentScreen === "conversation" && <ConversationScreen pass={progress.pass} progress={progress.conversation} dispatch={(action) => dispatch({ type: "conversation", action })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} onNext={() => dispatch({ type: "navigate", screen: "output" })} />}
          {progress.currentScreen === "output" && <OutputPractice pass={progress.pass} progress={progress.output} onChange={(value) => dispatch({ type: "output", value })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} onNext={() => dispatch({ type: "navigate", screen: progress.pass === 3 ? "grammar" : progress.pass === 2 ? "review" : "writing" })} />}
          {progress.currentScreen === "review" && <ReviewScreen pass={progress.pass} progress={progress.review} onChange={(value) => dispatch({ type: "review", value })} learnedRatings={studyRatings(progress)} eligibleItems={buildReviewItems({ chunkRatings: progress.chunkRatings, conversationRatings: progress.conversation.ratings, outputRatings: progress.output.ratings }, activeContent.exercises.review)} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} onNext={() => dispatch({ type: "navigate", screen: progress.pass === 2 ? "writing" : "complete" })} />}
          {progress.currentScreen === "writing" && <WritingScreen pass={progress.pass} progress={progress.writing} onChange={(value) => dispatch({ type: "writing", value })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} onNext={() => dispatch({ type: "navigate", screen: progress.pass === 3 ? "review" : progress.pass === 2 ? "complete" : "review" })} />}
          {progress.currentScreen === "about" && <AboutScreen pass={progress.pass} progress={progress.about} onChange={(value) => dispatch({ type: "about", value })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} onNext={() => dispatch({ type: "navigate", screen: "writing" })} />}
          {progress.currentScreen === "grammar" && <GrammarScreen pass={progress.pass} progress={progress.grammar} onChange={(value) => dispatch({ type: "grammar", value })} onOverview={() => dispatch({ type: "navigate", screen: "overview" })} onNext={() => dispatch({ type: "navigate", screen: "about" })} />}
          {progress.currentScreen === "complete" && <ChapterCompletion progress={progress} dispatch={dispatch} hasPass2={chapterProgress.passes[2] !== null} hasPass3={chapterProgress.passes[3] !== null} />}
          <footer className="page-footer">
            <span>조금씩, 꾸준히, 내 것으로.</span>
            <span>{currentChapterName} · Pass {progress.pass} · {sectionTitle ?? (progress.currentScreen === "complete" ? "Chapter progress" : "My Story")}</span>
          </footer>
        </main>
      </div>
    </div>
    </ChapterContentProvider>
    </ResumeTargetContext.Provider>
    </>
  );
}
