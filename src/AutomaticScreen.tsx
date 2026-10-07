import type { Dispatch } from "react";
import { ScrollAwareHeader } from './ScrollAwareHeader';
import { chapterById, chapterName, type ChapterId } from "./data/chapters";
import { ExerciseCard } from "./ExerciseCard";
import type { AppAction, AppProgress } from "./appProgress";
import { collectLearnedItems, type AutomaticAction, type AutomaticMode } from "./automaticProgress";
import { chapterContentById } from "./data/chapterContent";
import { ratingLabels } from "./learningLabels";
import "./automatic.css";

type Props = {
  progress: AppProgress;
  dispatch: Dispatch<AppAction>;
};

const modeCopy: Record<AutomaticMode, { title: string; description: string }> = {
  mixed: {
    title: "Mixed Chapters",
    description: "두 개 이상의 Chapter에서 복습할 문제를 섞어서 풀어요.",
  },
  smart: {
    title: "Smart Review",
    description: "어렵게 느꼈거나 힌트를 많이 본 문제, 오래전에 공부한 문제부터 풀어요.",
  },
  "all-random": {
    title: "All Random",
    description: "Chapter나 표현 힌트 없이, 배운 문제를 무작위로 풀어요.",
  },
};

function Header({ onLibrary, screenKey }: { onLibrary: () => void; screenKey: string }) {
  return <ScrollAwareHeader className="automatic-topbar" screenKey={screenKey}>
    <span className="brand">English Output <span className="brand-caption">배운 영어를, 내 영어로.</span></span>
    <span className="topbar-label">PASS 4+ · AUTOMATIC</span>
    <button className="topbar-library" onClick={onLibrary}>All chapters</button>
  </ScrollAwareHeader>;
}

function ChapterChoices({ ids, selected, onToggle }: { ids: ChapterId[]; selected: ChapterId[]; onToggle: (id: ChapterId) => void }) {
  return <fieldset className="automatic-chapters">
    <legend>학습 기록이 있는 Chapter</legend>
    <div>
      {ids.map((id) => <label key={id}>
        <input type="checkbox" checked={selected.includes(id)} onChange={() => onToggle(id)} />
        <span>{chapterName(chapterById(id))}</span>
      </label>)}
    </div>
  </fieldset>;
}

export function AutomaticScreen({ progress, dispatch }: Props) {
  const automatic = progress.automatic;
  const learned = collectLearnedItems(progress.chapters, chapterContentById);
  const learnedChapterIds = [...new Set(learned.map((item) => item.chapterId))].sort((a, b) => a - b);
  const completedPass3 = Object.values(progress.chapters).filter((chapter) => chapter?.passes[3]?.completedAt).length;
  const send = (action: AutomaticAction) => dispatch({ type: "automatic", action });
  const selectedItems = learned.filter((item) => automatic.selectedChapterIds.includes(item.chapterId));

  if (automatic.screen === "session") {
    const currentKey = automatic.queue[automatic.index];
    const current = learned.find((item) => item.key === currentKey);
    if (!current) return null;
    return <div className="library-shell">
      <Header screenKey={`session:${automatic.mode}`} onLibrary={() => dispatch({ type: "showLibrary" })} />
      <main className="automatic-main" id="main-content">
        <header className="automatic-session-heading">
          <button className="text-button" onClick={() => send({ type: "home" })}>← Pass 4+ home</button>
          <p className="eyebrow">{modeCopy[automatic.mode].title}</p>
          <h1>Recall from memory</h1>
        </header>
        <ExerciseCard
          key={currentKey}
          item={current.item}
          noHints={automatic.mode === "all-random"}
          hideContext={automatic.mode === "all-random"}
          position={automatic.index + 1}
          total={automatic.queue.length}
          onRate={(rating) => send({ type: "rate", rating })}
        />
      </main>
    </div>;
  }

  if (automatic.screen === "complete") {
    const counts = (["immediate", "effort", "review"] as const).map((rating) => ({
      rating,
      count: Object.values(automatic.ratings).filter((value) => value === rating).length,
    }));
    return <div className="library-shell">
      <Header screenKey={`complete:${automatic.mode}`} onLibrary={() => dispatch({ type: "showLibrary" })} />
      <main className="automatic-main" id="main-content">
        <section className="panel automatic-summary">
          <p className="eyebrow">SESSION COMPLETE</p>
          <h1>{modeCopy[automatic.mode].title} complete</h1>
          <p>이번 세션의 자기평가가 저장됐어요. 다음 Smart Review 순서에 반영됩니다.</p>
          <div className="automatic-stats">
            {counts.map(({ rating, count }) => <div key={rating}><strong>{count}</strong><span>{ratingLabels[rating]}</span></div>)}
          </div>
          <div className="automatic-actions">
            <button className="secondary" onClick={() => send({ type: "home" })}>Pass 4+ home</button>
            <button className="primary" onClick={() => send({ type: "restart", learned })}>Practice again</button>
          </div>
        </section>
      </main>
    </div>;
  }

  if (automatic.screen === "writing") {
    const canComplete = automatic.selectedChapterIds.length >= 2 && automatic.writingDraft.trim().length > 0;
    return <div className="library-shell">
      <Header screenKey="writing" onLibrary={() => dispatch({ type: "showLibrary" })} />
      <main className="automatic-main" id="main-content">
        <header className="library-heading">
          <button className="text-button" onClick={() => send({ type: "home" })}>← Pass 4+ home</button>
          <p className="eyebrow">MULTI-CHAPTER WRITING</p>
          <h1>Write with what you learned</h1>
          <p>두 개 이상의 Chapter에서 배운 표현을 꺼내 자유롭게 하나의 글로 연결해 보세요.</p>
        </header>
        {learnedChapterIds.length >= 2 ? <>
          <ChapterChoices ids={learnedChapterIds} selected={automatic.selectedChapterIds} onToggle={(chapterId) => send({ type: "toggleChapter", chapterId })} />
          <section className="panel automatic-writing">
            <label htmlFor="automatic-writing">My writing</label>
            <textarea id="automatic-writing" value={automatic.writingDraft} onChange={(event) => send({ type: "writingDraft", value: event.target.value })} placeholder="Use expressions you already learned." />
            {automatic.writingCompletedAt && <p className="writing-saved" role="status">Writing complete ✓</p>}
            <button className="primary" disabled={!canComplete} onClick={() => send({ type: "completeWriting" })}>Complete writing</button>
          </section>
        </> : <section className="panel automatic-empty"><h2>학습 기록이 더 필요해요</h2><p>두 Chapter 이상에서 문제를 풀고 자기평가를 남기면 사용할 수 있어요.</p></section>}
      </main>
    </div>;
  }

  if (automatic.screen === "setup") {
    const needsSelection = automatic.mode === "mixed";
    const candidates = needsSelection ? selectedItems : learned;
    const canStart = candidates.length > 0 && (!needsSelection || automatic.selectedChapterIds.length >= 2);
    return <div className="library-shell">
      <Header screenKey={`setup:${automatic.mode}`} onLibrary={() => dispatch({ type: "showLibrary" })} />
      <main className="automatic-main" id="main-content">
        <header className="library-heading">
          <button className="text-button" onClick={() => send({ type: "home" })}>← Pass 4+ home</button>
          <p className="eyebrow">PASS 4+ · AUTOMATIC</p>
          <h1>{modeCopy[automatic.mode].title}</h1>
          <p>{modeCopy[automatic.mode].description}</p>
        </header>
        {needsSelection && learnedChapterIds.length >= 2 && <ChapterChoices ids={learnedChapterIds} selected={automatic.selectedChapterIds} onToggle={(chapterId) => send({ type: "toggleChapter", chapterId })} />}
        <section className="panel automatic-start">
          <h2>{candidates.length} learned items</h2>
          <p>{automatic.mode === "all-random" ? "힌트와 어느 Chapter의 문제인지는 정답을 본 뒤에만 보여요." : "정답을 확인한 뒤 스스로 평가하면 다음 항목으로 이동해요."}</p>
          {!canStart && <p className="automatic-warning">{learned.length === 0 ? "먼저 Chapter에서 문제를 풀고 자기평가를 남겨주세요." : "학습 기록이 있는 Chapter를 두 개 이상 선택해주세요."}</p>}
          <button className="primary" disabled={!canStart} onClick={() => send({ type: "start", learned })}>Start review</button>
        </section>
      </main>
    </div>;
  }

  return <div className="library-shell">
    <Header screenKey="overview" onLibrary={() => dispatch({ type: "showLibrary" })} />
    <main className="automatic-main" id="main-content">
      <header className="library-heading">
        <p className="eyebrow">PASS 4+ · AUTOMATIC</p>
        <h1>Use it without chapter clues</h1>
        <p>이미 공부하고 자기평가한 문장만 다시 복습해요.</p>
      </header>
      <div className="automatic-overview-stats">
        <span><strong>{learnedChapterIds.length}</strong> learned chapters</span>
        <span><strong>{learned.length}</strong> learned items</span>
        <span><strong>{completedPass3}</strong> Pass 3 complete</span>
      </div>
      <div className="automatic-mode-grid">
        {(Object.keys(modeCopy) as AutomaticMode[]).map((mode) => <article className="chapter-card is-available" key={mode}>
          <div><span className="eyebrow">RECALL MODE</span><h2>{modeCopy[mode].title}</h2><p>{modeCopy[mode].description}</p></div>
          <button className="primary" onClick={() => send({ type: "choose", mode })}>Open <span aria-hidden="true">→</span></button>
        </article>)}
        <article className="chapter-card is-available automatic-writing-card">
          <div><span className="eyebrow">OUTPUT MODE</span><h2>Multi-Chapter Writing</h2><p>두 개 이상의 Chapter에서 배운 표현을 한 글에 써봐요.</p></div>
          <button className="primary" onClick={() => send({ type: "openWriting" })}>Open <span aria-hidden="true">→</span></button>
        </article>
      </div>
    </main>
  </div>;
}
