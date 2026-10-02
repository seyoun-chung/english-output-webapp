import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(2);
const storySource = { file: metadata.sourceFile, koreanPage: 28, englishPage: 29, section: "Chapter 2 / 2-1 My Story" };

export const chapter2Chunks: Chunk[] = [
  { id: 1, korean: ["넌 취미가 뭐야?", "난 친구들이랑 요즘 핫한 카페에 가는 걸 좋아해."], english: ["What do you do in your free time?", "I like to go to trendy new cafes with my friends."], hint1: ["What do you…", "I like to…"], hint2: ["What do you do in your ______ time?", "I like to go to trendy new ______ with my friends."], source: storySource },
  { id: 2, korean: ["또 혼자 책 읽으면서 시간 보내는 것도 정말 좋아하고.", "난 그렇게 스트레스를 풀거든."], english: ["I also love spending time alone with a good book.", "It’s how I relieve stress."], hint1: ["I also love…", "It’s how…"], hint2: ["I also love spending time ______ with a good book.", "It’s how I relieve ______."], source: storySource },
  { id: 3, korean: ["요즘은 영어 공부에 시간을 많이 쓰고 있어.", "제대로 영어를 공부하기 시작한 지는 2주 됐지."], english: ["Lately, I’ve been spending a lot of time studying English.", "It’s been two weeks since I started studying seriously."], hint1: ["Lately, I’ve been…", "It’s been…"], hint2: ["Lately, I’ve been spending a lot of time studying ______.", "It’s been two weeks since I started studying ______."], source: storySource },
  { id: 4, korean: ["요즘 운동도 꾸준히 하려고 노력 중이야.", "한강을 따라서 일주일에 세 번 뛰는데, 그러면 머리가 맑아지고 공부에 집중하는 데 도움이 돼."], english: ["I’ve also been trying to work out regularly.", "I run along the Han River three times a week.", "It really helps me clear my mind and focus on studying."], hint1: ["I’ve also been…", "I run…", "It really helps…"], hint2: ["I’ve also been trying to work out ______.", "I run along the Han River three times a ______.", "It really helps me clear my mind and focus on ______."], source: storySource },
  { id: 5, korean: ["며칠 전엔 숨은 장소를 발견했는데, 거기서 노을이 진짜 예쁘게 보여."], english: ["The other day, I found a hidden spot where you can see a beautiful sunset."], hint1: ["The other day…"], hint2: ["The other day, I found a hidden ______ where you can see a beautiful ______."], source: storySource },
  { id: 6, korean: ["다음에 너 데려갈게!"], english: ["I’ll take you there next time!"], hint1: ["I’ll take…"], hint2: ["I’ll take you ______ next time!"], source: storySource },
];

const conversationSource = { file: metadata.sourceFile, koreanPage: 36, englishPage: 37, section: "Chapter 2 / 2-3 Real Conversations" };
export const chapter2ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "퇴근하고 보통 뭐 해?", english: ["What do you normally do after work?"], hint1: ["What do you…"], hint2: ["What do you normally do after ______?"], source: conversationSource },
  { id: 2, role: "B", korean: "요즘 요리에 빠져서, 주로 내가 먹을 거 맛있게 만들어 먹어.", english: ["I’ve been into cooking lately, so I usually make something nice for myself."], hint1: ["I’ve been into…"], hint2: ["I’ve been into cooking lately, so I usually make something nice for ______."], source: conversationSource },
  { id: 3, role: "A", korean: "오, 멋지다. 나도 예전엔 요리 자주 했는데, 요즘은 일 때문에 너무 바빠서 그럴 에너지가 없어.", english: ["Cool.", "I used to cook a lot, but I’ve been so busy with work.", "I don’t have the energy anymore."], hint1: ["Cool.", "I used to…", "I don’t have…"], hint2: ["Cool.", "I used to cook a lot, but I’ve been so busy with ______.", "I don’t have the ______ anymore."], source: conversationSource },
  { id: 4, role: "B", korean: "맞아, 이해해. 나도 너무 피곤하면 그냥 배달 시켜 먹어.", english: ["Yeah, I understand.", "When I’m too tired to cook, I just get delivery."], hint1: ["Yeah,…", "When I’m…"], hint2: ["Yeah, I ______.", "When I’m too tired to cook, I just get ______."], source: conversationSource },
  { id: 5, role: "A", korean: "나도 그래. 근데 아무리 피곤해도 운동은 절대 안 빼먹어. 나 요가는 몇 년째 하고 있거든. 최근엔 클라이밍도 시작했어.", english: ["Me too.", "But no matter how tired I am, I never skip exercising.", "I’ve been doing yoga for years now.", "I also started climbing recently."], hint1: ["Me too.", "But no matter…", "I’ve been…", "I also…"], hint2: ["Me too.", "But no matter how tired I am, I never ______ exercising.", "I’ve been doing yoga for ______ now.", "I also started climbing ______."], source: conversationSource },
  { id: 6, role: "B", korean: "와, 나 요가 진짜 해 보고 싶었는데! 나도 운동 좀 더 해야겠다.", english: ["Oh, I’ve always wanted to try yoga!", "I should really exercise more, too."], hint1: ["Oh, I’ve always…", "I should…"], hint2: ["Oh, I’ve always wanted to try ______!", "I should really exercise ______, too."], source: conversationSource },
  { id: 7, role: "A", korean: "사실 물어보고 싶었는데, 언제 한번 나랑 같이 갈래?", english: ["I’ve been meaning to ask, why don’t you come with me sometime?"], hint1: ["I’ve been meaning…"], hint2: ["I’ve been meaning to ask, why don’t you come with me ______?"], source: conversationSource },
  { id: 8, role: "B", korean: "너무 좋지! 근데 조금 긴장된다.", english: ["I’d love that!", "I’m a bit nervous, though."], hint1: ["I’d love…", "I’m a bit…"], hint2: ["I’d ______ that!", "I’m a bit nervous, ______."], source: conversationSource },
  { id: 9, role: "A", korean: "처음엔 다 힘들어. 근데 그게 또 보람 있는 거야.", english: ["It’s always hard at first, but that’s what makes it worth it."], hint1: ["It’s always…"], hint2: ["It’s always hard at first, but that’s what makes it ______ it."], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter2Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter2ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 2 — My Story 강의노트.pdf", page: 1, section: "Week 2 / My Story" };
const conversationNotes = { file: "Week 2 — Real Conversations 라이브노트.pdf", page: 1, section: "Week 2 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "난 책 보는 걸 좋아해.", english: ["I like reading."], hint1: ["I like…"], hint2: ["I like ______."], source: storyNotes },
  { id: "output-variation-2", korean: "요즘엔 집에서 시간을 많이 보내고 있어.", english: ["Lately, I’ve been spending a lot of time at home."], hint1: ["Lately, I’ve…"], hint2: ["Lately, I’ve been spending a lot of time at ______."], source: { ...storyNotes, page: 2 } },
  { id: "output-variation-3", korean: "요즘에 핸드폰 덜 쓰려고 노력 중이야.", english: ["I’ve been trying to use my phone less."], hint1: ["I’ve been trying…"], hint2: ["I’ve been trying to use my phone ______."], source: { ...storyNotes, page: 4 } },
  { id: "output-variation-4", korean: "다음에 내가 제일 좋아하는 한식당 데려갈게.", english: ["I’ll take you to my favorite Korean restaurant."], hint1: ["I’ll take…"], hint2: ["I’ll take you to my favorite Korean ______."], source: { ...storyNotes, page: 6 } },
  { id: "output-variation-5", korean: "예전엔 한강 따라 달리곤 했어.", english: ["I used to run along the Han River."], hint1: ["I used to…"], hint2: ["I used to run along the Han ______."], source: { ...conversationNotes, page: 2 } },
  { id: "output-variation-6", korean: "영어 배우는 건 쉽진 않은데, 그럴만한 가치가 있어.", english: ["Learning English isn’t easy, but it’s worth it."], hint1: ["Learning English…"], hint2: ["Learning English isn’t easy, but it’s ______ it."], source: { ...conversationNotes, page: 6 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const questions = [
  "What’s your favorite YouTube channel or show lately?",
  "Are you following any celebrities or influencers on Instagram? Why do you follow them?",
  "Tell us about a restaurant you went to recently.",
  "What is one of your favorite go-to restaurants?",
  "Describe one of your favorite cafes. Why do you like it?",
  "Open your photo album. What’s the first photo you find? Tell us about the picture and the situation.",
  "Tell me about your favorite sport or athlete. Why do you follow that sport or athlete?",
  "What kind of music do you listen to these days?",
  "When was the last time you read a book? What was it about?",
  "Who do you spend most of your time with? Tell us about them.",
  "You unexpectedly get a day off from work and the weather is perfect. How would you spend the day?",
].map((english, index) => ({ id: `ch2-question-${index + 1}`, english }));
const templates = ["In my free time, I like to ___", "Lately, I’ve been spending a lot of time ___", "The other day, I ___", "After work, I usually ___", "At night, I usually ___", "I’ve always wanted to try ___"].map((english, index) => ({ id: `ch2-template-${index + 1}`, english }));

export const chapter2Content: ChapterContent = {
  id: 2, metadata, chunks: chapter2Chunks, conversations: chapter2ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises, writing: { questions, templates },
  grammar: {
    title: "I do vs I have done", subtitle: "Present habits and present connections",
    sections: [
      { heading: "I do", description: "그냥 늘 사실이거나 진리인 걸 말할 때 동사의 현재형을 써. 또 습관이나 일상적으로 반복되는 행동을 말할 때도 사용해.", examples: [
        { id: "ch2-do-1", english: "The earth is round.", korean: "지구가 둥글다는 건 모두가 아는 사실이니까 동사도 현재형." },
        { id: "ch2-do-2", english: "Coffee contains caffeine.", korean: "커피에 카페인이 들어간다는 것도 모두가 다 아는 상식이니까 동사도 현재형." },
        { id: "ch2-do-3", english: "I like to go to trendy new cafes.", korean: "그냥 일상적으로 나는 카페 가는 걸 좋아하고 또 자주 함." },
      ] },
      { heading: "I have done", description: "과거에 일어난 일이 현재에도 연결될 때 사용하는 형태야.", examples: [
        { id: "ch2-have-1", english: "It’s been two weeks since I started practicing seriously.", korean: "본격적으로 연습을 시작한 지 2주가 됐어." },
        { id: "ch2-have-2", english: "I’ve always wanted to try yoga.", korean: "나는 항상 요가를 해 보고 싶었어." },
        { id: "ch2-have-3", english: "I can’t find my phone. Have you seen it?", korean: "내 휴대폰을 못 찾겠어. 내 폰 봤어?" },
      ] },
    ], sourcePages: [33, 34],
  },
};
