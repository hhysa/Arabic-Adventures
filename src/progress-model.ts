import { lessons } from './data';

export type Progress = {
  completed: string[];
  days: string[];
  quizStars: number;
};
export const emptyProgress: Progress = {
  completed: [],
  days: [],
  quizStars: 0,
};
export const LESSON_STARS = 3;
export const QUIZ_STARS = 1;
export const progressStorageKey = 'arabic-adventures-v1';
export const localDay = (date = new Date()) => date.toLocaleDateString('en-CA');
export const totalStars = (progress: Progress) =>
  progress.completed.length * LESSON_STARS + progress.quizStars;

export function parseProgress(raw: string): Progress {
  const saved = JSON.parse(raw);
  return {
    completed: Array.isArray(saved.completed)
      ? saved.completed.filter((id: string) => lessons.some((l) => l.id === id))
      : [],
    days: Array.isArray(saved.days) ? saved.days : [],
    quizStars: Number.isFinite(saved.quizStars) ? saved.quizStars : 0,
  };
}
export function completeLesson(
  progress: Progress,
  id: string,
  day = localDay(),
): Progress {
  return {
    ...progress,
    completed: Array.from(new Set([...progress.completed, id])),
    days: Array.from(new Set([...progress.days, day])),
  };
}
export function rewardQuiz(progress: Progress, day = localDay()): Progress {
  return {
    ...progress,
    quizStars: progress.quizStars + QUIZ_STARS,
    days: Array.from(new Set([...progress.days, day])),
  };
}
export function streak(days: string[], now = new Date()) {
  let count = 0;
  const day = new Date(now);
  if (!days.includes(localDay(day))) day.setDate(day.getDate() - 1);
  while (days.includes(localDay(day))) {
    count++;
    day.setDate(day.getDate() - 1);
  }
  return count;
}
