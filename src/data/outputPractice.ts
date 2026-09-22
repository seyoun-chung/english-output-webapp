import { chunks } from './chapter3';
import { conversationTurns } from './conversations';
import type { Rating } from '../progress';

export type ExerciseItem = {
  id: string;
  korean: string;
  english: string[];
  hint1: string[];
  hint2: string[];
  source: { file: string; page?: number; koreanPage?: number; englishPage?: number; section: string };
};

export const storyExercises: ExerciseItem[] = chunks.map(item => ({ ...item, id: `story-${item.id}`, korean: item.korean.join('\n') }));
export const conversationExercises: ExerciseItem[] = conversationTurns.map(item => ({ ...item, id: `conversation-${item.id}` }));
// Representative pilot: six exact textbook chunks, six existing supplement pairs.
// Not a complete transcription of the supplementary books. Whitespace is normalized;
// words and punctuation are preserved. Hint text contains only source prefixes/blanks.
export const exactExercises: ExerciseItem[] = storyExercises.map(item => ({ ...item, id: `output-${item.id}` }));
const storySource = { file: 'Week 3 — My Story 강의노트.pdf', page: 3, section: 'Week 3 / My Story / I prefer' };
const conversationSource = { file: 'Week 3 — Real Conversations 강의노트.pdf', page: 2, section: 'Week 3 / Real Conversations / I can’t stand' };
export const variationExercises: ExerciseItem[] = [
  { id: 'output-variation-1', korean: '나는 밤에 샤워하는걸 선호해.', english: ['I prefer to shower at night.'], hint1: ['I prefer…'], hint2: ['I prefer to ______ at night.'], source: storySource },
  { id: 'output-variation-2', korean: '난 아침에 샤워하는걸 선호해.', english: ['I prefer to shower in the morning.'], hint1: ['I prefer…'], hint2: ['I prefer to shower in the ______.'], source: storySource },
  { id: 'output-variation-3', korean: '나 걔 진짜 싫어.', english: ['I can’t stand her.'], hint1: ['I can’t…'], hint2: ['I can’t ______ her.'], source: conversationSource },
  { id: 'output-variation-4', korean: '습한건 진짜 못참겠어.', english: ['I can’t stand the humidity.'], hint1: ['I can’t…'], hint2: ['I can’t stand the ______.'], source: conversationSource },
  { id: 'output-variation-5', korean: '사람들이 천천히 걷는거 진짜 싫어.', english: ['I can’t stand it when people walk slowly.'], hint1: ['I can’t…'], hint2: ['I can’t stand it when people walk ______.'], source: conversationSource },
  { id: 'output-variation-6', korean: '사람들이 새치기 할 때 진짜 못참겠어.', english: ['I can’t stand it when people cut in line.'], hint1: ['I can’t…'], hint2: ['I can’t stand it when people ______ in line.'], source: conversationSource },
];
export const outputExercises = [...exactExercises, ...variationExercises];
export const allReviewExercises = [...storyExercises, ...conversationExercises, ...outputExercises];
export type ExerciseGroup = 'story' | 'conversation' | 'output';
export const exerciseGroup = (id: string): ExerciseGroup => id.startsWith('story-') ? 'story' : id.startsWith('conversation-') ? 'conversation' : 'output';
const rated = (value: unknown) => ['immediate', 'effort', 'review'].includes(value as string);
export function buildReviewItems({ chunkRatings, conversationRatings, outputRatings }: {
  chunkRatings: Record<number, Rating | null>;
  conversationRatings: Record<number, Rating | null>;
  outputRatings: Record<string, Rating | null>;
}): ExerciseItem[] {
  return [
    ...storyExercises.filter(item => rated(chunkRatings[Number(item.id.slice(6))])),
    ...conversationExercises.filter(item => rated(conversationRatings[Number(item.id.slice(13))])),
    ...outputExercises.filter(item => rated(outputRatings[item.id])),
  ];
}
