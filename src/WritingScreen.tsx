import { useId } from 'react';
import { writingQuestions, writingTemplates } from './data/writing';
import { completeWriting, editWritingDraft, hasOwnDraft, isWritingModeComplete, writingDraftKey, type WritingMode, type WritingProgress } from './writingProgress';
import { ActionFooter } from './ActionFooter';
import { chapter3, chapterLabel } from './data/chapters';
import './writing.css';

/** Shared editor: learner output is never promoted into source content or review answers. */
export function WritingEditor({ value, onChange, label = 'Your draft' }: { value: string; onChange: (value: string) => void; label?: string }) {
  const id = useId();
  return <div className="writing-editor">
    <label htmlFor={id}>{label}</label>
    <textarea id={id} value={value} onChange={event => onChange(event.target.value)} placeholder="Write here…" spellCheck lang="en" aria-describedby={`${id}-privacy`} />
    <div className="writing-editor-foot"><span id={`${id}-privacy`}>Drafts stay in this browser. Avoid sensitive personal details.</span><span>{value.trim() ? value.trim().split(/\s+/u).length : 0} words</span></div>
  </div>;
}

export function QuestionPicker({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const selected = writingQuestions.find(item => item.id === selectedId) ?? writingQuestions[0];
  return <div className="writing-prompts">
    <p className="writing-source-prompt" lang="en">{selected.english}</p>
    <details><summary>Choose a question</summary><div className="writing-question-list">{writingQuestions.map((item, index) => <button type="button" key={item.id} aria-pressed={selectedId === item.id} onClick={() => onSelect(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.english}</button>)}</div></details>
    <p className="writing-source">Source · Main textbook · Let’s Have a Talk · p.{chapter3.pages.whatAboutYou + 2}</p>
  </div>;
}

export function WritingScreen({ pass = 1, progress, onChange, onOverview, onNext }: { pass?: 1 | 2 | 3; progress: WritingProgress; onChange: (next: WritingProgress) => void; onOverview: () => void; onNext: () => void }) {
  const key = writingDraftKey(progress), draft = progress.drafts[key] ?? '';
  const template = writingTemplates.find(item => item.id === progress.selectedTemplateId) ?? writingTemplates[0];
  const currentCompleted = progress.completedDrafts[key] === draft && hasOwnDraft(draft);
  const modes: WritingMode[] = ['free', 'guided', 'template'];
  const nextMode = modes[modes.indexOf(progress.mode) + 1];
  const modeLabel = (mode: WritingMode) => ({ free: 'Free', guided: 'Guided', template: 'Template' })[mode];
  const openNextMode = () => nextMode && onChange({ ...progress, mode: nextMode });
  return <section className="writing-screen" aria-labelledby="writing-title">
    <header className="writing-heading"><p className="eyebrow">{chapterLabel(chapter3)} · {pass > 1 ? `PASS ${pass} · CORE` : 'REQUIRED'}</p><h1 id="writing-title" tabIndex={-1}>Weekly Writing</h1><p>{pass > 1 ? `Write a new Pass ${pass} draft with the chapter’s expressions. Free Writing is the default; source-guided help stays available.` : 'Choose one mode. Write your own story with the chapter’s expressions.'}</p></header>
    <div className="writing-card">
      <div className="writing-tabs" role="group" aria-label="Writing mode">{modes.map(mode => <button type="button" key={mode} aria-pressed={progress.mode === mode} onClick={() => onChange({ ...progress, mode })}>{modeLabel(mode)}{isWritingModeComplete(progress, mode) ? ' ✓' : ''}</button>)}</div>
      {progress.mode === 'guided' && <QuestionPicker selectedId={progress.selectedQuestionId} onSelect={selectedQuestionId => onChange({ ...progress, selectedQuestionId })} />}
      {progress.mode === 'template' && <div className="writing-prompts"><label className="writing-select-label" htmlFor="writing-template">Beginner Template</label><select id="writing-template" value={progress.selectedTemplateId} onChange={event => onChange({ ...progress, selectedTemplateId: event.target.value })}>{writingTemplates.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.english}</option>)}</select><p className="writing-source-prompt" lang="en">{template.english}</p><p>Fill the blanks in your draft, then keep writing.</p><p className="writing-source">Source · Main textbook · Beginner Template · p.{chapter3.pages.whatAboutYou + 1}</p></div>}
      <WritingEditor value={draft} onChange={text => onChange(editWritingDraft(progress, text))} />
      <ActionFooter
        back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
        middle={pass === 1 && progress.completed && nextMode && <button className="secondary" onClick={onNext}>Continue to Chapter Review</button>}
        forward={currentCompleted
          ? <button className="primary" onClick={pass > 1 ? onNext : nextMode ? openNextMode : onNext}>Next: {pass === 3 ? 'Chapter Review' : pass === 2 ? 'Chapter progress' : nextMode ? modeLabel(nextMode) : 'Chapter Review'} <span aria-hidden="true">→</span></button>
          : <button className="primary" disabled={!hasOwnDraft(draft)} onClick={() => onChange(completeWriting(progress))}>Mark complete</button>}
      />
      <p className="writing-status" role="status">{currentCompleted ? `${modeLabel(progress.mode)} draft complete. You can continue to ${pass === 3 ? 'Chapter Review' : pass === 2 ? 'Chapter progress' : nextMode ? modeLabel(nextMode) : 'Chapter Review'}.` : progress.completed ? 'Weekly Writing is complete in another draft. Finish this draft if you want to practice this mode.' : `One finished ${pass > 1 ? `new Pass ${pass} ` : ''}draft completes Weekly Writing.`} No corrections or automatic grading yet.</p>
    </div>
  </section>;
}
