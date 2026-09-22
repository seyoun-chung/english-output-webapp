import { QuestionPicker, WritingEditor } from './WritingScreen';
import { completeAboutAnswer, editAboutAnswer, hasOwnDraft, type AboutProgress } from './writingProgress';
import './writing.css';

export function AboutScreen({ progress, onChange, onOverview }: { progress: AboutProgress; onChange: (next: AboutProgress) => void; onOverview: () => void }) {
  const answer = progress.answers[progress.selectedQuestionId] ?? '';
  const completed = progress.completedQuestionIds.includes(progress.selectedQuestionId);
  return <section className="writing-screen" aria-labelledby="about-title"><header className="writing-heading"><p className="eyebrow">CHAPTER 3 / OPTIONAL</p><h1 id="about-title" tabIndex={-1}>What About You?</h1><p>Choose a question and make the answer yours.</p></header><div className="writing-card">
    <QuestionPicker selectedId={progress.selectedQuestionId} onSelect={selectedQuestionId => onChange({ ...progress, selectedQuestionId })} />
    <WritingEditor label="Your answer" value={answer} onChange={text => onChange(editAboutAnswer(progress, text))} />
    <div className="writing-actions"><button className="secondary" onClick={onOverview}>Overview</button><button className="primary" disabled={!hasOwnDraft(answer) || completed} onClick={() => onChange(completeAboutAnswer(progress))}>{completed ? 'Done ✓' : 'Mark done'}</button></div>
    <p className="writing-status" role="status">{progress.completedQuestionIds.length} answered · Optional for Pass 1</p>
  </div></section>;
}
