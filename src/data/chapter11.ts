import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(11);
const storySource = { file: metadata.sourceFile, koreanPage: metadata.pages.myStoryKorean, englishPage: metadata.pages.myStoryEnglish, section: "Chapter 11 / 11-1 My Story" };

export const chapter11Chunks: Chunk[] = [
  { id: 1, korean: ["부트캠프가 이제 일주일밖에 안 남았네!", "기분이 어때?"], english: ["Only one week left in the boot camp!", "How do you feel?"], hint1: ["Only one…", "How do…"], hint2: ["Only one week left in the boot ______!", "How do you ______?"], source: storySource },
  { id: 2, korean: ["솔직히 내가 여기까지 올 줄은 전혀 생각 못했어.", "부트캠프 전에는 영어를 여러 번 포기했거든."], english: ["Honestly, I never thought I would come this far.", "Before the boot camp, I gave up on English so many times."], hint1: ["Honestly…", "Before the…"], hint2: ["Honestly, I never thought I would come this ______.", "Before the boot camp, I gave up on English so many ______."], source: storySource },
  { id: 3, korean: ["항상 빨리 유창해질 수 있는 쉬운 방법만 찾았어.", "근데 부트캠프를 하면서 중요한 건 방법이 아니라는 걸 깨달았지."], english: ["I was constantly looking for a shortcut to becoming fluent.", "But during the boot camp, I realized it’s not about the method."], hint1: ["I was…", "But during…"], hint2: ["I was constantly looking for a shortcut to becoming ______.", "But during the boot camp, I realized it’s not about the ______."], source: storySource },
  { id: 4, korean: ["중요한 건 꾸준히 노력하고 포기하지 않는 거야."], english: ["It’s about putting in the effort and never giving up."], hint1: ["It’s about…"], hint2: ["It’s about putting in the effort and never giving ______."], source: storySource },
  { id: 5, korean: ["돌아보면 좀 이랬으면 어땠을까 하는 것도 있어.", "예를 들면 좀 더 꾸준히 할 걸 하는 아쉬움 같은 거."], english: ["Looking back, there are things I could’ve done differently, like I should’ve been more consistent."], hint1: ["Looking back…"], hint2: ["Looking back, there are things I could’ve done differently, like I should’ve been more ______."], source: storySource },
  { id: 6, korean: ["그래도 1주 차랑 비교하면 내 영어는 확실히 성장했어.", "올바른 공부법을 배웠고, 이제 외국인한테 말할 때도 덜 긴장돼.", "제일 중요한 건 이제 내 꿈을 쫓을 용기가 생겼다는 거야!"], english: ["But compared to week 1, my English has definitely improved.", "I learned the right way to study, and I’m less nervous to speak to foreigners.", "The most important thing is now I have the courage to pursue my dreams!"], hint1: ["But compared…", "I learned…", "The most…"], hint2: ["But compared to week 1, my English has definitely ______.", "I learned the right way to study, and I’m less nervous to speak to ______.", "The most important thing is now I have the courage to pursue my ______!"], source: storySource },
];

const conversationSource = { file: metadata.sourceFile, koreanPage: metadata.pages.conversationKorean, englishPage: metadata.pages.conversationEnglish, section: "Chapter 11 / 11-3 Real Conversations" };

export const chapter11ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "부트캠프가 다음 주면 끝난다니 믿기지 않아.", english: ["I can’t believe the boot camp is ending next week."], hint1: ["I can’t…"], hint2: ["I can’t believe the boot camp is ending next ______."], source: conversationSource },
  { id: 2, role: "B", korean: "내 말이. 일하면서 공부까지 하는 게 쉽진 않았는데, 어떻게 여기까지 왔네.", english: ["Tell me about it.", "Working and studying at the same time wasn’t easy, but somehow I made it this far."], hint1: ["Tell me…", "Working and…"], hint2: ["Tell me about ______.", "Working and studying at the same time wasn’t easy, but somehow I made it this ______."], source: conversationSource },
  { id: 3, role: "A", korean: "너한텐 진짜 쉽지 않았겠다.", english: ["It must’ve been really challenging for you."], hint1: ["It must’ve…"], hint2: ["It must’ve been really challenging for ______."], source: conversationSource },
  { id: 4, role: "B", korean: "맞아. 그래도 포기 안 한 내가 대견해. 솔직히 부트캠프 진작 시작할걸 그랬다는 생각이 계속 들어.", english: ["For sure.", "But I’m proud of myself for not giving up.", "Honestly, I keep thinking I should’ve joined this boot camp earlier."], hint1: ["For sure.", "But I’m…", "Honestly…"], hint2: ["For ______.", "But I’m proud of myself for not giving ______.", "Honestly, I keep thinking I should’ve joined this boot camp ______."], source: conversationSource },
  { id: 5, role: "A", korean: "나도 그래. 이걸 진작 알았더라면 시간도 돈도 덜 낭비했을 텐데.", english: ["Same here.", "If I had known about it before, I wouldn’t have wasted so much time and money."], hint1: ["Same here.", "If I had…"], hint2: ["Same ______.", "If I had known about it before, I wouldn’t have wasted so much time and ______."], source: conversationSource },
  { id: 6, role: "B", korean: "너한테는 뭐가 제일 좋았어?", english: ["What was the best part for you?"], hint1: ["What was…"], hint2: ["What was the best part for ______?"], source: conversationSource },
  { id: 7, role: "A", korean: "무조건 라이브 수업이지. 그리고 스터디 그룹도 진짜 좋았어. 스터디 멤버가 없었으면 벌써 포기했을 거야.", english: ["Definitely the live classes.", "I also love my study group.", "Without them, I would’ve quit already."], hint1: ["Definitely…", "I also…", "Without them…"], hint2: ["Definitely the live ______.", "I also love my study ______.", "Without them, I would’ve quit ______."], source: conversationSource },
  { id: 8, role: "B", korean: "나도 스터디 그룹에 들어갈걸 그랬네. 용기가 없었어.", english: ["I guess I should have joined a study group too.", "I didn’t have the courage to do it."], hint1: ["I guess…", "I didn’t…"], hint2: ["I guess I should have joined a study group ______.", "I didn’t have the courage to do ______."], source: conversationSource },
  { id: 9, role: "A", korean: "야, 이제 시작이잖아. 우리 그룹에서 앞으로 3개월 더 공부하기로 방금 결정했거든. 같이 할래?", english: ["Hey, it’s just the beginning.", "Our group just decided to study for another three months.", "Do you want to join?"], hint1: ["Hey…", "Our group…", "Do you…"], hint2: ["Hey, it’s just the ______.", "Our group just decided to study for another three ______.", "Do you want to ______?"], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter11Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter11ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 11 — My Story.pdf", page: 1, section: "Week 11 / My Story" };
const conversationNotes = { file: "Week 11 — Real Conversations.pdf", page: 1, section: "Week 11 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "내가 영어로 몇 시간을 떠들 수 있게 될 거라곤 생각 못했어.", english: ["I never thought I would be able to talk in English for hours."], hint1: ["I never…"], hint2: ["I never thought I would be able to talk in English for ______."], source: storyNotes },
  { id: "output-variation-2", korean: "무슨 일이 있어도 영어 배우는 걸 포기하지 않을 거야.", english: ["I’m not going to give up on learning English no matter what."], hint1: ["I’m not…"], hint2: ["I’m not going to give up on learning English no matter ______."], source: { ...storyNotes, page: 3 } },
  { id: "output-variation-3", korean: "더 일찍 일어나서 최소 30분은 공부할 수도 있었는데, 안 했어.", english: ["I could’ve woken up early and studied for at least 30 minutes, but I didn’t."], hint1: ["I could’ve…"], hint2: ["I could’ve woken up early and studied for at least 30 minutes, but I ______."], source: { ...storyNotes, page: 4 } },
  { id: "output-variation-4", korean: "내가 여기까지 왔다니 안 믿겨.", english: ["I can’t believe I’ve come this far."], hint1: ["I can’t…"], hint2: ["I can’t believe I’ve come this ______."], source: conversationNotes },
  { id: "output-variation-5", korean: "진짜 힘들었겠다.", english: ["It must’ve been really tough."], hint1: ["It must’ve…"], hint2: ["It must’ve been really ______."], source: { ...conversationNotes, page: 2 } },
  { id: "output-variation-6", korean: "시간을 좀 더 쓸 걸.", english: ["I should’ve put in more time."], hint1: ["I should’ve…"], hint2: ["I should’ve put in more ______."], source: { ...conversationNotes, page: 5 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 11, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "The boot camp is almost over! How do you feel about it? Tell me what you liked, what was challenging, the people you met, and what you’ve learned. Give us as much detail as possible!",
  "What are you most proud of from this boot camp?",
  "Which activity or class helped you the most?",
  "What was the most fun or memorable moment?",
  "Who did you connect with the most, and why?",
  "Did you ever feel like giving up? How did you keep going?",
  "What was your biggest improvement in English?",
  "Did you discover anything new about yourself through this experience?",
  "What English phrase or word will you never forget from this boot camp?",
  "How did this boot camp affect your daily life or routine?",
  "How will you celebrate finishing the boot camp?",
  "How will you keep studying English after the boot camp?",
].map((english, index) => ({ id: `ch11-question-${index + 1}`, english, ...writingSource, sourcePage: index === 0 ? 226 : 228, section: index === 0 ? "What About You?" : "Let’s Have a Talk" }));
const writingTemplates = [
  "I feel ___",
  "Without ___, I would have quit.",
  "Looking back, I should have ___",
  "But I learned that ___",
  "Compared to three months ago, I’m ___",
  "It’s just the beginning. I want to ___",
].map((english, index) => ({ id: `ch11-template-${index + 1}`, english, ...writingSource, sourcePage: 227, section: "Beginner Template" }));

export const chapter11Content: ChapterContent = {
  id: 11,
  metadata,
  chunks: chapter11Chunks,
  conversations: chapter11ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "could’ve, should’ve, would’ve",
    subtitle: "Looking back on past choices",
    sections: [
      { heading: "could’ve", description: "할 수도 있었지만 하지 않은 일을 말할 때 사용해.", examples: [
        { id: "ch11-could-1", english: "I could’ve joined a study group, but I didn’t.", korean: "스터디 그룹에 들어갈 수도 있었는데, 안 들어갔어." },
        { id: "ch11-could-2", english: "You could’ve told me earlier.", korean: "나한테 더 일찍 말해줄 수도 있었잖아." },
        { id: "ch11-could-3", english: "I couldn’t have done it without you.", korean: "네가 없었으면 못했어." },
      ] },
      { heading: "should’ve", description: "과거에 그랬어야 했다고 후회할 때 사용해.", examples: [
        { id: "ch11-should-1", english: "I should’ve studied harder.", korean: "공부를 더 열심히 할걸 그랬어." },
        { id: "ch11-should-2", english: "You should’ve told me earlier.", korean: "나한테 더 일찍 말해줬어야 했어." },
        { id: "ch11-should-3", english: "I shouldn’t have said that.", korean: "그 말 하지 말걸 그랬어." },
      ] },
      { heading: "would’ve", description: "상황이 달랐다면 다르게 했을 일을 말할 때 사용해.", examples: [
        { id: "ch11-would-1", english: "I would have helped him if he’d asked me.", korean: "만약 걔가 도와달라고 했었으면 도와줬을 거야." },
        { id: "ch11-would-2", english: "I would have answered the phone if I’d known it was you.", korean: "넌 줄 알았으면 전화 받았을 거야." },
        { id: "ch11-would-3", english: "I would’ve bought it if it wasn’t this expensive.", korean: "이렇게 비싸지 않았더라면 샀을 거야." },
      ] },
    ],
    sourcePages: [218, 219],
  },
};
