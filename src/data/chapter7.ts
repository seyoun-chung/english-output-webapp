import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(7);
const storySource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.myStoryKorean,
  englishPage: metadata.pages.myStoryEnglish,
  section: "Chapter 7 / 7-1 My Story",
};

export const chapter7Chunks: Chunk[] = [
  {
    id: 1,
    korean: ["한국에서 연애하는 건 어때?", "서양 국가랑은 좀 달라."],
    english: ["What’s dating like in Korea?", "It’s a bit different from western countries."],
    hint1: ["What’s dating…", "It’s a bit…"],
    hint2: ["What’s dating like in ______?", "It’s a bit different from western ______."],
    source: storySource,
  },
  {
    id: 2,
    korean: ["미국은 클럽이나 술집에서 그냥 즉흥적으로 만나는 경우가 많잖아.", "근데 한국에서는 많은 사람들이 지인이 마련해 준 소개팅으로 연인을 만나."],
    english: ["I know in the US, it’s common to meet people spontaneously, like at a club or a bar.", "But in Korea, a lot of people find their partners through blind dates that are set up by friends."],
    hint1: ["I know in…", "But in Korea…"],
    hint2: ["I know in the US, it’s common to meet people spontaneously, like at a club or a ______.", "But in Korea, a lot of people find their partners through blind dates that are set up by ______."],
    source: storySource,
  },
  {
    id: 3,
    korean: ["믿을 만한 사람을 통해서 만나는 게 더 편한 거지.", "그러고 나서는 진행이 되게 빨라."],
    english: ["I think Koreans feel more comfortable meeting people through someone they trust.", "After that, things move really quickly."],
    hint1: ["I think Koreans…", "After that…"],
    hint2: ["I think Koreans feel more comfortable meeting people through someone they ______.", "After that, things move really ______."],
    source: storySource,
  },
  {
    id: 4,
    korean: ["보통 세 번째 데이트까지는 서로 사귈 건지, 아니면 그만 만날 건지 정해."],
    english: ["They usually decide by the third date if they’re going to be boyfriend and girlfriend, or if they’re going to break up."],
    hint1: ["They usually…"],
    hint2: ["They usually decide by the third date if they’re going to be boyfriend and girlfriend, or if they’re going to break ______."],
    source: storySource,
  },
  {
    id: 5,
    korean: ["솔직히 난 어떻게 그렇게 빨리 결정할 수 있는지 모르겠어.", "왜 이런 식으로 만나는 걸 선호하는지 이해는 돼."],
    english: ["Personally, I don’t know how they can decide so quickly.", "I understand why some people like it that way, though."],
    hint1: ["Personally, I don’t…", "I understand why…"],
    hint2: ["Personally, I don’t know how they can decide so ______.", "I understand why some people like it that way, ______."],
    source: storySource,
  },
  {
    id: 6,
    korean: ["시간 낭비하기 싫은 거지.", "외국 사람들은 우리 연애 문화 보면 어떻게 생각할지 좀 궁금하네."],
    english: ["They don’t want to waste time.", "I wonder what people outside of Korea think of our dating culture."],
    hint1: ["They don’t…", "I wonder what…"],
    hint2: ["They don’t want to waste ______.", "I wonder what people outside of Korea think of our dating ______."],
    source: storySource,
  },
];

const conversationSource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.conversationKorean,
  englishPage: metadata.pages.conversationEnglish,
  section: "Chapter 7 / 7-3 Real Conversations",
};

export const chapter7ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "예린아! 어제 데이트 어땠어?", english: ["Yerin! How was your date last night?"], hint1: ["Yerin! How…"], hint2: ["Yerin! How was your date last ______?"], source: conversationSource },
  { id: 2, role: "B", korean: "음… 대부분 괜찮았는데, 끝에 가서 분위기가 좀 어색해졌어.", english: ["Umm… it was mostly good, but it got a little awkward at the end."], hint1: ["Umm… it was…"], hint2: ["Umm… it was mostly good, but it got a little awkward at the ______."], source: conversationSource },
  { id: 3, role: "A", korean: "왜?", english: ["How come?"], hint1: ["How…"], hint2: ["How ______?"], source: conversationSource },
  { id: 4, role: "B", korean: "그게, 결혼 관련해서 완전 개인적인 질문을 하기 시작하는 거야. 고작 두 번째 데이트였는데. 너무 이상했어.", english: ["Well, he started asking really personal questions about marriage.", "It was only our second date!", "It was weird."], hint1: ["Well, he started…", "It was only…", "It was weird…"], hint2: ["Well, he started asking really personal questions about ______.", "It was only our second ______!", "It was ______."], source: conversationSource },
  { id: 5, role: "A", korean: "헐 대박, 진짜? 뭐라고 물어봤는데?", english: ["Oh my God, no way!", "What did he ask?"], hint1: ["Oh my God…", "What did…"], hint2: ["Oh my God, no ______!", "What did he ______?"], source: conversationSource },
  { id: 6, role: "B", korean: "애는 몇 명 낳고 싶은지, 결혼해도 계속 일할 건지, 심지어 얼마나 모았는지까지 물어봤어!", english: ["He asked how many kids I wanted, if I still wanted to work after marriage, and even how much money I saved!"], hint1: ["He asked how…"], hint2: ["He asked how many kids I wanted, if I still wanted to work after marriage, and even how much money I ______!"], source: conversationSource },
  { id: 7, role: "A", korean: "뭐야 그게? 그건 너무 사적이잖아.", english: ["What the heck?", "That’s so personal."], hint1: ["What the…", "That’s so…"], hint2: ["What the ______?", "That’s so ______."], source: conversationSource },
  { id: 8, role: "B", korean: "심지어 동물도 싫어한다는 거야. 내 강아지들이랑 잘 못 지내는 사람이랑 만날 수 있을까 싶네.", english: ["On top of that, he hates animals!", "I’m not sure if I can be with someone who can’t get along with my dogs."], hint1: ["On top…", "I’m not sure…"], hint2: ["On top of that, he hates ______!", "I’m not sure if I can be with someone who can’t get along with my ______."], source: conversationSource },
  { id: 9, role: "A", korean: "아… 완전 촉 온다. 됐어, 걔는 잊어버려. 내가 귀여운 우리 회사 동료 소개해 줄게. Cody 기억나지?", english: ["Ugh… that’s a huge red flag.", "Okay, forget him.", "I’ll set you up with my cute coworker.", "Remember Cody?"], hint1: ["Ugh… that’s…", "Okay, forget…", "I’ll set…", "Remember Cody…"], hint2: ["Ugh… that’s a huge red ______.", "Okay, forget ______.", "I’ll set you up with my cute ______.", "Remember ______?"], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter7Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter7ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 7 — My Story.pdf", page: 1, section: "Week 7 / My Story" };
const conversationNotes = { file: "Week 7 — Real Conversations.pdf", page: 1, section: "Week 7 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "너 남친은 어떤 사람이야?", english: ["What’s your boyfriend like?"], hint1: ["What’s your…"], hint2: ["What’s your boyfriend ______?"], source: storyNotes },
  { id: "output-variation-2", korean: "한국은 호주와 아주 달라.", english: ["Korea is very different from Australia."], hint1: ["Korea is…"], hint2: ["Korea is very different from ______."], source: storyNotes },
  { id: "output-variation-3", korean: "핸드폰에 시간을 낭비하고 싶지 않아.", english: ["I don’t want to waste time on my phone."], hint1: ["I don’t…"], hint2: ["I don’t want to waste time on my ______."], source: { ...storyNotes, page: 4 } },
  { id: "output-variation-4", korean: "왜 집에 있어?", english: ["How come you’re home?"], hint1: ["How come…"], hint2: ["How come you’re ______?"], source: conversationNotes },
  { id: "output-variation-5", korean: "오는 길에 길을 잃었어. 게다가 핸드폰도 꺼졌어.", english: ["I got lost on the way.", "On top of that, my phone died."], hint1: ["I got…", "On top…"], hint2: ["I got lost on the ______.", "On top of that, my phone ______."], source: { ...conversationNotes, page: 6 } },
  { id: "output-variation-6", korean: "내가 문을 잠갔는지 잘 모르겠어.", english: ["I’m not sure if I locked the door."], hint1: ["I’m not…"], hint2: ["I’m not sure if I locked the ______."], source: { ...conversationNotes, page: 7 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 7, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "Think back to the best date you ever went on. Where did you go and who were you with? Tell us all the details. Now think about the worst date you ever went on. Tell us about that too!",
  "Are you in a relationship? How did you meet?",
  "What do you like most about them?",
  "Tell me about your last relationship. What did you learn from it?",
  "Are you more attracted to someone who’s opposite from you, or someone who’s similar to you?",
  "What’s your ideal type?",
  "What would your perfect date look like?",
  "Which celebrity couple do you admire (or dislike)?",
  "Have you ever fallen in love at first sight? What was it like?",
  "How do you know when someone is “the one?”",
  "What are some green flags in a relationship?",
  "What are some red flags in a relationship?",
  "Do you think couples should live together before getting married?",
].map((english, index) => ({ id: `ch7-question-${index + 1}`, english, ...writingSource, sourcePage: index === 0 ? 152 : 154, section: index === 0 ? "What About You?" : "Let’s Have a Talk" }));
const writingTemplates = [
  "I went on a date with ___",
  "I met her/him through ___",
  "She/He was ___",
  "We went to ___ and ate ___",
  "It was really ___",
  "We talked about ___",
  "It was great/terrible because ___",
  "I like/didn’t like how she/he ___",
  "I felt (like) ___",
].map((english, index) => ({ id: `ch7-template-${index + 1}`, english, ...writingSource, sourcePage: 153, section: "Beginner Template" }));

export const chapter7Content: ChapterContent = {
  id: 7,
  metadata,
  chunks: chapter7Chunks,
  conversations: chapter7ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "I don’t know what this is.",
    subtitle: "Indirect questions and asking why",
    sections: [
      { heading: "I don’t know", description: "모르거나 이해하지 못한 내용을 간접 질문 형태로 말해.", examples: [
        { id: "ch7-dont-know-1", english: "I don’t know what I’m doing.", korean: "내가 뭘 하고 있는지 모르겠어." },
        { id: "ch7-dont-know-2", english: "I don’t know what you’re talking about.", korean: "네가 무슨 말을 하는지 모르겠어." },
        { id: "ch7-dont-know-3", english: "I don’t know what that means.", korean: "그게 무슨 뜻인지 모르겠어." },
      ] },
      { heading: "I’m not sure", description: "확실하지 않은 장소·판단·가능성을 조심스럽게 말해.", examples: [
        { id: "ch7-not-sure-1", english: "I’m not sure where we are.", korean: "우리가 어디 있는지 잘 모르겠어." },
        { id: "ch7-not-sure-2", english: "I’m not sure if it’s a good idea.", korean: "그게 좋은 생각인지 잘 모르겠어." },
        { id: "ch7-not-sure-3", english: "I’m not sure if I can do that.", korean: "내가 그걸 할 수 있을지 잘 모르겠어." },
      ] },
      { heading: "I wonder", description: "궁금한 내용을 직접 묻기보다 혼잣말처럼 표현해.", examples: [
        { id: "ch7-wonder-1", english: "I wonder how much it costs.", korean: "그게 얼마인지 궁금해." },
        { id: "ch7-wonder-2", english: "I wonder if it’s going to rain tomorrow.", korean: "내일 비가 올지 궁금해." },
        { id: "ch7-wonder-3", english: "I wonder who is coming to the party.", korean: "파티에 누가 오는지 궁금해." },
      ] },
      { heading: "How come", description: "이유를 편하게 물을 때 사용해.", examples: [
        { id: "ch7-how-come-1", english: "How come you didn’t call me?", korean: "왜 나한테 전화 안 했어?" },
        { id: "ch7-how-come-2", english: "How come you’re so quiet today?", korean: "오늘 왜 이렇게 조용해?" },
        { id: "ch7-how-come-3", english: "How come your bag is so heavy?", korean: "네 가방은 왜 이렇게 무거워?" },
      ] },
    ],
    sourcePages: [145, 146],
  },
};
