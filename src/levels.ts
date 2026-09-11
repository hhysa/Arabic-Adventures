import { groups } from './data';

// Levels are derived from saved word IDs; no second progress store is needed.
export function getLevels(completed: string[]) {
  return groups.map((group, index) => {
    const count = group.words.filter((word) =>
      completed.includes(word.id),
    ).length;
    return {
      group,
      index,
      number: index + 1,
      count,
      complete: count === group.words.length,
      nextWord:
        group.words.find((word) => !completed.includes(word.id)) ??
        group.words[0],
    };
  });
}
export const worldNames = [
  'The first steps',
  'The sunny trail',
  'The hidden garden',
  'The river crossing',
  'The mountain path',
  'The star valley',
  'The final adventure',
];
