import { groups, lessons } from './data';
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
  return shuffled.slice(0, 5).map((group) => {
    const words = lessons.filter((l) => l.group === group);
    const word = words[Math.floor(random() * words.length)];
    const distractors = shuffled.filter((i) => i !== group).slice(0, 3);
    const options = shuffle([...distractors, group], random);
    return { word, options };
  });
}
