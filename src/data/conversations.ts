export type ConversationRole = "A" | "B";

export const conversationSource = {
  file: "eBook_Bookcamp_Oct8.pdf",
  koreanPage: 56,
  englishPage: 57,
  section: "Chapter 3 / 3-3 Real Conversations",
} as const;

export type ConversationTurn = {
  id: number;
  role: ConversationRole;
  korean: string;
  english: string[];
  hint1: string[];
  hint2: string[];
  source: typeof conversationSource;
};

// Visually checked against the main textbook, pp. 56–57.
// Supplement annotations (slashes, synonyms) are not part of the target text.
export const conversationTurns: ConversationTurn[] = [
  {
    id: 1, role: "A",
    korean: "세상에, 저 사람 진짜 짜증 난다. 직원한테 엄청 무례하게 굴고 있어. 봐봐.",
    english: ["Oh my gosh, that guy is so annoying.", "He’s being so rude to the staff.", "Look."],
    hint1: ["Oh my gosh,…", "He’s being…", "L…"],
    hint2: ["Oh my gosh, that guy is so ______.", "He’s being so ______ to the staff.", "______."],
    source: conversationSource,
  },
  {
    id: 2, role: "B",
    korean: "으, 나 저런 거 진짜 싫어. 남한테 저렇게 하는 거 보면 속이 뒤집혀.",
    english: ["Ugh, I hate that.", "I can’t stand it when people treat others like that."],
    hint1: ["Ugh,…", "I can’t…"],
    hint2: ["Ugh, I ______ that.", "I can’t ______ it when people ______ others like that."],
    source: conversationSource,
  },
  {
    id: 3, role: "A",
    korean: "맞아. 특히 공공장소에서 그러는 거 말야. 저 직원이 불쌍하다.",
    english: ["I know.", "Especially in public.", "I feel bad for her."],
    hint1: ["I…", "Especially…", "I feel…"],
    hint2: ["I ______.", "Especially in ______.", "I feel ______ for her."],
    source: conversationSource,
  },
  {
    id: 4, role: "B",
    korean: "짜증 나는 얘기 나온 김에 말하자면, 어제 오래된 친구를 만났는데 한 시간이나 늦더라고. 근데 아무렇지 않게 대충 넘어가는 거야. 너무 답답했어.",
    english: ["Speaking of pet peeves, I met up with an old friend yesterday and she was an hour late.", "She just brushed it off like it was nothing.", "I was so frustrated."],
    hint1: ["Speaking of…", "She just…", "I was…"],
    hint2: ["Speaking of pet ______, I met up with an old friend yesterday and she was an hour ______.", "She just ______ it off like it was nothing.", "I was so ______."],
    source: conversationSource,
  },
  {
    id: 5, role: "A",
    korean: "아, 나도 그거 진짜 싫어!",
    english: ["Oh, I hate that!"],
    hint1: ["Oh,…"],
    hint2: ["Oh, I ______ that!"],
    source: conversationSource,
  },
  {
    id: 6, role: "B",
    korean: "가끔 늦는 건 괜찮지. 근데 어떤 사람들은 만날 때마다 늦으면서도 전혀 문제라고 생각 안 하잖아.",
    english: ["If someone is late from time to time, that’s fine.", "But some people are late every time like it’s not a big deal."],
    hint1: ["If someone…", "But some people…"],
    hint2: ["If someone is late from ______ to ______, that’s fine.", "But some people are late every time like it’s not a ______ ______."],
    source: conversationSource,
  },
  {
    id: 7, role: "A",
    korean: "맞아, 그거 진짜 답답하지. 나는 사람들이 휴대폰 보다가 나랑 부딪힐 때 너무 짜증 나. 어떻게 그렇게 주변을 신경 안 쓰고 다닐 수 있는지 이해가 안 돼.",
    english: ["Yeah, that’s frustrating.", "For me, I get really annoyed when people bump into me while they’re on their phones.", "I don’t understand how people can be so unaware."],
    hint1: ["Yeah,…", "For me,…", "I don’t understand…"],
    hint2: ["Yeah, that’s ______.", "For me, I get really ______ when people ______ into me while they’re on their phones.", "I don’t understand how people can be so ______."],
    source: conversationSource,
  },
];

export const roleTurnIds = (role: ConversationRole) =>
  conversationTurns.filter((turn) => turn.role === role).map((turn) => turn.id);

export const previousPartnerTurn = (id: number) => {
  const index = conversationTurns.findIndex((turn) => turn.id === id);
  return index > 0 ? conversationTurns[index - 1] : undefined;
};
