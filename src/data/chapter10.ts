import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(10);
const storySource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.myStoryKorean,
  englishPage: metadata.pages.myStoryEnglish,
  section: "Chapter 10 / 10-1 My Story",
};

export const chapter10Chunks: Chunk[] = [
  { id: 1, korean: ["마지막으로 여행 간 게 언제야? 어땠어?", "절친이랑 교토에 갔었는데 진짜 잊을 수 없는 여행이었어."], english: ["When was the last time you traveled?", "How was it?", "I went to Kyoto with my best friend and it was unforgettable."], hint1: ["When was…", "How was…", "I went…"], hint2: ["When was the last time you ______?", "How was ______?", "I went to Kyoto with my best friend and it was ______."], source: storySource },
  { id: 2, korean: ["도착했을 때 배가 너무 고파서 그냥 아무 라멘집에 들어갔거든?", "근데 살면서 먹어 본 라멘 중에 제일 맛있었어."], english: ["We were starving when we arrived, so we just went to a random ramen place.", "It turned out to be the best ramen I’ve ever had in my life."], hint1: ["We were…", "It turned out…"], hint2: ["We were starving when we arrived, so we just went to a random ramen ______.", "It turned out to be the best ramen I’ve ever had in my ______."], source: storySource },
  { id: 3, korean: ["그 유명한 오래된 거리 알지? 전통 목조 건물이 쭉 늘어선 데.", "니넨자카라고 하는데 진짜 예뻤어."], english: ["You know the famous old street lined with traditional wooden houses?", "It’s called Ninenzaka.", "It was beautiful."], hint1: ["You know…", "It’s called…", "It was…"], hint2: ["You know the famous old street lined with traditional wooden ______?", "It’s called ______.", "It was ______."], source: storySource },
  { id: 4, korean: ["거기 둘러보다가 맛차 찻집을 발견했는데, 거기서 친구들 선물 사느라 100달러 넘게 써 버렸어."], english: ["While looking around there, we came across a matcha tea house.", "I ended up spending over a hundred dollars on gifts for my friends."], hint1: ["While looking…", "I ended up…"], hint2: ["While looking around there, we came across a matcha tea ______.", "I ended up spending over a hundred dollars on gifts for my ______."], source: storySource },
  { id: 5, korean: ["우리 둘 다 교토가 이렇게 재밌을 거라고 기대 안 했는데, 이젠 일본에서 제일 좋아하는 도시야."], english: ["Neither of us expected Kyoto to be this fun, but now it’s our favorite place in Japan."], hint1: ["Neither of us…"], hint2: ["Neither of us expected Kyoto to be this fun, but now it’s our favorite place in ______."], source: storySource },
  { id: 6, korean: ["아직 안 가봤으면 꼭 가보라고 추천해!"], english: ["If you’ve never been to the city, I highly recommend it!"], hint1: ["If you’ve…"], hint2: ["If you’ve never been to the city, I highly recommend ______!"], source: storySource },
];

const conversationSource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.conversationKorean,
  englishPage: metadata.pages.conversationEnglish,
  section: "Chapter 10 / 10-3 Real Conversations",
};

export const chapter10ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "태국에 가본 적 있어?", english: ["Have you ever been to Thailand?"], hint1: ["Have you…"], hint2: ["Have you ever been to ______?"], source: conversationSource },
  { id: 2, role: "B", korean: "아니, 근데 언젠가 꼭 가보고 싶어. 넌 가 봤어?", english: ["No, but I really want to one day.", "Have you?"], hint1: ["No, but…", "Have you?"], hint2: ["No, but I really want to one ______.", "Have you?"], source: conversationSource },
  { id: 3, role: "A", korean: "응, 작년 추석 때 방콕 갔었어. 진짜 대박이었어. 내가 여행한 나라 중에 제일 좋아하는 곳이야.", english: ["Yeah, I went to Bangkok during Chuseok last year.", "It was incredible.", "It’s my favorite country that I’ve traveled to."], hint1: ["Yeah, I went…", "It was…", "It’s my…"], hint2: ["Yeah, I went to Bangkok during Chuseok last ______.", "It was ______.", "It’s my favorite country that I’ve traveled ______."], source: conversationSource },
  { id: 4, role: "B", korean: "진짜? 뭐가 제일 좋았어?", english: ["Really?", "What did you like most about it?"], hint1: ["Really?", "What did…"], hint2: ["Really?", "What did you like most about ______?"], source: conversationSource },
  { id: 5, role: "A", korean: "너무 많아서 하나만 고르기 힘든데. 사람들이 엄청 친절했고, 음식도 진짜 맛있고, 이동하는 것도 편했어.", english: ["So many things.", "It’s hard to choose just one.", "The people were so friendly, the food was amazing, and getting around was easy."], hint1: ["So many…", "It’s hard…", "The people…"], hint2: ["So many ______.", "It’s hard to choose just ______.", "The people were so friendly, the food was amazing, and getting around was ______."], source: conversationSource },
  { id: 6, role: "B", korean: "거기 유명한 수상시장 있다던데. 거기도 갔어?", english: ["I heard there’s a famous floating market there.", "Did you go there too?"], hint1: ["I heard…", "Did you…"], hint2: ["I heard there’s a famous floating market ______.", "Did you go there ______?"], source: conversationSource },
  { id: 7, role: "A", korean: "갔지. 시장 진짜 재밌었어. 음식만 파는 게 아니라 옷, 가방, 기념품 같은 것도 팔더라. 나도 배 타고 가는 와중에 핸드메이드 라탄 가방 하나 샀어!", english: ["I did.", "The market was so fun.", "They not only sell food, but also other things like clothes, bags, and souvenirs.", "I got a handmade rattan bag while floating on a boat!"], hint1: ["I did.", "The market…", "They not only…", "I got…"], hint2: ["I did.", "The market was so ______.", "They not only sell food, but also other things like clothes, bags, and ______.", "I got a handmade rattan bag while floating on a ______!"], source: conversationSource },
  { id: 8, role: "B", korean: "완전 재밌겠다. 나도 빨리 다시 여행 가고 싶다.", english: ["That’s so cool.", "I’m really looking forward to traveling again."], hint1: ["That’s so…", "I’m really…"], hint2: ["That’s so ______.", "I’m really looking forward to traveling ______."], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter10Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter10ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 10 — My Story.pdf", page: 1, section: "Week 10 / My Story" };
const conversationNotes = { file: "Week 10 — Real Conversations.pdf", page: 1, section: "Week 10 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "코햄이랑 마지막으로 연락한 게 언제야?", english: ["When was the last time you talked to Koham?"], hint1: ["When was…"], hint2: ["When was the last time you talked to ______?"], source: storyNotes },
  { id: "output-variation-2", korean: "이게 내가 먹어본 떡볶이 중에 최고야.", english: ["This is the best tteokbokki I’ve ever had in my life."], hint1: ["This is…"], hint2: ["This is the best tteokbokki I’ve ever had in my ______."], source: { ...storyNotes, page: 2 } },
  { id: "output-variation-3", korean: "오는 길에 귀여운 카페를 하나 마주쳤어.", english: ["I came across a cute cafe on the way here."], hint1: ["I came…"], hint2: ["I came across a cute cafe on the way ______."], source: { ...storyNotes, page: 4 } },
  { id: "output-variation-4", korean: "하이디라오 먹어본 적 있어?", english: ["Have you tried Haidilao?"], hint1: ["Have you…"], hint2: ["Have you tried ______?"], source: conversationNotes },
  { id: "output-variation-5", korean: "방콕은 맛있는 음식만 있는 게 아니라 사람들도 정말 친절해.", english: ["Bangkok not only has great food, but also friendly people."], hint1: ["Bangkok not…"], hint2: ["Bangkok not only has great food, but also friendly ______."], source: { ...conversationNotes, page: 4 } },
  { id: "output-variation-6", korean: "내 홍콩 여행 너무 기대돼.", english: ["I’m looking forward to my Hong Kong trip."], hint1: ["I’m looking…"], hint2: ["I’m looking forward to my Hong Kong ______."], source: { ...conversationNotes, page: 7 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 10, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "What is the best country you’ve ever traveled to? Be detailed about what you saw, ate, and did there.",
  "When was the last time you traveled? Where did you go?",
  "Where are you planning on traveling to next? If you don’t have plans, where do you want to go?",
  "Have you ever experienced culture shock while traveling?",
  "What are the top three destinations on your travel bucket list?",
  "Which is better: well-planned travel or spontaneous travel?",
  "Do you prefer to travel alone, with friends, or with family?",
  "What destination do you think is overrated and why?",
  "When you travel, do you seek out Korean food or do you prefer eating local food?",
  "When you travel, what kind of accommodation do you prefer: hotel, Airbnb, or hostel? Why?",
  "Tell me about a time you made new friends while traveling.",
  "What country has the kindest and happiest people? Why do you think that is?",
].map((english, index) => ({ id: `ch10-question-${index + 1}`, english, ...writingSource, sourcePage: index === 0 ? 208 : 210, section: index === 0 ? "What About You?" : "Let’s Have a Talk" }));
const writingTemplates = [
  "My favorite country that I’ve traveled to is ___",
  "It’s known for ___",
  "When I went there, I came across a/an ___",
  "The best thing I ate there was ___",
  "If you go there, I highly recommend ___",
  "Another country that I really want to go to one day is ___",
  "I heard they are famous for ___",
].map((english, index) => ({ id: `ch10-template-${index + 1}`, english, ...writingSource, sourcePage: 209, section: "Beginner Template" }));

export const chapter10Content: ChapterContent = {
  id: 10,
  metadata,
  chunks: chapter10Chunks,
  conversations: chapter10ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "a and the",
    subtitle: "Introducing and identifying nouns",
    sections: [
      { heading: "a / an", description: "상대방이 모르거나 처음 언급되는, 특정하지 않은 하나를 가리킬 때 사용해.", examples: [
        { id: "ch10-a-1", english: "We just went to a random ramen place.", korean: "그냥 아무 라멘집에 들어갔어." },
        { id: "ch10-a-2", english: "We came across a matcha tea house.", korean: "맛차 찻집을 하나 발견했어." },
      ] },
      { heading: "the", description: "이미 언급했거나 상대방도 알고 있는 대상, 또는 최고인 대상을 가리킬 때 사용해.", examples: [
        { id: "ch10-the-1", english: "You know the famous old street lined with traditional wooden houses?", korean: "그 유명한 오래된 거리 알지? 전통 목조 건물이 쭉 늘어선 데." },
        { id: "ch10-the-2", english: "If you’ve never been to the city, I highly recommend it!", korean: "아직 그 도시에 안 가봤으면 꼭 가보라고 추천해!" },
        { id: "ch10-the-3", english: "This is the best ramen I’ve ever had.", korean: "내가 먹어 본 최고의 라멘이야." },
      ] },
      { heading: "No article", description: "일반적인 사실이나 하나의 표현으로 굳어진 경우에는 관사를 쓰지 않아.", examples: [
        { id: "ch10-none-1", english: "I don’t really watch shows.", korean: "나는 드라마는 잘 안 봐." },
        { id: "ch10-none-2", english: "Are you good with kids?", korean: "너 애들이랑 잘 놀아줘?" },
        { id: "ch10-none-3", english: "I usually go to bed around 11.", korean: "난 보통 11시쯤에 잠자리에 들어." },
      ] },
    ],
    sourcePages: [201, 202],
  },
};
