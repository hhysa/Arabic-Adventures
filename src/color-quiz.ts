import { arabicColors } from './color-data';

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function makeColorQuiz(random = Math.random) {
  return shuffle(arabicColors, random)
    .slice(0, 10)
    .map((color) => ({
      color,
      options: shuffle(
        [
          color,
          ...shuffle(
            arabicColors.filter((other) => other.id !== color.id),
            random,
          ).slice(0, 3),
        ],
        random,
      ),
    }));
}
