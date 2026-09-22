export type Chunk = {
  id: number;
  korean: string[];
  english: string[];
  // Only source prefixes / source words replaced by blanks are allowed.
  hint1: string[];
  hint2: string[];
  source: {
    file: string;
    koreanPage: number;
    englishPage: number;
    section: string;
  };
};

const source = {
  file: "eBook_Bookcamp_Oct8.pdf",
  koreanPage: 50,
  englishPage: 51,
  section: "Chapter 3 / 3-1 My Story",
};

export const chunks: Chunk[] = [
  {
    id: 1,
    korean: [
      "너 MBTI 검사해 본 적 있어?",
      "당연하지! 난 INFP야.",
      "나는 그닥 사람들과 어울리는 편은 아니야.",
    ],
    english: [
      "Have you taken the MBTI test?",
      "Of course! I’m an INFP.",
      "I’m not really social.",
    ],
    hint1: ["Have you…", "Of course!…", "I’m not…"],
    hint2: [
      "Have you ______ the MBTI test?",
      "Of course! I’m an ______.",
      "I’m not really ______.",
    ],
    source,
  },
  {
    id: 2,
    korean: [
      "사람들이 많은 곳에 있으면 쉽게 지치고 부담스러워져.",
      "난 친한 친구 몇 명만 두는 걸 선호해.",
    ],
    english: [
      "When I’m around many people, I get tired and overwhelmed easily.",
      "I prefer to just have a few close friends.",
    ],
    hint1: ["When I’m around…", "I prefer…"],
    hint2: [
      "When I’m around many people, I get ______ and ______ easily.",
      "I prefer to just have a few ______ friends.",
    ],
    source,
  },
  {
    id: 3,
    korean: [
      "근데 항상 이랬던 건 아니야.",
      "어렸을 땐 훨씬 외향적이고 두려움도 없었거든.",
      "시간이 지나면서 점점 더 내성적이고 겁이 많아졌어.",
    ],
    english: [
      "I wasn’t always like this, though.",
      "When I was younger, I was more outgoing and fearless.",
      "Over time, I became more reserved and cautious.",
    ],
    hint1: ["I wasn’t…", "When I was younger…", "Over time…"],
    hint2: [
      "I wasn’t ______ like this, though.",
      "When I was younger, I was more ______ and ______.",
      "Over time, I became more ______ and ______.",
    ],
    source,
  },
  {
    id: 4,
    korean: ["최근에는 내가 너무 익숙한 곳에만 머물러 있다는 걸 깨달았어."],
    english: [
      "Recently, I realized I was staying in my comfort zone too much.",
    ],
    hint1: ["Recently, I realized…"],
    hint2: ["Recently, I realized I was staying in my ______ ______ too much."],
    source,
  },
  {
    id: 5,
    korean: [
      "지금은 영어를 배우고 있으니까 더 도전해 보고 싶고,",
      "전 세계에서 새로운 친구들도 사귀고 싶어.",
    ],
    english: [
      "Now that I’m learning English,",
      "I want to challenge myself more and make new friends from around the world.",
    ],
    hint1: ["Now that…", "I want to…"],
    hint2: [
      "Now that I’m ______ English,",
      "I want to ______ myself more and make new friends from around the ______.",
    ],
    source,
  },
  {
    id: 6,
    korean: [
      "생각만 해도 설렌다.",
      "너는 어때?",
      "넌 내향형이야, 아니면 외향형이야?",
    ],
    english: [
      "It’s exciting just to think about it.",
      "What about you?",
      "Are you an introvert or an extrovert?",
    ],
    hint1: ["It’s exciting…", "What about…", "Are you…"],
    hint2: [
      "It’s ______ just to think about it.",
      "What about ______?",
      "Are you an ______ or an ______?",
    ],
    source,
  },
];

export const chunkIds = chunks.map(({ id }) => id);
