import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(12);
const storySource = { file: metadata.sourceFile, koreanPage: metadata.pages.myStoryKorean, englishPage: metadata.pages.myStoryEnglish, section: "Chapter 12 / 12-1 My Story" };

export const chapter12Chunks: Chunk[] = [
  { id: 1, korean: ["작년에 제일 좋았던 기억은 뭐였어?"], english: ["What was your best memory from last year?"], hint1: ["What was…"], hint2: ["What was your best memory from last ______?"], source: storySource },
  { id: 2, korean: ["작년에 가족들이랑 제주도 여행을 갔거든.", "그 전에 몇 년 동안 같이 여행을 못 갔어서 그런지 진짜 특별했어.", "오랜만에 가족끼리 좋은 시간 많이 보냈지."], english: ["Last year, I went on a trip with my family to Jeju-do.", "We hadn’t taken a trip together in years, so it was really special.", "We got to spend a lot of quality time together."], hint1: ["Last year…", "We hadn’t…", "We got…"], hint2: ["Last year, I went on a trip with my family to ______.", "We hadn’t taken a trip together in years, so it was really ______.", "We got to spend a lot of quality time ______."], source: storySource },
  { id: 3, korean: ["하루는 같이 옛날 사진을 보면서 같이 살았던 세월을 돌아봤어.", "다들 울컥했어."], english: ["One night, we went through old pictures and reflected on the years we lived together.", "Everyone got emotional."], hint1: ["One night…", "Everyone…"], hint2: ["One night, we went through old pictures and reflected on the years we lived ______.", "Everyone got ______."], source: storySource },
  { id: 4, korean: ["가족이라도 솔직한 마음을 나누기가 쉽지 않잖아.", "그래서 더 소중한 순간이었어."], english: ["It was such a precious moment because even if you’re family, sometimes it’s hard to share your feelings."], hint1: ["It was…"], hint2: ["It was such a precious moment because even if you’re family, sometimes it’s hard to share your ______."], source: storySource },
  { id: 5, korean: ["여행 전까지는 서로 점점 멀어지는 느낌이었는데, 몇 년 만에 처음으로 다시 가까워진 기분이었어."], english: ["I felt like we had been drifting apart, but for the first time in years, we finally felt close again."], hint1: ["I felt…"], hint2: ["I felt like we had been drifting apart, but for the first time in years, we finally felt close ______."], source: storySource },
  { id: 6, korean: ["시간이 이렇게 빨리 간다는 게 믿기지 않아.", "내일 무슨 일이 일어날지 모르는 거잖아.", "지금 내가 가진 거에 감사하고 사랑하는 사람들이랑 시간을 더 많이 보내야겠다는 생각이 들어."], english: ["It’s crazy to think about how fast time goes by.", "You never know what tomorrow will bring.", "I should be grateful for what I have and spend more time with the people I love."], hint1: ["It’s crazy…", "You never…", "I should…"], hint2: ["It’s crazy to think about how fast time goes ______.", "You never know what tomorrow will ______.", "I should be grateful for what I have and spend more time with the people I ______."], source: storySource },
];

const conversationSource = { file: metadata.sourceFile, koreanPage: metadata.pages.conversationKorean, englishPage: metadata.pages.conversationEnglish, section: "Chapter 12 / 12-3 Real Conversations" };

export const chapter12ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "너 영어 진짜 잘한다! 혹시 외국에서 살았어?", english: ["You speak English really well.", "Did you live abroad?"], hint1: ["You speak…", "Did you…"], hint2: ["You speak English really ______.", "Did you live ______?"], source: conversationSource },
  { id: 2, role: "B", korean: "고마워! 아니, 그냥 한국에서 공부했어. 사실 영어 배운 지 아직 1년밖에 안 됐어.", english: ["Thanks!", "Nope, I just studied here in Korea.", "I’ve only been learning for about a year."], hint1: ["Thanks!", "Nope…", "I’ve only…"], hint2: ["Thanks!", "Nope, I just studied here in ______.", "I’ve only been learning for about a ______."], source: conversationSource },
  { id: 3, role: "A", korean: "진짜? 어떻게 그렇게 빨리 늘었어?", english: ["Seriously?", "How did you improve so fast?"], hint1: ["Seriously?", "How did…"], hint2: ["Seriously?", "How did you improve so ______?"], source: conversationSource },
  { id: 4, role: "B", korean: "처음엔 뭘 해야 할지 몰라서 영어 부트캠프에 등록했어. 3개월 동안 그냥 영어만 했어. 듣고, 말하고, 쓰고 — 계속 쉬지 않고 연습했지.", english: ["At first, I had no idea what to do, so I signed up for an English bootcamp.", "For three months everything I did was in English.", "Listening, speaking, writing—it was nonstop practice."], hint1: ["At first…", "For three…", "Listening…"], hint2: ["At first, I had no idea what to do, so I signed up for an English ______.", "For three months everything I did was in ______.", "Listening, speaking, writing—it was nonstop ______."], source: conversationSource },
  { id: 5, role: "A", korean: "와, 존경스럽다. 엄청 힘들었겠네.", english: ["Wow, I respect that.", "It must’ve been tough."], hint1: ["Wow…", "It must’ve…"], hint2: ["Wow, I respect ______.", "It must’ve been ______."], source: conversationSource },
  { id: 6, role: "B", korean: "응, 힘들었어. 그다음엔 언어교환도 하고, 외국인 친구도 만들었어. 그냥 막 부딪힌 거지.", english: ["Yeah, it was.", "After that, I joined language exchanges and made foreign friends.", "I just put myself out there."], hint1: ["Yeah…", "After that…", "I just…"], hint2: ["Yeah, it ______.", "After that, I joined language exchanges and made foreign ______.", "I just put myself out ______."], source: conversationSource },
  { id: 7, role: "A", korean: "그렇구나. 배울 때 제일 도움이 된 팁 같은 거 있어?", english: ["I see.", "Do you have any tips that really helped you?"], hint1: ["I see.", "Do you…"], hint2: ["I ______.", "Do you have any tips that really helped ______?"], source: conversationSource },
  { id: 8, role: "B", korean: "있지. 진작에 프로그램을 믿고 따라갔으면 좋았을 텐데 아쉬워. 처음엔 100% 노력하지 않았어. 좀 의심했던 것 같아. 뭐든 하기로 했으면 그냥 끝까지 밀고 나가. 최선을 다하기 전까지는 그게 자기한테 맞는지 알 수 없어.", english: ["Yeah, I wish I had trusted the process earlier.", "I didn’t give my 100% in the beginning.", "I think I might’ve been a little skeptical.", "Whatever you decide to do, just stick with it.", "You won’t know if it’ll work for you until you give it your best."], hint1: ["Yeah…", "I didn’t…", "I think…", "Whatever…", "You won’t…"], hint2: ["Yeah, I wish I had trusted the process ______.", "I didn’t give my 100% in the ______.", "I think I might’ve been a little ______.", "Whatever you decide to do, just stick with ______.", "You won’t know if it’ll work for you until you give it your ______."], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter12Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter12ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 12 — My Story.pdf", page: 3, section: "Week 12 / My Story" };
const conversationNotes = { file: "Week 12 — Real Conversations.pdf", page: 3, section: "Week 12 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "부트캠프에선 친구를 많이 사귈 수 있는 기회가 있어.", english: ["I get to make a lot of friends in the bootcamp."], hint1: ["I get…"], hint2: ["I get to make a lot of friends in the ______."], source: storyNotes },
  { id: "output-variation-2", korean: "부트캠프에선 새로운 사람들을 만날 수 있었어.", english: ["I got to meet new people through the bootcamp."], hint1: ["I got…"], hint2: ["I got to meet new people through the ______."], source: storyNotes },
  { id: "output-variation-3", korean: "어제 공부를 많이 할 상황이 안 됐어.", english: ["I didn’t get to study much yesterday."], hint1: ["I didn’t…"], hint2: ["I didn’t get to study much ______."], source: storyNotes },
  { id: "output-variation-4", korean: "드디어 용기를 내서 온라인 튜터링을 시작했어.", english: ["I finally put myself out there and started online tutoring."], hint1: ["I finally…"], hint2: ["I finally put myself out there and started online ______."], source: conversationNotes },
  { id: "output-variation-5", korean: "좀 더 꾸준했으면 좋았을 텐데.", english: ["I wish I had been more consistent."], hint1: ["I wish…"], hint2: ["I wish I had been more ______."], source: { ...conversationNotes, page: 5 } },
  { id: "output-variation-6", korean: "해봐! 해보기 전까지는 모르는 거야.", english: ["Give it a try!", "You never know until you try it."], hint1: ["Give it…", "You never…"], hint2: ["Give it a ______!", "You never know until you try ______."], source: { ...conversationNotes, page: 6 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 12, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "What was your best memory from this year or last year?",
  "What’s one of the most special moments in your life? Tell us about it in detail!",
  "What advice would you give to the next bootcamp students?",
  "Is there anything you want to say to Koham, Ellie, the teachers, or other students?",
  "Is there anything you learned besides English in the bootcamp?",
  "If someone asked you for tips on how to improve their English, what would you tell them?",
  "Tell us about a special moment you had with your family.",
  "Tell us about a special moment you had with a friend.",
  "What’s one important thing you want to remember for the rest of your life?",
  "Have you ever had a turning point in your life? What happened?",
  "What do you think makes life meaningful?",
  "What’s one thing you would do if you weren’t afraid?",
  "Do you think taking risks is necessary in life? Why or why not?",
  "What’s one challenge you want to try in the future?",
  "What advice would you give to someone who is afraid to get out of their comfort zone?",
].map((english, index) => ({ id: `ch12-question-${index + 1}`, english, ...writingSource, sourcePage: index < 2 ? 246 : 248, section: index < 2 ? "What About You?" : "Let’s Have a Talk" }));
const writingTemplates = [
  "Last year, my best memory was ___",
  "I got to ___",
  "It was such a precious memory because ___",
  "My favorite part was when I ___",
  "When I reflect on this year, I feel ___",
  "I’m grateful for ___",
  "Next year, I want to ___",
  "My hope is to ___",
  "I believe the best way to do this is to ___",
].map((english, index) => ({ id: `ch12-template-${index + 1}`, english, ...writingSource, sourcePage: 247, section: "Beginner Template" }));

export const chapter12Content: ChapterContent = {
  id: 12,
  metadata,
  chunks: chapter12Chunks,
  conversations: chapter12ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "had + past participle and I wish",
    subtitle: "Earlier past events and wishes",
    sections: [
      { heading: "had + past participle", description: "과거의 한 시점보다 더 전에 이미 일어난 일을 나타내.", examples: [
        { id: "ch12-had-1", english: "When I arrived, the movie had started.", korean: "내가 도착했을 때, 그보다도 전에 영화가 시작해 있었어." },
        { id: "ch12-had-2", english: "We hadn’t taken a trip together in years, so it was really special.", korean: "몇 년 동안 같이 여행을 못 갔어서 정말 특별했어." },
        { id: "ch12-had-3", english: "I felt like we had been drifting apart, but we finally felt close again.", korean: "서로 멀어지고 있었던 것 같았지만 마침내 다시 가까워졌어." },
      ] },
      { heading: "I wish + past", description: "바꿀 수 없는 현재 상황에 대한 아쉬움과 후회를 나타내.", examples: [
        { id: "ch12-wish-1", english: "I wish I could speak English fluently.", korean: "영어를 유창하게 말할 수 있으면 좋을 텐데." },
        { id: "ch12-wish-2", english: "I wish my mom was here.", korean: "엄마가 여기 있으면 좋을 텐데." },
        { id: "ch12-wish-3", english: "I wish I had more time.", korean: "시간이 더 많으면 좋을 텐데." },
      ] },
      { heading: "I wish I had + past participle", description: "이미 지나간 과거에 대한 아쉬움과 후회를 나타내.", examples: [
        { id: "ch12-wish-had-1", english: "I wish my mom had been there.", korean: "엄마가 거기 있었으면 좋았을 텐데." },
        { id: "ch12-wish-had-2", english: "I wish I’d had more time.", korean: "시간이 더 많았었으면 좋았을 텐데." },
        { id: "ch12-wish-had-3", english: "I wish I’d known about the bootcamp earlier.", korean: "부트캠프를 더 일찍 알았더라면 좋았을 텐데." },
      ] },
    ],
    sourcePages: [237, 238],
  },
};
