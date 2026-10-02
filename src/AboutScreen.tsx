import { QuestionPicker, WritingEditor } from './WritingScreen';
import { completeAboutAnswer, editAboutAnswer, hasOwnDraft, type AboutProgress } from './writingProgress';
import { ActionFooter } from './ActionFooter';
import './writing.css';

export function AboutScreen({ pass = 1, progress, onChange, onOverview, onNext }: { pass?: 1 | 2 | 3; progress: AboutProgress; onChange: (next: AboutProgress) => void; onOverview: () => void; onNext: () => void }) {
  const answer = progress.answers[progress.selectedQuestionId] ?? '';
  const completed = progress.completedQuestionIds.includes(progress.selectedQuestionId);
  const required = pass === 3;
  return <section className="writing-screen" aria-labelledby="about-title"><header className="writing-heading"><p className="eyebrow">CHAPTER 3 · {required ? 'PASS 3 · REQUIRED' : 'OPTIONAL'}</p><h1 id="about-title" tabIndex={-1}>What About You?</h1><span className="badge">{required ? 'Required' : 'Optional'}</span><p>Choose a question and make the answer yours.</p></header><div className="writing-card">
    <QuestionPicker selectedId={progress.selectedQuestionId} onSelect={selectedQuestionId => onChange({ ...progress, selectedQuestionId })} />
    <WritingEditor label="Your answer" value={answer} onChange={text => onChange(editAboutAnswer(progress, text))} />
    <ActionFooter
      back={<button className="secondary" onClick={onOverview}>← Back to overview</button>}
      middle={<button className="secondary" disabled={!hasOwnDraft(answer) || completed} onClick={() => onChange(completeAboutAnswer(progress))}>{completed ? 'Done ✓' : 'Mark done'}</button>}
      forward={<button className="primary" onClick={onNext}>Next: Weekly Writing <span aria-hidden="true">→</span></button>}
    />
    <p className="writing-status" role="status">{progress.completedQuestionIds.length} answered</p>
  </div></section>;
}
