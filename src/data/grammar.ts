// Original textbook pp.54–55, verified from rendered pages. No generated examples.
export const grammarSource = { chapterId: 3, sourceFile: 'eBook_Bookcamp_Oct8.pdf', sourceType: 'main', section: 'Grammar Focus', reviewEligibility: false } as const;
export const grammarExplanations = {
  ed: '-ed로 끝나는 감정을 표현하는 형용사는 사람이 느끼는 바를 표현할 때 써.',
  ing: '-ing로 끝나는 감정을 표현하는 형용사는 대상이나 상황을 묘사할 때 써.',
  people: '-ing를 사람에게 쓸 땐 그 사람의 특징을 표현하는 거야. 누군가를 boring이라고 표현하는 건 그 사람 자체가 지루하다는 거야. 나를 지루하게 만드는 거지.',
};
export const grammarPairs = [
  ['I’m interested in English.', '(‘내’가 흥미를 느낌)', 'The English book is interesting.', '(‘그 책’이 흥미로움)'],
  ['She’s bored in class.', '(‘그녀’가 지루해함)', 'That class is boring.', '(‘그 수업’이 지루함)'],
  ['I am tired and overwhelmed.', '(‘내’가 피곤하고 부담을 느낌)', 'The project was tiring and overwhelming.', '(‘그 프로젝트’가 너무 힘들고 벅참)'],
  ['I was so frustrated.', '(‘내’가 답답함)', 'It was so frustrating.', '(‘그’게 답답하게 함)'],
  ['I am annoyed.', '(‘내’가 짜증 남)', 'It is annoying.', '(‘그’게 짜증 남)'],
].map(([ed, edKorean, ing, ingKorean], index) => ({ id: `ch3-grammar-${index + 1}`, ed, edKorean, ing, ingKorean, ...grammarSource, sourcePages: [54, 55] }));
