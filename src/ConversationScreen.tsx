import { useState } from "react";
import { conversationTurns, previousPartnerTurn, roleTurnIds } from "./data/conversations";
import type { ConversationRole, ConversationTurn } from "./data/conversations";
import { isConversationComplete, isRoleComplete } from "./conversationProgress";
import type { ConversationAction, ConversationProgress } from "./conversationProgress";
import type { ReadMode } from "./progress";
import { VoicePractice } from "./VoicePractice";
import { ActionFooter } from "./ActionFooter";
import { RecallRatingButtons } from "./RecallRatingButtons";

type Props = {
  pass: 1 | 2 | 3;
  progress: ConversationProgress;
  dispatch: (action: ConversationAction) => void;
  onOverview: () => void;
  onNext: () => void;
};

export function conversationViewLabel(progress: ConversationProgress) {
  if (progress.view === "read") return "Read";
  if (progress.view === "full") return "Full Dialogue";
  return `Play ${progress.role}`;
}

function SourceNote() {
  return <p className="source-note">Source · Chapter 3, Real Conversations · Korean p.56 / English p.57</p>;
}

function Dialogue({ mode }: { mode: ReadMode }) {
  return (
    <ol className={`dialogue-list ${mode === "together" ? "dialogue-bilingual" : ""}`}>
      {conversationTurns.map((turn) => (
        <li className={`dialogue-turn speaker-${turn.role.toLowerCase()}`} key={turn.id}>
          <span className="speaker-badge" aria-label={`Speaker ${turn.role}`}>{turn.role}</span>
          <div className="dialogue-lines">
            {mode !== "english" && <p lang="ko">{turn.korean}</p>}
            {mode !== "korean" && <p lang="en">{turn.english.join(" ")}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function CompletionStatus({ progress }: { progress: ConversationProgress }) {
  return (
    <ul className="conversation-checklist" aria-label="Conversation progress">
      {(["A", "B"] as const).map((role) => (
        <li key={role}>
          <span>Play {role}</span>
          <span className={isRoleComplete(progress, role) ? "is-complete" : "muted"}>
            {isRoleComplete(progress, role) ? "Completed ✓" : `${roleTurnIds(role).filter((id) => progress.ratings[id]).length} / ${roleTurnIds(role).length} rated`}
          </span>
        </li>
      ))}
      <li>
        <span>Full Dialogue</span>
        <span className={progress.fullRecallCompleted ? "is-complete" : "muted"}>
          {progress.fullRecallCompleted ? "Completed ✓" : "Not practiced yet"}
        </span>
      </li>
    </ul>
  );
}

function RolePractice({ progress, dispatch, onOverview }: Pick<Props, "progress" | "dispatch" | "onOverview">) {
  const [answer, setAnswer] = useState(false);
  const [hint, setHint] = useState<0 | 1 | 2>(0);
  const ids = roleTurnIds(progress.role);
  const index = progress.positions[progress.role];
  const turn = conversationTurns.find((item) => item.id === ids[index])!;
  const partner = previousPartnerTurn(turn.id);
  const revealHint = (level: 1 | 2) => {
    setHint(level);
    dispatch({ type: "hint", level });
  };
  return (
    <section className="panel conversation-panel role-practice">
      <div className="recall-top">
        <span>You are {progress.role}</span>
        <strong>{index + 1} <span>/ {ids.length}</span></strong>
      </div>
      <progress value={index + 1} max={ids.length} aria-label={`Role ${progress.role} practice position`} />
      {partner ? (
        <div className="partner-cue">
          <span className="speaker-badge" aria-label={`Speaker ${partner.role}`}>{partner.role}</span>
          <div><span className="eyebrow">Your partner</span><p lang="en">{partner.english.join(" ")}</p></div>
        </div>
      ) : <p className="conversation-start">You start the conversation.</p>}
      <div className="prompt-block conversation-prompt">
        <span className="eyebrow">Your turn · {turn.role}</span>
        <p className="prompt-text" lang="ko">{turn.korean}</p>
      </div>
      <VoicePractice />
      <div className="hint-actions">
        <button className="secondary" aria-pressed={hint === 1} onClick={() => revealHint(1)}>Hint 1</button>
        <button className="secondary" aria-pressed={hint === 2} onClick={() => revealHint(2)}>Hint 2</button>
        <button className="primary" aria-expanded={answer} onClick={() => setAnswer(!answer)}>{answer ? "Hide answer" : "Show answer"}</button>
      </div>
      <div aria-live="polite">
        {hint > 0 && !answer && (
          <div className="hint-box">
            <span className="eyebrow">Hint {hint} · {hint === 1 ? "Sentence starters" : "Fill in the blanks"}</span>
            {(hint === 1 ? turn.hint1 : turn.hint2).map((line, i) => <p lang="en" key={i}>{line}</p>)}
          </div>
        )}
        {answer && <TurnAnswer turn={turn} />}
      </div>
      {answer && (
        <div className="rating-area">
          <h2>어땠나요?</h2>
          <p>선택하면 저장하고 {index === ids.length - 1 ? "역할 연습 결과를 확인해요." : "다음 대사로 이동해요."}</p>
          <RecallRatingButtons onRate={(rating) => dispatch({ type: "rate", rating })} />
        </div>
      )}
      <SourceNote />
      <ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={<button className="secondary" onClick={() => index > 0 ? dispatch({ type: "previous" }) : dispatch({ type: "view", view: "read" })}>
          {index > 0 ? "Previous turn" : "Read dialogue"}
        </button>}
      />
    </section>
  );
}

function TurnAnswer({ turn }: { turn: ConversationTurn }) {
  return <div className="answer-box"><span className="eyebrow">English · {turn.role}</span>{turn.english.map((line, i) => <p lang="en" key={i}>{line}</p>)}</div>;
}

function RoleSummary({ progress, dispatch, onOverview }: Pick<Props, "progress" | "dispatch" | "onOverview">) {
  const ids = roleTurnIds(progress.role);
  const easy = ids.filter((id) => progress.ratings[id] === "immediate").length;
  const review = ids.filter((id) => ["effort", "review"].includes(progress.ratings[id] ?? "")).length;
  return (
    <section className="panel conversation-panel">
      <div className="section-heading"><h2>Role {progress.role} practiced</h2><span className="badge">Self check</span></div>
      <div className="conversation-stats"><p>Recalled easily <strong>{easy}</strong></p><p>To review <strong>{review}</strong></p></div>
      <CompletionStatus progress={progress} />
      <ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={<button className="secondary" onClick={() => dispatch({ type: "role", role: progress.role, restart: true })}>Practice {progress.role} again</button>}
        forward={<button className="primary" onClick={() => progress.role === "A" ? dispatch({ type: "role", role: "B" }) : dispatch({ type: "view", view: "full" })}>
          {progress.role === "A" ? "Play B" : "Full Dialogue"} <span aria-hidden="true">→</span>
        </button>}
      />
    </section>
  );
}

function FullDialogue({ progress, dispatch, onOverview, onNext }: Props) {
  const [answer, setAnswer] = useState(false);
  return (
    <>
      <section className="panel conversation-panel">
        <div className="section-heading"><h2>Full Dialogue</h2><span className="badge">A + B</span></div>
        <Dialogue mode="korean" />
        <VoicePractice />
        <button className="primary full-width" onClick={() => dispatch({ type: "complete" })}>
          {progress.fullRecallCompleted ? "Done speaking ✓" : "Done speaking"}
        </button>
        <div className="conversation-answer-toggle"><button className="text-button" aria-expanded={answer} onClick={() => setAnswer(!answer)}>{answer ? "Hide English" : "Show English"}</button></div>
        {answer && <div className="conversation-full-answer" aria-label="English dialogue"><Dialogue mode="english" /></div>}
        <SourceNote />
        {!progress.fullRecallCompleted && <ActionFooter back={<button className="secondary" onClick={onOverview}>← Back to overview</button>} />}
      </section>
      {progress.fullRecallCompleted && (
        <section className="panel conversation-panel conversation-summary">
          <div className="section-heading"><h2>{isConversationComplete(progress) ? "Real Conversations complete" : "Your progress"}</h2><span className="badge">Self check</span></div>
          <CompletionStatus progress={progress} />
          <ActionFooter
            back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
            middle={<button className="secondary" onClick={() => dispatch({ type: "role", role: !isRoleComplete(progress, "A") ? "A" : "B", restart: true })}>
              {!isRoleComplete(progress, "A") ? "Play A" : !isRoleComplete(progress, "B") ? "Play B" : "Practice again"}
            </button>}
            forward={<button className="primary" onClick={onNext}>Next: Output Practice <span aria-hidden="true">→</span></button>}
          />
        </section>
      )}
    </>
  );
}

export function ConversationScreen({ pass, progress, dispatch, onOverview, onNext }: Props) {
  const roleActive = progress.view === "role" || progress.view === "role-summary";
  return (
    <div className="conversation-screen">
      <div className="page-heading">
        <span className="eyebrow">CHAPTER 3 · {pass > 1 ? `PASS ${pass} · CORE` : "REQUIRED"}</span>
        <h1 tabIndex={-1}>Real Conversations</h1>
        <p>{progress.view === "read" ? "Read both sides. Then take a role." : progress.view === "full" ? "Full Dialogue · Follow the Korean dialogue. Recall both roles in English." : `${conversationViewLabel(progress)} · Read your partner’s line. Say your part in English.`}</p>
      </div>
      <div className="conversation-modes" role="group" aria-label="Conversation mode">
        <button aria-pressed={progress.view === "read"} onClick={() => dispatch({ type: "view", view: "read" })}>Read</button>
        {(["A", "B"] as ConversationRole[]).map((role) => (
          <button key={role} aria-pressed={roleActive && progress.role === role} onClick={() => dispatch({ type: "role", role })}>
            Play {role}{isRoleComplete(progress, role) && <span aria-label="completed"> ✓</span>}
          </button>
        ))}
        <button aria-pressed={progress.view === "full"} onClick={() => dispatch({ type: "view", view: "full" })}>Full Dialogue{progress.fullRecallCompleted && <span aria-label="completed"> ✓</span>}</button>
      </div>
      {progress.view === "read" && (
        <section className="panel conversation-panel">
          <div className="reader-toolbar">
            <h2>Personality Traits <span className="conversation-turn-count">7 turns</span></h2>
            <div className="segmented" role="group" aria-label="Dialogue language">
              {([{ mode: "korean", label: "Korean" }, { mode: "english", label: "English" }, { mode: "together", label: "Both" }] as const).map(({ mode, label }) => (
                <button key={mode} aria-pressed={progress.readMode === mode} onClick={() => dispatch({ type: "readMode", mode })}>{label}</button>
              ))}
            </div>
          </div>
          <Dialogue mode={progress.readMode} />
          <SourceNote />
          <ActionFooter
            back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
            forward={<button className="primary" onClick={() => dispatch({ type: "role", role: "A" })}>Play A <span aria-hidden="true">→</span></button>}
          />
        </section>
      )}
      {progress.view === "role" && <RolePractice key={`${progress.role}-${progress.positions[progress.role]}`} progress={progress} dispatch={dispatch} onOverview={onOverview} />}
      {progress.view === "role-summary" && <RoleSummary progress={progress} dispatch={dispatch} onOverview={onOverview} />}
      {progress.view === "full" && <FullDialogue pass={pass} progress={progress} dispatch={dispatch} onOverview={onOverview} onNext={onNext} />}
    </div>
  );
}
