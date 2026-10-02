import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(1);
const storySource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.myStoryKorean,
  englishPage: metadata.pages.myStoryEnglish,
  section: "Chapter 1 / 1-1 My Story",
};

export const chapter1Chunks: Chunk[] = [
  {
    id: 1,
    korean: ["넌 왜 영어를 배우고 싶어?", "내 커리어를 위해서 영어를 배우고 싶어.", "영어를 하면 많은 기회가 생기잖아."],
    english: ["Why do you want to learn English?", "I want to learn English for my career.", "It will open many opportunities for me."],
    hint1: ["Why do you…", "I want to…", "It will…"],
    hint2: ["Why do you want to ______ English?", "I want to learn English for my ______.", "It will open many ______ for me."],
    source: storySource,
  },
  {
    id: 2,
    korean: ["여행할 때도 사람들하고 자유롭게 얘기하고 싶고.", "지금은 영어를 쓰는 사람만 만나면 긴장돼서 얼어버려."],
    english: ["I also want to talk to people freely when I travel.", "Right now, whenever I meet English speakers, I get nervous and freeze up."],
    hint1: ["I also want…", "Right now, whenever…"],
    hint2: ["I also want to talk to people ______ when I travel.", "Right now, whenever I meet English speakers, I get ______ and ______ up."],
    source: storySource,
  },
  {
    id: 3,
    korean: ["한국에선 학교에서 영어 수업을 듣긴 하는데, 말하기 연습은 잘 안 해.", "그래서 한국 사람들이 외국인이랑 말하는 걸 무서워하는 것 같아."],
    english: ["We take English classes in school, but we don’t really practice speaking.", "I think that’s why many Koreans are afraid of talking to foreigners."],
    hint1: ["We take…", "I think that’s why…"],
    hint2: ["We take English classes in school, but we don’t really practice ______.", "I think that’s why many Koreans are afraid of talking to ______."],
    source: storySource,
  },
  {
    id: 4,
    korean: ["원래 작년에 영어 수업 들으려고 했는데, 일이 너무 바빠져서 못 했어."],
    english: ["I was going to join an English class last year, but I got too busy with work."],
    hint1: ["I was going to…"],
    hint2: ["I was going to join an English class last year, but I got too ______ with work."],
    source: storySource,
  },
  {
    id: 5,
    korean: ["근데 내 친구가 영어 부트캠프를 시작한다는 거야.", "나중에 어떤 건지 물어보려고."],
    english: ["My friend told me she’s joining an English bootcamp.", "I’m going to ask her about it later."],
    hint1: ["My friend told me…", "I’m going to…"],
    hint2: ["My friend told me she’s ______ an English bootcamp.", "I’m going to ask her about it ______."],
    source: storySource,
  },
  {
    id: 6,
    korean: ["아, 잠깐만!", "그냥 지금 문자해 봐야겠다."],
    english: ["Actually, you know what?", "I’ll just text her now."],
    hint1: ["Actually,…", "I’ll just…"],
    hint2: ["Actually, you know ______?", "I’ll just ______ her now."],
    source: storySource,
  },
];

const conversationSource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.conversationKorean,
  englishPage: metadata.pages.conversationEnglish,
  section: "Chapter 1 / 1-3 Real Conversations",
};

export const chapter1ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "제니야! 그동안 어떻게 지냈어?", english: ["Hey Jennie! How have you been?"], hint1: ["Hey Jennie!…"], hint2: ["Hey Jennie! How have you ______?"], source: conversationSource },
  { id: 2, role: "B", korean: "응, 잘 지냈어. 몇 주 전에 회사를 그만둬서 지금은 쉬고 있어. 새로운 커리어를 찾는 중이야.", english: ["I’ve been pretty good.", "I quit my job a few weeks ago, so I’m taking a break.", "I’m looking for a new career."], hint1: ["I’ve been…", "I quit…", "I’m looking…"], hint2: ["I’ve been pretty ______.", "I quit my job a few weeks ago, so I’m taking a ______.", "I’m looking for a new ______."], source: conversationSource },
  { id: 3, role: "A", korean: "그렇구나. 생각해 둔 게 있어?", english: ["I see.", "Do you have anything in mind?"], hint1: ["I see.", "Do you…"], hint2: ["I ______.", "Do you have anything in ______?"], source: conversationSource },
  { id: 4, role: "B", korean: "영어를 쓸 수 있는 글로벌 회사에서 일하고 싶어. 지금은 영어를 잘 못하지만 조만간 공부를 시작하려고 해.", english: ["I want to work for a global company where I can use English.", "I know I’m not good at English now, but I want to start studying soon."], hint1: ["I want to work…", "I know I’m not…"], hint2: ["I want to work for a global company where I can use ______.", "I know I’m not good at English now, but I want to start ______ soon."], source: conversationSource },
  { id: 5, role: "A", korean: "정말? 난 네가 영어 완전 싫어하는 줄 알았는데.", english: ["Really?", "I thought you hated English."], hint1: ["Really?", "I thought…"], hint2: ["Really?", "I thought you ______ English."], source: conversationSource },
  { id: 6, role: "B", korean: "맞아, 그랬었지. 솔직히 평생 피하려고 했어. 근데 지금은 워킹홀리데이로 호주에 가볼까 생각 중이거든.", english: ["I did.", "I was going to avoid it forever, to be honest.", "But now I’m thinking of going to Australia for a working holiday."], hint1: ["I did.", "I was going…", "But now…"], hint2: ["I did.", "I was going to avoid it ______, to be honest.", "But now I’m thinking of going to Australia for a working ______."], source: conversationSource },
  { id: 7, role: "A", korean: "잠깐만, 내 친구가 영어 부트캠프를 시작하거든! 내일 그 친구 만나는데 너 소개해 줄게.", english: ["Wait, my friend is starting an English boot camp!", "I’m meeting her tomorrow.", "I’ll connect you guys."], hint1: ["Wait,…", "I’m meeting…", "I’ll connect…"], hint2: ["Wait, my friend is ______ an English boot camp!", "I’m meeting her ______.", "I’ll connect you ______."], source: conversationSource },
  { id: 8, role: "B", korean: "정말? 그럼 진짜 좋겠다. 그 부트캠프 꼭 알아볼게.", english: ["Really?", "That would be awesome.", "I’ll definitely check it out."], hint1: ["Really?", "That would…", "I’ll definitely…"], hint2: ["Really?", "That would be ______.", "I’ll definitely check it ______."], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter1Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter1ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 1 — My Story 강의노트.pdf", page: 1, section: "Week 1 / My Story" };
const conversationNotes = { file: "Week 1 — Real Conversations.pdf", page: 1, section: "Week 1 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "왜 직장을 옮기고 싶어?", english: ["Why do you want to change your job?"], hint1: ["Why do you…"], hint2: ["Why do you want to ______ your job?"], source: { ...storyNotes, page: 2 } },
  { id: "output-variation-2", korean: "너랑 뭐 좀 이야기하고 싶어.", english: ["I want to talk to you about something."], hint1: ["I want to…"], hint2: ["I want to talk to you about ______."], source: { ...storyNotes, page: 3 } },
  { id: "output-variation-3", korean: "외국인과 이야기할 때마다, 긴장되고 얼어버려.", english: ["Whenever I talk to foreigners, I get nervous and freeze up."], hint1: ["Whenever I…"], hint2: ["Whenever I talk to foreigners, I get ______ and freeze up."], source: { ...storyNotes, page: 4 } },
  { id: "output-variation-4", korean: "작년에 부트캠프 참여하려고 했는데, 너무 바빴어.", english: ["I was going to join the bootcamp last year, but I was too busy."], hint1: ["I was going to…"], hint2: ["I was going to join the bootcamp last year, but I was too ______."], source: { ...storyNotes, page: 5 } },
  { id: "output-variation-5", korean: "좋은 영어 수업을 찾고 있어.", english: ["I’m looking for a good English class."], hint1: ["I’m looking…"], hint2: ["I’m looking for a good English ______."], source: { ...conversationNotes, page: 2 } },
  { id: "output-variation-6", korean: "코햄 부트캠프에 등록할까 생각 중이야.", english: ["I’m thinking of joining Koham’s English Bootcamp."], hint1: ["I’m thinking…"], hint2: ["I’m thinking of ______ Koham’s English Bootcamp."], source: { ...conversationNotes, page: 6 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 1, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "Do you enjoy your job? Tell us about the positives and negatives of your job.",
  "What was your dream job when you were little?",
  "What kind of job do you think you would be really good at?",
  "If you could try any job for one week, what would it be?",
  "Would you rather work for a big company or have your own business?",
  "What’s the most interesting job someone you know has?",
  "What would you do if you were fluent in English?",
  "What’s something you would like to do abroad?",
  "What do you think you are slightly better at than most people?",
  "What is your top priority in life right now?",
  "If you opened a business, what kind of business would it be?",
].map((english, index) => ({ id: `ch1-question-${index + 1}`, english, ...writingSource, sourcePage: 24, section: "Let’s Have a Talk" }));
const writingTemplates = [
  "I want to learn English because ___",
  "If I become fluent in English, I can ___",
  "To study hard, I am going to ___",
  "I work for ___",
  "I work as a ___",
  "I’ve been working there for ___",
  "In college, I studied ___",
  "In the future, I want to ___",
].map((english, index) => ({ id: `ch1-template-${index + 1}`, english, ...writingSource, sourcePage: 23, section: "Beginner Template" }));

export const chapter1Content: ChapterContent = {
  id: 1,
  metadata,
  chunks: chapter1Chunks,
  conversations: chapter1ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "I will vs I’m going to",
    subtitle: "A decision now vs an existing plan",
    sections: [
      {
        heading: "I will",
        description: "‘will’은 말하는 순간 결심한 일이나 즉흥적으로 하기로 한 것을 말할 때 잘 어울려.",
        examples: [
          { id: "ch1-grammar-will-1", english: "I’ll do it first.", korean: "내가 먼저 할게." },
          { id: "ch1-grammar-will-2", english: "I will take out the trash.", korean: "내가 쓰레기 갖다 버릴게." },
        ],
      },
      {
        heading: "I’m going to",
        description: "‘I’m going to’는 그 전에 이미 정해 둔 계획을 말할 때 어울려.",
        examples: [
          { id: "ch1-grammar-going-1", english: "I’m going to move to Australia next year.", korean: "이미 결정했고, 호주에 가는 게 내 계획임." },
          { id: "ch1-grammar-going-2", english: "I’m going to start studying seriously.", korean: "진지하게 공부하기로 이미 결심했고, 그 계획을 말하는 거지." },
          { id: "ch1-grammar-going-3", english: "I’m going to visit my parents next week.", korean: "다음 주에 부모님 댁에 가기로 일정이 정해져 있음." },
        ],
      },
    ],
    note: "상황에 따라 둘 중 한쪽이 더 자연스러울 수 있지만, 두 표현을 같이 쓸 수 있는 경우도 많아.",
    sourcePages: [11, 12],
  },
};
