import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(8);
const storySource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.myStoryKorean,
  englishPage: metadata.pages.myStoryEnglish,
  section: "Chapter 8 / 8-1 My Story",
};

export const chapter8Chunks: Chunk[] = [
  { id: 1, korean: ["너 새해 목표가 뭐야?", "건강이랑 행복을 우선순위에 두고 싶어."], english: ["What’s your New Year’s resolution?", "I want to prioritize my health and well-being."], hint1: ["What’s your…", "I want to…"], hint2: ["What’s your New Year’s ______?", "I want to prioritize my health and ______."], source: storySource },
  { id: 2, korean: ["작년에 혈당이 정상보다 높다는 걸 알게 됐거든.", "나한테 이런 문제가 생길 줄은 생각도 못했어."], english: ["Last year, I found out that my blood sugar was higher than normal.", "I never thought I’d have this problem."], hint1: ["Last year…", "I never thought…"], hint2: ["Last year, I found out that my blood sugar was higher than ______.", "I never thought I’d have this ______."], source: storySource },
  { id: 3, korean: ["지금 생각해보면, 야식 먹고 계속 피곤하던 그때 딱 끊었어야 했어.", "살도 많이 쪘지."], english: ["Looking back, I should’ve stopped eating late night snacks when it started to make me feel constantly tired.", "I gained a lot of weight, too."], hint1: ["Looking back…", "I gained…"], hint2: ["Looking back, I should’ve stopped eating late night snacks when it started to make me feel constantly ______.", "I gained a lot of ______, too."], source: storySource },
  { id: 4, korean: ["올해는 단 거 좀 줄이고, 몸을 더 움직일 수 있는 새로운 취미도 시작하려고 해."], english: ["This year, I’m going to cut back on sugar and start a new hobby that helps me stay active."], hint1: ["This year…"], hint2: ["This year, I’m going to cut back on sugar and start a new hobby that helps me stay ______."], source: storySource },
  { id: 5, korean: ["그리고 매일 최소 7시간은 자려고 해.", "그러려면 진짜 커피 좀 줄여야 돼. 밤에 자꾸 늦게까지 깨어 있으니까."], english: ["I’ll also try to sleep at least seven hours every night.", "To do that, I really need to drink less coffee, which always keeps me up late."], hint1: ["I’ll also…", "To do that…"], hint2: ["I’ll also try to sleep at least seven hours every ______.", "To do that, I really need to drink less coffee, which always keeps me up ______."], source: storySource },
  { id: 6, korean: ["핸드폰 보는 시간도 줄여볼 거야.", "올해는 목표를 끝까지 지켰으면 좋겠다!"], english: ["I’ll try to cut down on screen time, too.", "Hopefully, I can stick to my resolutions this year!"], hint1: ["I’ll try…", "Hopefully…"], hint2: ["I’ll try to cut down on screen ______, too.", "Hopefully, I can stick to my resolutions this ______!"], source: storySource },
];

const conversationSource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.conversationKorean,
  englishPage: metadata.pages.conversationEnglish,
  section: "Chapter 8 / 8-3 Real Conversations",
};

export const chapter8ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "나 요즘 좀 우울해.", english: ["I’ve been feeling a bit down lately."], hint1: ["I’ve been…"], hint2: ["I’ve been feeling a bit ______ lately."], source: conversationSource },
  { id: 2, role: "B", korean: "왜? 무슨 일 있어?", english: ["Why?", "What’s wrong?"], hint1: ["Why?", "What’s…"], hint2: ["Why?", "What’s ______?"], source: conversationSource },
  { id: 3, role: "A", korean: "딱히 이유는 없는데, 그냥 평소에 기분이 좀 가라앉아. 사실 별 이유도 없는 것 같아.", english: ["Nothing specific, really.", "I guess I just feel down in general.", "Maybe I don’t have a good reason for it."], hint1: ["Nothing specific…", "I guess…", "Maybe I…"], hint2: ["Nothing ______, really.", "I guess I just feel down in ______.", "Maybe I don’t have a good reason for ______."], source: conversationSource },
  { id: 4, role: "B", korean: "아이고, 그랬구나. 힘들겠네. 나도 예전에 우울증으로 고생했었거든.", english: ["Oh, I’m sorry, that sucks.", "I used to struggle with depression, too."], hint1: ["Oh, I’m…", "I used to…"], hint2: ["Oh, I’m sorry, that ______.", "I used to struggle with ______, too."], source: conversationSource },
  { id: 5, role: "A", korean: "헐, 진짜? 너는 항상 밝아 보여서 전혀 그럴 거라 생각 못했어.", english: ["Really?", "You always look so cheerful.", "I never would have guessed."], hint1: ["Really?", "You always…", "I never…"], hint2: ["Really?", "You always look so ______.", "I never would have ______."], source: conversationSource },
  { id: 6, role: "B", korean: "응, 그런 얘기는 잘 안 하거든. 근데 상담사를 만나면서 그 힘든 시기를 버틸 수 있었어.", english: ["Yeah, I don’t talk about it much, but seeing a therapist really helped me get through those hard times."], hint1: ["Yeah, I don’t…"], hint2: ["Yeah, I don’t talk about it much, but seeing a therapist really helped me get through those hard ______."], source: conversationSource },
  { id: 7, role: "A", korean: "나는 상담 받아볼 생각을 한 번도 안 해봤어. 한국은 그런 거 하면 좀 안 좋은 시선이 있잖아.", english: ["I never even thought about doing that before.", "I guess it kind of has a negative stigma in Korea."], hint1: ["I never…", "I guess…"], hint2: ["I never even thought about doing that ______.", "I guess it kind of has a negative stigma in ______."], source: conversationSource },
  { id: 8, role: "B", korean: "사실 그러면 안 되지. 누군가 내 얘기를 들어줄 사람이 있다는 것만으로도 치유가 돼. 그 선생님 덕분에 내가 나한테 얼마나 가혹했는지도 깨달았어.", english: ["It really shouldn’t.", "Having someone listen to you is so healing.", "She helped me realize how hard I was being on myself."], hint1: ["It really…", "Having someone…", "She helped…"], hint2: ["It really ______.", "Having someone listen to you is so ______.", "She helped me realize how hard I was being on ______."], source: conversationSource },
  { id: 9, role: "A", korean: "네 말이 맞아. 혹시 그분이랑 나랑 연결해 줄 수 있을까?", english: ["You’re so right.", "Do you think you can put me in touch with her?"], hint1: ["You’re so…", "Do you think…"], hint2: ["You’re so ______.", "Do you think you can put me in touch with ______?"], source: conversationSource },
  { id: 10, role: "B", korean: "그럼, 당연하지. 먼저 여쭤본 다음에 너한테 전화 하라고 할게.", english: ["Of course.", "Let me ask her first, and then I’ll have her call you."], hint1: ["Of course.", "Let me…"], hint2: ["Of ______.", "Let me ask her first, and then I’ll have her call ______."], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter8Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter8ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 8 — My Story.pdf", page: 1, section: "Week 8 / My Story" };
const conversationNotes = { file: "Week 8 — Real Conversations.pdf", page: 1, section: "Week 8 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "가족을 우선순위로 두고 싶어.", english: ["I want to prioritize my family."], hint1: ["I want…"], hint2: ["I want to prioritize my ______."], source: storyNotes },
  { id: "output-variation-2", korean: "내가 여기까지 오리라곤 생각 못했어.", english: ["I never thought I’d come this far."], hint1: ["I never…"], hint2: ["I never thought I’d come this ______."], source: { ...storyNotes, page: 2 } },
  { id: "output-variation-3", korean: "이번주엔 내 공부루틴을 잘 지킬 수 있기를!", english: ["Hopefully I can stick to my study routine this week!"], hint1: ["Hopefully…"], hint2: ["Hopefully I can stick to my study routine this ______!"], source: { ...storyNotes, page: 6 } },
  { id: "output-variation-4", korean: "야식 먹는 거? 그게 뭐가 문제야?", english: ["Eating late night snacks?", "What’s wrong with that?"], hint1: ["Eating late…", "What’s wrong…"], hint2: ["Eating late night ______?", "What’s wrong with ______?"], source: { ...conversationNotes, page: 2 } },
  { id: "output-variation-5", korean: "부트캠프 정말 힘들었는데 그래도 끝까지 해냈어.", english: ["The bootcamp was really hard, but I got through it."], hint1: ["The bootcamp…"], hint2: ["The bootcamp was really hard, but I got through ______."], source: { ...conversationNotes, page: 4 } },
  { id: "output-variation-6", korean: "이자벨라랑 연결해줄 수 있어?", english: ["Can you put me in touch with Isabella?"], hint1: ["Can you…"], hint2: ["Can you put me in touch with ______?"], source: { ...conversationNotes, page: 6 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 8, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "What are your goals for your health and happiness? Describe in detail what you want to accomplish and how you’ll do it.",
  "How do you take care of your mental health?",
  "What makes you happy?",
  "What small habits make your life happier?",
  "What’s one thing you’re grateful for these days?",
  "What does a “happy life” mean to you personally?",
  "How do you usually take care of your health?",
  "Do you enjoy exercising? What’s your favorite way to stay active?",
  "Are you a heavy sleeper or a light sleeper? Do you have any routines that help you sleep well?",
  "What kind of food makes you feel healthy and happy?",
  "How do you usually deal with stress?",
  "Do you think social media affects mental health? How?",
  "What do you usually do when you feel sad or anxious?",
  "Do you think therapy or counseling should be more common? Why or why not?",
].map((english, index) => ({ id: `ch8-question-${index + 1}`, english, ...writingSource, sourcePage: index === 0 ? 170 : 172, section: index === 0 ? "What About You?" : "Let’s Have a Talk" }));
const writingTemplates = [
  "I want to take care of my ___",
  "I want to prioritize ___",
  "I realized that ___",
  "This year, I’m going to ___",
  "I’m going to cut back on ___",
  "I think the best way to do this is to ___",
].map((english, index) => ({ id: `ch8-template-${index + 1}`, english, ...writingSource, sourcePage: 171, section: "Beginner Template" }));

export const chapter8Content: ChapterContent = {
  id: 8,
  metadata,
  chunks: chapter8Chunks,
  conversations: chapter8ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "make, have, let, help",
    subtitle: "Influencing, arranging, allowing, and helping",
    sections: [
      { heading: "make", description: "누군가가 무엇을 하게 만들거나 시키는 느낌으로 사용해.", examples: [
        { id: "ch8-make-1", english: "My boss made me work late.", korean: "상사가 야근 시켰어." },
        { id: "ch8-make-2", english: "Charlie made me do the dishes.", korean: "Charlie가 나한테 설거지 시켰어." },
        { id: "ch8-make-3", english: "Kohamcare makes me study English every day.", korean: "코햄케어 때문에 난 매일 영어 공부를 하게 돼." },
      ] },
      { heading: "have", description: "누군가에게 어떤 일을 하도록 맡기거나 부탁할 때 사용해.", examples: [
        { id: "ch8-have-1", english: "I’ll have someone bring your size.", korean: "고객님 사이즈 가져오라고 할게요." },
        { id: "ch8-have-2", english: "I had him get some wine.", korean: "걔한테 와인 좀 사 와 달라고 했어." },
        { id: "ch8-have-3", english: "Koham had us use a weekly planner.", korean: "코햄이 우리한테 주간 플래너 쓰라고 했어." },
      ] },
      { heading: "let", description: "상대방이 무언가를 하게 두거나 허락할 때 사용해.", examples: [
        { id: "ch8-let-1", english: "She let me drive her car.", korean: "걔가 자기 차 운전하게 해줬어." },
        { id: "ch8-let-2", english: "Don’t let him bother you.", korean: "걔가 널 괴롭히게 두지 마." },
        { id: "ch8-let-3", english: "Please let me know if you need help.", korean: "도움이 필요하면 알려줘." },
      ] },
      { heading: "help", description: "상대방이 무언가를 하도록 도와줄 때 사용해.", examples: [
        { id: "ch8-help-1", english: "The live practice really helped me improve my English.", korean: "라이브 연습이 영어 실력을 늘리는 데 진짜 도움이 많이 됐어." },
        { id: "ch8-help-2", english: "Yoga helps me sleep better at night.", korean: "요가를 하면 잠을 더 푹 자." },
        { id: "ch8-help-3", english: "Let me help you do that.", korean: "그거 하는 거 도와줄게." },
      ] },
    ],
    sourcePages: [163, 164],
  },
};
