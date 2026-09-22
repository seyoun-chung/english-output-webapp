// Visually checked against the original main textbook, printed/PDF pages 63–65.
export const writingSource = { chapterId: 3, sourceType: 'main', sourceFile: 'eBook_Bookcamp_Oct8.pdf' } as const;
export const writingQuestions = [
  'How do your friends usually describe you?',
  'In your opinion, what are some of your best personality traits?',
  'Do you think your personality has changed since childhood? How?',
  'What personality traits do you admire in other people?',
  'What personality traits do you dislike?',
  'Are you more of a leader or a follower? Why?',
  'Do you think you are more optimistic or pessimistic?',
  'Are you more like your mom or your dad?',
  'Do you have a family member or friend with a totally different personality from you?',
  'When dating, what’s more important: looks or personality? How would you divide the percentage? (ex. 70% personality, 30% looks)',
].map((english, index) => ({ id: `ch3-question-${index + 1}`, english, ...writingSource, sourcePage: 65, section: 'Let’s Have a Talk', reviewEligibility: false }));
export const writingTemplates = [
  'I’m an ___ (your MBTI)',
  'I think I’m more of an ___ (introvert or extrovert)',
  'I tend to be ___',
  'I prefer ___',
  'I used to be more ___, but I’ve grown more ___',
  'I can’t stand ___',
  'I hate it when ___',
].map((english, index) => ({ id: `ch3-template-${index + 1}`, english, ...writingSource, sourcePage: 64, section: 'Beginner Template', reviewEligibility: false }));
// Underscores represent the dotted writing spaces printed in the source.
