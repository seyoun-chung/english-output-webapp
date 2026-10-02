import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(9);
const storySource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.myStoryKorean,
  englishPage: metadata.pages.myStoryEnglish,
  section: "Chapter 9 / 9-1 My Story",
};

export const chapter9Chunks: Chunk[] = [
  { id: 1, korean: ["네가 제일 자주 먹는 한국 음식이 뭐야?", "하나만 고르기는 힘든데, 그래도 고르자면 김치찌개."], english: ["What’s your go-to Korean dish?", "It’s hard to choose just one, but I think I would go with kimchi jjigae."], hint1: ["What’s your…", "It’s hard…"], hint2: ["What’s your go-to Korean ______?", "It’s hard to choose just one, but I think I would go with ______."], source: storySource },
  { id: 2, korean: ["뜨겁고 감칠맛 나는 찌개인데, 그 특유의 냄새가 있어.", "멀리서도 누가 김치찌개 끓이면 바로 알 수 있지."], english: ["It’s a hot and savory stew that has a distinct smell.", "You can tell someone is cooking jjigae from miles away."], hint1: ["It’s a hot…", "You can tell…"], hint2: ["It’s a hot and savory stew that has a distinct ______.", "You can tell someone is cooking jjigae from miles ______."], source: storySource },
  { id: 3, korean: ["진짜 좋은 점은 요리하기 쉽다는 거야.", "김치가 맛있기만 하면 웬만하면 다 맛있게 돼."], english: ["The great thing is that it’s easy to make.", "As long as you have good kimchi, it usually turns out great."], hint1: ["The great thing…", "As long as…"], hint2: ["The great thing is that it’s easy to ______.", "As long as you have good kimchi, it usually turns out ______."], source: storySource },
  { id: 4, korean: ["식당에서 먹으면 보통 뚝배기라고 불리는 돌솥에 끓여주는데, 그거 덕분에 끝까지 뜨겁게 먹을 수 있어."], english: ["When you eat it at a restaurant, they usually cook it in a stone bowl called a ttukbaegi, which keeps it hot until the last bite."], hint1: ["When you eat…"], hint2: ["When you eat it at a restaurant, they usually cook it in a stone bowl called a ttukbaegi, which keeps it hot until the last ______."], source: storySource },
  { id: 5, korean: ["내가 제일 좋아하는 식당 ‘소도적’이라고 있는데, 거긴 김치찌개가 7,000원밖에 안 해.", "한 5달러 정도지."], english: ["My favorite restaurant, Sodojeok, sells kimchi jjigae for only 7,000 won, which is like 5 dollars."], hint1: ["My favorite restaurant…"], hint2: ["My favorite restaurant, Sodojeok, sells kimchi jjigae for only 7,000 won, which is like ______ dollars."], source: storySource },
  { id: 6, korean: ["우리 엄마가 나 어릴 때 김치찌개를 항상 해 주셔서 그런지 냄새를 맡을 때마다 어린 시절이 떠올라.", "일주일에 한 번은 꼭 먹고 싶더라."], english: ["My mom used to make it all the time when I was little, so the smell always reminds me of my childhood.", "I crave it at least once a week."], hint1: ["My mom used…", "I crave…"], hint2: ["My mom used to make it all the time when I was little, so the smell always reminds me of my ______.", "I crave it at least once a ______."], source: storySource },
];

const conversationSource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.conversationKorean,
  englishPage: metadata.pages.conversationEnglish,
  section: "Chapter 9 / 9-3 Real Conversations",
};

export const chapter9ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "뭐 먹고 싶어?", english: ["What do you feel like eating?"], hint1: ["What do you…"], hint2: ["What do you feel like ______?"], source: conversationSource },
  { id: 2, role: "B", korean: "근처에 예전에 퇴근하고 자주 갔던 삼겹살 집 있는데, 거기 계란찜이 진짜 맛있어. 가볼래?", english: ["There’s a really good samgyeopsal place nearby where I used to go after work.", "They have the best gyeranjjim.", "Do you want to try it?"], hint1: ["There’s a really…", "They have…", "Do you want…"], hint2: ["There’s a really good samgyeopsal place nearby where I used to go after ______.", "They have the best ______.", "Do you want to try ______?"], source: conversationSource },
  { id: 3, role: "A", korean: "좋지. 거기 가자.", english: ["That sounds great.", "Let’s do it."], hint1: ["That sounds…", "Let’s…"], hint2: ["That sounds ______.", "Let’s do ______."], source: conversationSource },
  { id: 4, role: "B", korean: "일단 삼겹살 2인분이랑 계란찜 시킬까?", english: ["How about we start with two samgyeopsal and a gyeranjjim?"], hint1: ["How about…"], hint2: ["How about we start with two samgyeopsal and a ______?"], source: conversationSource },
  { id: 5, role: "A", korean: "좋아. 순두부찌개도 맛있어 보이네.", english: ["Sure.", "The sundubu jjigae looks really good, too."], hint1: ["Sure.", "The sundubu…"], hint2: ["Sure.", "The sundubu jjigae looks really good, ______."], source: conversationSource },
  { id: 6, role: "B", korean: "그것도 괜찮지. 근데 조금 매운데, 매운 거 괜찮아?", english: ["We can do that.", "It’s a bit spicy, though.", "Can you handle spicy food?"], hint1: ["We can…", "It’s a bit…", "Can you…"], hint2: ["We can do ______.", "It’s a bit spicy, ______.", "Can you handle spicy ______?"], source: conversationSource },
  { id: 7, role: "A", korean: "예전엔 못 먹었는데, 요즘에 점점 좋아지기 시작했어.", english: ["I used to not, but it’s growing on me."], hint1: ["I used to…"], hint2: ["I used to not, but it’s growing on ______."], source: conversationSource },
  { id: 8, role: "B", korean: "저기요, 주문할게요. 삼겹살 2인분, 계란찜 하나, 순두부찌개 하나 할게요.", english: ["Excuse me, I think we’re ready to order.", "We’ll get two samgyeopsal, one gyeranjjim, and one sundubu jjigae."], hint1: ["Excuse me…", "We’ll get…"], hint2: ["Excuse me, I think we’re ready to ______.", "We’ll get two samgyeopsal, one gyeranjjim, and one sundubu ______."], source: conversationSource },
  { id: 9, role: "B", korean: "마실 건 뭘로 드릴까요?", english: ["Anything to drink?"], hint1: ["Anything…"], hint2: ["Anything to ______?"], source: conversationSource },
  { id: 10, role: "B", korean: "일단은 그냥 물 주세요. 감사합니다.", english: ["Just waters for now, thank you."], hint1: ["Just waters…"], hint2: ["Just waters for ______, thank you."], source: conversationSource },
  { id: 11, role: "A", korean: "와, 계란찜 생각했던 것보다 훨씬 맛있다!", english: ["Wow.", "The gyeranjjim is even better than I thought!"], hint1: ["Wow.", "The gyeranjjim…"], hint2: ["Wow.", "The gyeranjjim is even better than I ______!"], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter9Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter9ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 9 — My Story.pdf", page: 1, section: "Week 9 / My Story" };
const conversationNotes = { file: "Week 9 — Real Conversations.pdf", page: 1, section: "Week 9 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "너 노래방 18번이 뭐야?", english: ["What’s your go-to karaoke song?"], hint1: ["What’s your…"], hint2: ["What’s your go-to karaoke ______?"], source: storyNotes },
  { id: "output-variation-2", korean: "나라면 검은색으로 할래.", english: ["I would go with the black one."], hint1: ["I would…"], hint2: ["I would go with the black ______."], source: { ...storyNotes, page: 2 } },
  { id: "output-variation-3", korean: "정말 좋은 점은 저렴하다는 거야.", english: ["The great thing is that it’s affordable."], hint1: ["The great…"], hint2: ["The great thing is that it’s ______."], source: { ...storyNotes, page: 3 } },
  { id: "output-variation-4", korean: "우리가 서로를 지지해준다면, 우린 부트캠프를 끝낼 거야.", english: ["As long as we support each other, we’re going to finish the bootcamp."], hint1: ["As long as…"], hint2: ["As long as we support each other, we’re going to finish the ______."], source: { ...storyNotes, page: 4 } },
  { id: "output-variation-5", korean: "뭐 보고 싶어?", english: ["What do you feel like watching?"], hint1: ["What do you…"], hint2: ["What do you feel like ______?"], source: conversationNotes },
  { id: "output-variation-6", korean: "순두부찌개 생각한 거보다 맵네.", english: ["It’s spicier than I thought."], hint1: ["It’s spicier…"], hint2: ["It’s spicier than I ______."], source: { ...conversationNotes, page: 6 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 9, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "Tell us about your favorite foods or restaurants. What does it taste like? What is the restaurant like? How did you discover it? Make sure to be as descriptive as possible!",
  "What’s your favorite food of all time?",
  "What was your favorite food as a kid?",
  "What’s the strangest (or most unusual) food you’ve ever eaten?",
  "What’s a food that most people love but you hate?",
  "What’s a food that most people hate but you love?",
  "What’s the most expensive meal you’ve ever paid for?",
  "What are some of your favorite snacks?",
  "What’s a food you didn’t like before, but enjoy now?",
  "Do you prefer cooking at home or eating out?",
  "What’s your comfort food when you feel tired or sad?",
  "Do you prefer coffee, tea, or other drinks?",
  "What’s your go-to drink at a cafe?",
  "If you opened your own restaurant or cafe, what would you serve?",
  "Do you enjoy spicy food? What’s the spiciest thing you’ve eaten?",
].map((english, index) => ({ id: `ch9-question-${index + 1}`, english, ...writingSource, sourcePage: index === 0 ? 189 : 191, section: index === 0 ? "What About You?" : "Let’s Have a Talk" }));
const writingTemplates = [
  "My favorite food is ___",
  "When I want to eat it, my go-to restaurant is ___",
  "I go there at least once a ___",
  "It’s ___ and ___",
  "The great thing about ___ is ___",
  "Another restaurant I really want to try is ___",
].map((english, index) => ({ id: `ch9-template-${index + 1}`, english, ...writingSource, sourcePage: 190, section: "Beginner Template" }));

export const chapter9Content: ChapterContent = {
  id: 9,
  metadata,
  chunks: chapter9Chunks,
  conversations: chapter9ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "that, which…",
    subtitle: "Describing people, times, places, and things",
    sections: [
      { heading: "that", description: "어떤 대상이나 사실을 더 자세히 설명할 때 사용해.", examples: [
        { id: "ch9-that-1", english: "It’s a hot and savory stew that has a distinct smell.", korean: "뜨겁고 감칠맛 나는 찌개인데, 그 특유의 냄새가 있어." },
        { id: "ch9-that-2", english: "He’s the guy that I was talking about.", korean: "이 남자가 내가 말한 남자야." },
        { id: "ch9-that-3", english: "The great thing is that it’s easy to make.", korean: "진짜 좋은 점은 요리하기 쉽다는 거야." },
      ] },
      { heading: "who / when / where", description: "사람은 who, 시간은 when, 장소는 where로 더 자세히 설명할 수 있어.", examples: [
        { id: "ch9-who-1", english: "He’s the guy who helped me.", korean: "이 남자가 날 도와줬던 그 사람이야." },
        { id: "ch9-when-1", english: "There was a moment when I almost gave up.", korean: "내가 거의 포기할 뻔했던 순간이 있었어." },
        { id: "ch9-where-1", english: "There’s a really good samgyeopsal place where I used to go after work.", korean: "예전에 일 끝나고 자주 가던 진짜 맛있는 삼겹살 집이 근처에 있어." },
      ] },
      { heading: "which", description: "앞 문장에 덧붙이는 정보를 설명할 때 사용해.", examples: [
        { id: "ch9-which-1", english: "They usually cook it in a stone bowl, which keeps it hot until the last bite.", korean: "보통 돌솥에 끓여주는데, 거기에 먹으면 끝까지 뜨거워." },
        { id: "ch9-which-2", english: "She didn’t show up, which was disappointing.", korean: "걔 안 왔어. 그건 실망스럽더라." },
        { id: "ch9-which-3", english: "I ordered the pasta, which was quite spicy.", korean: "파스타를 주문했어. 그거 꽤 매웠어." },
      ] },
    ],
    sourcePages: [181, 182],
  },
};
