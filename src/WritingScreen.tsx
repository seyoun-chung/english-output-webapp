import { useId } from 'react';
import { writingQuestions, writingTemplates } from './data/writing';
import { completeWriting, editWritingDraft, hasOwnDraft, writingDraftKey, type WritingProgress } from './writingProgress';
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
    <p className="writing-source">Source · Main textbook · Let’s Have a Talk · p.65</p>
  </div>;
}

export function WritingScreen({ progress, onChange, onOverview }: { progress: WritingProgress; onChange: (next: WritingProgress) => void; onOverview: () => void }) {
  const key = writingDraftKey(progress), draft = progress.drafts[key] ?? '';
  const template = writingTemplates.find(item => item.id === progress.selectedTemplateId) ?? writingTemplates[0];
  const currentCompleted = progress.completed && progress.completedDraftKey === key;
  return <section className="writing-screen" aria-labelledby="writing-title">
    <header className="writing-heading"><p className="eyebrow">CHAPTER 3 / WEEKLY WRITING</p><h1 id="writing-title" tabIndex={-1}>Make it your story</h1><p>Choose one mode. Write your own story with the chapter’s expressions.</p></header>
    <div className="writing-card">
      <div className="writing-tabs" role="group" aria-label="Writing mode">{(['free', 'guided', 'template'] as const).map(mode => <button type="button" key={mode} aria-pressed={progress.mode === mode} onClick={() => onChange({ ...progress, mode })}>{mode === 'free' ? 'Free' : mode === 'guided' ? 'Guided' : 'Template'}</button>)}</div>
      {progress.mode === 'guided' && <QuestionPicker selectedId={progress.selectedQuestionId} onSelect={selectedQuestionId => onChange({ ...progress, selectedQuestionId })} />}
      {progress.mode === 'template' && <div className="writing-prompts"><label className="writing-select-label" htmlFor="writing-template">Beginner Template</label><select id="writing-template" value={progress.selectedTemplateId} onChange={event => onChange({ ...progress, selectedTemplateId: event.target.value })}>{writingTemplates.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.english}</option>)}</select><p className="writing-source-prompt" lang="en">{template.english}</p><p>Fill the blanks in your draft, then keep writing.</p><p className="writing-source">Source · Main textbook · Beginner Template · p.64</p></div>}
      <WritingEditor value={draft} onChange={text => onChange(editWritingDraft(progress, text))} />
      <div className="writing-actions"><button className="secondary" onClick={onOverview}>Overview</button><button className="primary" disabled={!hasOwnDraft(draft) || currentCompleted} onClick={() => onChange(completeWriting(progress))}>{currentCompleted ? 'Completed ✓' : 'Mark complete'}</button></div>
      <p className="writing-status" role="status">{progress.completed ? currentCompleted ? 'Weekly Writing complete. You can keep editing.' : 'Weekly Writing complete in another draft. This draft is separate.' : 'One finished draft completes Weekly Writing. No automatic grading.'}</p>
    </div>
  </section>;
}
