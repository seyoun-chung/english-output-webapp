import type { ChapterContent } from "./chapterContent";
import type { Chunk } from "./chapter3";
import { chapterById } from "./chapters";
import type { ConversationTurn } from "./conversations";
import type { ExerciseItem } from "./outputPractice";

const metadata = chapterById(5);
const storySource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.myStoryKorean,
  englishPage: metadata.pages.myStoryEnglish,
  section: "Chapter 5 / 5-1 My Story",
};

export const chapter5Chunks: Chunk[] = [
  {
    id: 1,
    korean: ["Jenny! 완전 오랜만이야!", "요즘 뭐 하고 지냈어?"],
    english: ["Hey Jenny! It’s been so long!", "What have you been up to?"],
    hint1: ["Hey Jenny!…", "What have…"],
    hint2: ["Hey Jenny! It’s been so ______!", "What have you been up ______?"],
    source: storySource,
  },
  {
    id: 2,
    korean: ["그러게! 나 할 얘기 진짜 많아.", "내가 영어 배우고 싶다고 했던 거 기억나?"],
    english: ["I know! I have so much to tell you.", "Remember how I said I wanted to learn English?"],
    hint1: ["I know!…", "Remember how…"],
    hint2: ["I know! I have so much to ______ you.", "Remember how I said I wanted to learn ______?"],
    source: storySource,
  },
  {
    id: 3,
    korean: ["3개월 동안 엄청 빡세게 공부하는 프로그램을 찾았거든.", "지난 10월부터 시작했는데 이제 2주 뒤면 끝나."],
    english: ["I found this program where we study really hard for three months.", "I started back in October, and it ends in two weeks."],
    hint1: ["I found this…", "I started…"],
    hint2: ["I found this program where we study really hard for three ______.", "I started back in October, and it ends in two ______."],
    source: storySource,
  },
  {
    id: 4,
    korean: ["이제껏 쉽진 않았는데 꾸준히 하려고 계속 노력하고 있어.", "이제야 영어 실력이 좀 느는 것 같아."],
    english: ["It hasn’t been easy, but I’ve been trying to stay consistent.", "I feel like I’m finally making progress."],
    hint1: ["It hasn’t…", "I feel like…"],
    hint2: ["It hasn’t been easy, but I’ve been trying to stay ______.", "I feel like I’m finally making ______."],
    source: storySource,
  },
  {
    id: 5,
    korean: ["아, 근데 Kayla 기억해?", "며칠 전에 코스트코에서 마주쳐서 다시 연락하게 됐어."],
    english: ["Anyway, do you remember Kayla?", "We ran into each other at Costco the other day and reconnected!"],
    hint1: ["Anyway,…", "We ran into…"],
    hint2: ["Anyway, do you remember ______?", "We ran into each other at Costco the other day and ______!"],
    source: storySource,
  },
  {
    id: 6,
    korean: ["다음 주에 커피 마시면서 못다 한 이야기 하기로 했거든.", "너도 같이 갈래?", "토요일 저녁 7시쯤에 갈 거야."],
    english: ["We decided to catch up over coffee next week.", "Why don’t you come with us?", "We’re going on Saturday evening around 7."],
    hint1: ["We decided…", "Why don’t…", "We’re going…"],
    hint2: ["We decided to catch up over ______ next week.", "Why don’t you come with ______?", "We’re going on Saturday evening around ______."],
    source: storySource,
  },
];

const conversationSource = {
  file: metadata.sourceFile,
  koreanPage: metadata.pages.conversationKorean,
  englishPage: metadata.pages.conversationEnglish,
  section: "Chapter 5 / 5-3 Real Conversations",
};

export const chapter5ConversationTurns: ConversationTurn[] = [
  { id: 1, role: "A", korean: "야, 잘 지냈어? 완전 오랜만이다!", english: ["Hey, how’s it going?", "Long time no see."], hint1: ["Hey,…", "Long time…"], hint2: ["Hey, how’s it ______?", "Long time no ______."], source: conversationSource },
  { id: 2, role: "B", korean: "응, 잘 지냈지. 일하느라 좀 바빴어. 너는?", english: ["I’ve been good, just busy with work.", "How about you?"], hint1: ["I’ve been…", "How about…"], hint2: ["I’ve been good, just busy with ______.", "How about ______?"], source: conversationSource },
  { id: 3, role: "A", korean: "나도 똑같지 뭐. 우리 조만간 저녁 먹으면서 얘기 좀 하자. 이번 주말 어때?", english: ["Yeah, me too.", "Let’s grab dinner sometime and catch up.", "Are you free this weekend?"], hint1: ["Yeah,…", "Let’s grab…", "Are you…"], hint2: ["Yeah, me ______.", "Let’s grab dinner sometime and catch ______.", "Are you free this ______?"], source: conversationSource },
  { id: 4, role: "B", korean: "잠깐 스케줄 확인해 볼게. […] 일요일 시간 돼. 너는 괜찮아?", english: ["Let me check my schedule.", "[…] I’m free on Sunday.", "Does that work for you?"], hint1: ["Let me…", "[…] I’m…", "Does that…"], hint2: ["Let me check my ______.", "[…] I’m free on ______.", "Does that work for ______?"], source: conversationSource },
  { id: 5, role: "A", korean: "완전 좋아. 중국 음식 어때? 나 예전부터 하이디라오 한번 먹어보고 싶었어.", english: ["That’s perfect.", "How about Chinese?", "I’ve been wanting to try Haidilao."], hint1: ["That’s…", "How about…", "I’ve been…"], hint2: ["That’s ______.", "How about ______?", "I’ve been wanting to try ______."], source: conversationSource },
  { id: 6, role: "B", korean: "거기 요즘 핫한데 맞지? SNS에서 맨날 보이더라.", english: ["That place is really trendy, huh?", "I see it everywhere on social media."], hint1: ["That place…", "I see it…"], hint2: ["That place is really ______, huh?", "I see it everywhere on social ______."], source: conversationSource },
  { id: 7, role: "A", korean: "맞아, 나도 인스타그램에서 봤어. 줄 엄청 선다더라. 5시에 연다니까 한 4시 50분쯤 가자.", english: ["Yeah, I saw it on Instagram.", "I heard there’s always a line.", "They open at 5, so let’s try to get there by 4:50."], hint1: ["Yeah, I saw…", "I heard…", "They open…"], hint2: ["Yeah, I saw it on ______.", "I heard there’s always a ______.", "They open at 5, so let’s try to get there by ______."], source: conversationSource },
  { id: 8, role: "B", korean: "그냥 4시 반쯤에 홍대입구역 어때? 혹시 모르니까. 9번 출구일 거야.", english: ["What about around 4:30 at Hongdae Station?", "Just to be safe.", "I think it’s exit 9."], hint1: ["What about…", "Just to…", "I think…"], hint2: ["What about around 4:30 at Hongdae ______?", "Just to be ______.", "I think it’s exit ______."], source: conversationSource },
  { id: 9, role: "A", korean: "가능해! 일요일 4시 반쯤에, 홍대입구역 9번 출구 앞에서! 그때 보자~", english: ["Works for me!", "Sunday at around 4:30, at Hongdae Station, outside exit 9.", "See you then!"], hint1: ["Works…", "Sunday…", "See you…"], hint2: ["Works for ______!", "Sunday at around 4:30, at Hongdae Station, outside exit ______.", "See you ______!"], source: conversationSource },
];

const storyExercises: ExerciseItem[] = chapter5Chunks.map((item) => ({ ...item, id: `story-${item.id}`, korean: item.korean.join("\n") }));
const conversationExercises: ExerciseItem[] = chapter5ConversationTurns.map((item) => ({ ...item, id: `conversation-${item.id}` }));
const exactExercises: ExerciseItem[] = storyExercises.map((item) => ({ ...item, id: `output-${item.id}` }));
const storyNotes = { file: "Week 5 — My Story 강의노트.pdf", page: 1, section: "Week 5 / My Story" };
const conversationNotes = { file: "Week 5 — Real Conversations 강의노트.pdf", page: 1, section: "Week 5 / Real Conversations" };
const variationExercises: ExerciseItem[] = [
  { id: "output-variation-1", korean: "내가 혼자 여행하고 싶다고 한 거 기억나?", english: ["Remember how I said I wanted to travel by myself?"], hint1: ["Remember how…"], hint2: ["Remember how I said I wanted to travel by ______?"], source: storyNotes },
  { id: "output-variation-2", korean: "쉽진 않은데, 매일 공부하려고 요새 노력 중이야.", english: ["It hasn’t been easy, but I’ve been trying to study every day."], hint1: ["It hasn’t…"], hint2: ["It hasn’t been easy, but I’ve been trying to study every ______."], source: { ...storyNotes, page: 3 } },
  { id: "output-variation-3", korean: "우리 다음 주에 하루 쉬는 게 어때?", english: ["Why don’t we take a day off next week?"], hint1: ["Why don’t…"], hint2: ["Why don’t we take a day ______ next week?"], source: { ...storyNotes, page: 6 } },
  { id: "output-variation-4", korean: "금요일에 저녁 먹자.", english: ["Let’s grab dinner on Friday."], hint1: ["Let’s grab…"], hint2: ["Let’s grab dinner on ______."], source: conversationNotes },
  { id: "output-variation-5", korean: "일요일 괜찮아?", english: ["Does Sunday work for you?"], hint1: ["Does Sunday…"], hint2: ["Does Sunday work for ______?"], source: { ...conversationNotes, page: 3 } },
  { id: "output-variation-6", korean: "나 요즘 액센트에 집중하고 있어.", english: ["I’ve been focusing on my accent lately."], hint1: ["I’ve been…"], hint2: ["I’ve been focusing on my ______ lately."], source: { ...conversationNotes, page: 4 } },
];
const outputExercises = [...exactExercises, ...variationExercises];
const reviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
const pass2ReviewExercises = [...storyExercises.slice(0, 3), ...conversationExercises.slice(0, 3), ...variationExercises];

const writingSource = { chapterId: 5, sourceType: "main", sourceFile: metadata.sourceFile } as const;
const writingQuestions = [
  "Imagine I’m your friend you haven’t seen in over a year. Tell me about what you’ve been doing, what you’re working on, and how your social life is. Be as detailed as possible!",
  "Tell me about your best friends. How did you meet? What are they like?",
  "Where’s your favorite place to hang out with friends?",
  "How often do you usually meet up with your friends?",
  "Do you prefer catching up over coffee, dinner, or something else?",
  "How do you usually keep in touch with friends: messages, calls, or social media?",
  "Do you like to plan meet-ups in advance or decide spontaneously?",
  "Do you prefer small group hangouts or big group gatherings?",
  "Do you prefer trying trendy new restaurants or going to your regular spots?",
  "What would your childhood best friend be most surprised about if they saw you now?",
  "Is there a friend you haven’t talked to in a long time but really want to see?",
  "Have you ever run into someone you know in a totally random place?",
].map((english, index) => ({ id: `ch5-question-${index + 1}`, english, ...writingSource, sourcePage: index === 0 ? 110 : 112, section: index === 0 ? "What About You?" : "Let’s Have a Talk" }));
const writingTemplates = [
  "Hey! It’s been so long. I have so much to tell you.",
  "The biggest thing is ___",
  "I started ___",
  "I’ve also been ___",
  "Recently, I ran into ___",
  "Let’s catch up soon. Are you free on ___?",
  "I want to take you to ___",
  "Let’s meet around ___",
].map((english, index) => ({ id: `ch5-template-${index + 1}`, english, ...writingSource, sourcePage: 111, section: "Beginner Template" }));

export const chapter5Content: ChapterContent = {
  id: 5,
  metadata,
  chunks: chapter5Chunks,
  conversations: chapter5ConversationTurns,
  exercises: { exact: exactExercises, variation: variationExercises, output: outputExercises, review: reviewExercises },
  pass2ReviewExercises,
  writing: { questions: writingQuestions, templates: writingTemplates },
  grammar: {
    title: "at, in, on, about, around, for",
    subtitle: "Time, place, approximation, and duration",
    sections: [
      { heading: "at", description: "구체적인 시간이나 장소를 콕 집어 말할 때 사용해.", examples: [
        { id: "ch5-at-1", english: "I’ll meet you at 3 p.m.", korean: "세 시에 만나." },
        { id: "ch5-at-2", english: "I met Stephanie at Starbucks.", korean: "Stephanie를 스타벅스에서 만났어." },
      ] },
      { heading: "in", description: "어떤 시간이나 기간, 장소 안에 포함될 때 사용해.", examples: [
        { id: "ch5-in-1", english: "I was born in July.", korean: "난 7월에 태어났어." },
        { id: "ch5-in-2", english: "My deadline is in two days.", korean: "마감일이 이틀 뒤야." },
      ] },
      { heading: "on", description: "특정 요일이나 날짜, 미디어 플랫폼 앞에 사용해.", examples: [
        { id: "ch5-on-1", english: "I have class on Monday.", korean: "나 월요일에 수업 있어." },
        { id: "ch5-on-2", english: "I saw Koham on YouTube.", korean: "유튜브에서 코햄을 봤어." },
      ] },
      { heading: "about", description: "대략적인 시간이나 시간의 양을 말할 때 사용해.", examples: [
        { id: "ch5-about-1", english: "It will take about 20 minutes.", korean: "20분 정도 걸릴 거야." },
        { id: "ch5-about-2", english: "We waited in line for about an hour.", korean: "우리 1시간 정도 기다렸어." },
      ] },
      { heading: "around", description: "시간, 숫자 등 여러 대상을 대략적으로 말할 때 사용해.", examples: [
        { id: "ch5-around-1", english: "Let’s meet around 5 p.m.", korean: "5시 정도에 만나자." },
        { id: "ch5-around-2", english: "The boot camp costs around $400.", korean: "부트캠프는 400달러 정도 들어." },
      ] },
      { heading: "for", description: "뒤에 시간과 함께 쓰면 얼마 동안 지속되는지 말해.", examples: [
        { id: "ch5-for-1", english: "I stayed in Australia for two months.", korean: "나 호주에서 두 달 동안 있었어." },
        { id: "ch5-for-2", english: "We’ve been waiting for 30 minutes.", korean: "우리 지금 30분째 기다리고 있어." },
      ] },
    ],
    sourcePages: [99, 100, 101, 102],
  },
};
