import { groups, lessons } from './data';
export const QUIZ_LENGTH = 10;
function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function makeQuiz(random = Math.random) {
  const shuffled = shuffle(
    groups.map((_, i) => i),
    random,
  );
  const letterQuestions = shuffled.slice(0, 5).map((group) => {
    const words = lessons.filter((l) => l.group === group);
    const word = words[Math.floor(random() * words.length)];
    const distractors = shuffled.filter((i) => i !== group).slice(0, 3);
    const options = shuffle([...distractors, group], random);
    return { kind: 'letter' as const, word, options, correctOption: group };
  });
  const imageQuestions = shuffled.slice(5, QUIZ_LENGTH).map((group) => {
    const words = lessons.filter((word) => word.group === group);
    const word = words[Math.floor(random() * words.length)];
    const correctOption = lessons.indexOf(word);
    const distractors = shuffle(
      lessons
        .map((_, index) => index)
        .filter(
          (index) =>
            lessons[index].emoji !== word.emoji &&
            lessons[index].arabic !== word.arabic,
        ),
      random,
    ).slice(0, 3);
    return {
      kind: 'image' as const,
      word,
      options: shuffle([...distractors, correctOption], random),
      correctOption,
    };
  });
  return [...letterQuestions, ...imageQuestions];
}
