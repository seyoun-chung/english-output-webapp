import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(4);
const storySource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.myStoryKorean,
  englishPage: metadata.pages.myStoryEnglish,
  section: "Chapter 4 / 4-1 My Story",
};

export const chapter4Chunks: Chunk[] = [
  {
    id: 1,
    korean: ["왔네! 일은 어땠어?", "솔직히 오늘 좀 힘든 하루였어."],
    english: ["You’re home! How was work?", "Honestly, it was kind of a tough day."],
    hint1: ["You’re home!…", "Honestly,…"],
    hint2: ["You’re ______! How was work?", "Honestly, it was kind of a ______ day."],
    source: storySource,
  },
  {
    id: 2,
    korean: ["동료 중 한 명이 마감일을 못 맞춰서 우리가 대신 처리하느라 늦게까지 남아야 했거든."],
    english: ["One of my coworkers didn’t meet his deadline, so we had to stay late to cover for him."],
    hint1: ["One of my coworkers…"],
    hint2: ["One of my coworkers didn’t meet his ______, so we had to stay late to ______ for him."],
    source: storySource,
  },
  {
    id: 3,
    korean: ["다들 엄청 열 받긴 했는데, 뭐 일부러 그런 게 아니니까.", "신입인데 어쩌겠어."],
    english: ["Everyone was pissed off, but it’s not like he did it on purpose.", "He’s just new."],
    hint1: ["Everyone was…", "He’s just…"],
    hint2: ["Everyone was pissed off, but it’s not like he did it on ______.", "He’s just ______."],
    source: storySource,
  },
  {
    id: 4,
    korean: ["저녁에 모두한테 사과하더라.", "보니까 진심으로 미안해하는 것 같았어."],
    english: ["In the evening, he apologized to everyone.", "It seems like he was genuinely sorry."],
    hint1: ["In the evening…", "It seems like…"],
    hint2: ["In the evening, he ______ to everyone.", "It seems like he was genuinely ______."],
    source: storySource,
  },
  {
    id: 5,
    korean: ["그 일 다 끝나고 집에 오는데 길이 꽉 막힌 거야.", "고속도로에 큰 사고가 난 것 같더라고."],
    english: ["After all that, I got caught in traffic on the way home.", "It looked like there was a big accident on the freeway."],
    hint1: ["After all that…", "It looked like…"],
    hint2: ["After all that, I got caught in ______ on the way home.", "It looked like there was a big ______ on the freeway."],
    source: storySource,
  },
  {
    id: 6,
    korean: ["처음엔 진짜 짜증 났는데, 가끔은 그냥 웃어버려야지 어쩌겠어.", "어쨌든 드디어 하루가 끝났네, 살겠다.", "저녁은 뭐야?"],
    english: ["At first, I was really frustrated, but sometimes you just have to laugh about it.", "Anyway, I’m glad the day is over.", "What’s for dinner?"],
    hint1: ["At first…", "Anyway,…", "What’s…"],
    hint2: ["At first, I was really frustrated, but sometimes you just have to ______ about it.", "Anyway, I’m glad the day is ______.", "What’s for ______?"],
    source: storySource,
  },
];

const conversationSource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.conversationKorean,
  englishPage: metadata.pages.conversationEnglish,
  section: "Chapter 4 / 4-3 Real Conversations",
};

export const chapter4ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "왔네! 오늘 일은 어땠어?", english: ["Hey! How was work today?"], hint1: ["Hey! How…"], hint2: ["Hey! How was ______ today?"], source: conversationSource },
  { id: 2, role: "B", korean: "괜찮았어. 아, 아까 Sally랑 얘기했는데, 다음 달에 혼자 발리에 간대. 첫 솔로 여행이라 그런지 진짜 신나 보이더라.", english: ["Not bad.", "Oh, I was talking to Sally earlier.", "She’s going to Bali next month by herself.", "It looks like she’s really excited for her first solo trip."], hint1: ["Not bad.", "Oh, I was…", "She’s going…", "It looks like…"], hint2: ["Not ______.", "Oh, I was talking to Sally ______.", "She’s going to Bali next month by ______.", "It looks like she’s really excited for her first ______ trip."], source: conversationSource },
  { id: 3, role: "A", korean: "그래? 나도 예전부터 발리에 가 보고 싶었는데! 부럽다.", english: ["Really?", "I’ve always wanted to go there!", "I’m jealous."], hint1: ["Really?", "I’ve always…", "I’m…"], hint2: ["Really?", "I’ve always wanted to go ______!", "I’m ______."], source: conversationSource },
  { id: 4, role: "B", korean: "그러니까. 우리 여행 간 지 꽤 됐잖아.", english: ["I know.", "It’s been a while since we went on vacation."], hint1: ["I know.", "It’s been…"], hint2: ["I know.", "It’s been a while since we went on ______."], source: conversationSource },
  { id: 5, role: "A", korean: "나도 그 생각하고 있었어. 아까 태국 다큐멘터리를 보는데, 야시장하고 길거리 음식이 진짜 대단하대.", english: ["I was just thinking that.", "I was watching a documentary about Thailand.", "They said they have incredible night markets and street food."], hint1: ["I was just…", "I was watching…", "They said…"], hint2: ["I was just thinking ______.", "I was watching a documentary about ______.", "They said they have incredible night markets and street ______."], source: conversationSource },
  { id: 6, role: "B", korean: "와, 태국도 진짜 좋겠다! 예전부터 내 버킷리스트에 있었거든.", english: ["Oh, Thailand would be amazing!", "It’s always been on my bucket list."], hint1: ["Oh, Thailand…", "It’s always…"], hint2: ["Oh, Thailand would be ______!", "It’s always been on my bucket ______."], source: conversationSource },
  { id: 7, role: "A", korean: "저녁 먹으면서 더 얘기해 보자! 배고프지?", english: ["Let’s talk about it over dinner!", "Are you hungry?"], hint1: ["Let’s talk…", "Are you…"], hint2: ["Let’s talk about it over ______!", "Are you ______?"], source: conversationSource },
  { id: 8, role: "B", korean: "응, 배고파 죽겠어.", english: ["Yeah, I’m starving."], hint1: ["Yeah,…"], hint2: ["Yeah, I’m ______."], source: conversationSource },
  { id: 9, role: "A", korean: "카레 만들었어. 밥 차려 줄게. 아니면 어제 저녁에 남은 거 먹을래?", english: ["I made curry.", "Let me get you a plate, unless you want the leftovers from last night."], hint1: ["I made…", "Let me…"], hint2: ["I made ______.", "Let me get you a plate, unless you want the ______ from last night."], source: conversationSource },
  { id: 10, role: "B", korean: "카레 좋아.", english: ["Curry sounds good."], hint1: ["Curry…"], hint2: ["Curry sounds ______."], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter4Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter4ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 4 — My Story 강의노트.pdf", page: 1, section: "Week 4 / My Story" };
const conversationNotes = { file: "Week 4 — Real Conversations 강의노트.pdf", page: 1, section: "Week 4 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "긴 하루였어. (힘들었어)", english: ["It was a long day."], hint1: ["It was…"], hint2: ["It was a ______ day."], source: { ...storyNotes, page: 4 } },
  { id: "output-variation-2", korean: "나 빡쳤어.", english: ["I’m pissed off."], hint1: ["I’m…"], hint2: ["I’m pissed ______."], source: { ...storyNotes, page: 5 } },
  { id: "output-variation-3", korean: "걔한테 사과하고 싶어. 뭔가 좀 미안하네.", english: ["I want to apologize to her.", "I kind of feel bad."], hint1: ["I want to…", "I kind of…"], hint2: ["I want to apologize to ______.", "I kind of feel ______."], source: { ...storyNotes, page: 6 } },
  { id: "output-variation-4", korean: "오는 길에 커피 한잔 사다줄 수 있어?", english: ["Can you get me a coffee on the way?"], hint1: ["Can you…"], hint2: ["Can you get me a coffee on the ______?"], source: { ...storyNotes, page: 7 } },
  { id: "output-variation-5", korean: "나 항상 영어를 유창하게 하고 싶었어.", english: ["I’ve always wanted to be fluent in English."], hint1: ["I’ve always…"], hint2: ["I’ve always wanted to be ______ in English."], source: { ...conversationNotes, page: 2 } },
  { id: "output-variation-6", korean: "점심 먹으면서 얘기하자.", english: ["Let’s talk about it over lunch."], hint1: ["Let’s talk…"], hint2: ["Let’s talk about it over ______."], source: { ...conversationNotes, page: 5 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 4, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "How was your day? What did you do in the morning? Where did you go? What did you eat? Who did you meet? What did you see, hear, and feel? Tell us in as much detail as possible.",
  "Tell me your morning or night routine.",
  "Tell me about your daily routine.",
  "Did you go anywhere today? Where did you go?",
  "What’s the last thing you spent money on?",
  "What was your last delivery order?",
  "Do you order delivery often, or do you prefer cooking at home?",
  "What do you spend the most money on (besides basic necessities)?",
  "What drink do you usually order from cafes?",
  "Are you a coffee person? What kind of coffee do you like, and how much do you drink a day?",
  "Who did you hang out with most recently? What did you do?",
  "Who did you talk to most recently? What did you talk about?",
  "What is your favorite day of the week?",
].map((english, index) => ({ id: `ch4-question-${index + 1}`, english, ...writingSource, sourcePage: index === 0 ? 88 : 90, section: index === 0 ? "What About You?" : "Let’s Have a Talk" }));
const writingTemplates = [
  "Today was ___",
  "At work, I had to ___",
  "I talked to ___ about ___",
  "For lunch, I ate ___",
  "After work, I ___",
  "On the way home, I ___",
].map((english, index) => ({ id: `ch4-template-${index + 1}`, english, ...writingSource, sourcePage: 89, section: "Beginner Template" }));

export const chapter4Content: ChapterContent = {
  id: 4,
  metadata,
  chunks: chapter4Chunks,
  conversations: chapter4ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "it / you / they",
    subtitle: "Using general and unspecified subjects",
    sections: [
      {
        heading: "it",
        description: "‘It’은 특정 대상을 가리키지 않고 상황을 시작하거나, 근거·느낌·이유·표시된 내용을 말할 때도 써.",
        examples: [
          { id: "ch4-it-1", english: "It looks like it’s going to rain.", korean: "비가 올 것 같아." },
          { id: "ch4-it-2", english: "It seems like he’s tired.", korean: "걔 피곤해 보여." },
          { id: "ch4-it-3", english: "It’s just that I’m tired.", korean: "그냥 내가 피곤해서 그래." },
          { id: "ch4-it-4", english: "It’s not like I hate it.", korean: "그게 싫다는 게 아니야." },
          { id: "ch4-it-5", english: "It says you should keep it in the fridge.", korean: "냉장 보관하라고 쓰여 있어." },
        ],
      },
      {
        heading: "you",
        description: "‘You’는 대화 상대뿐 아니라 ‘일반적으로’, ‘사람이라면 누구나’라는 뜻으로도 자주 써.",
        examples: [
          { id: "ch4-you-1", english: "You never know what will happen.", korean: "무슨 일이 생길지 사람은 절대 몰라." },
          { id: "ch4-you-2", english: "When you’re tired, you make mistakes.", korean: "사람이 피곤하면 실수를 하게 돼." },
          { id: "ch4-you-3", english: "You can’t please everyone.", korean: "모두를 다 만족시킬 수는 없어." },
          { id: "ch4-you-4", english: "You don’t want to argue when you’re angry.", korean: "화났을 땐 말다툼하지 않는 게 좋아." },
        ],
      },
      {
        heading: "they",
        description: "‘They’는 정확한 사람을 특정하지 않거나 소문·뉴스·규칙을 전할 때, 또는 성별을 모르는 한 사람을 말할 때도 써.",
        examples: [
          { id: "ch4-they-1", english: "They won’t let us in without a ticket.", korean: "표 없으면 들여보내 주지 않을 거야." },
          { id: "ch4-they-2", english: "They said the new Thai restaurant down the street is amazing.", korean: "길 아래 새로 생긴 태국 음식점 진짜 좋다고들 하더라." },
          { id: "ch4-they-3", english: "Someone left their umbrella here.", korean: "누가 우산을 두고 갔어." },
          { id: "ch4-they-4", english: "If anyone asks, tell them I’m busy.", korean: "누가 물어보면, 나 바쁘다고 해." },
        ],
      },
    ],
    sourcePages: [75, 76, 77, 78],
  },
};
