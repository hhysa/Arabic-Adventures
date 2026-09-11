import { makeQuiz } from '../src/quiz';
import { useLanguage } from '../src/language';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Shell, Button, s, colors } from '../src/ui';
import { groups, lessons } from '../src/data';
import { useProgress } from '../src/progress';
export default function Quiz() {
  const { t } = useLanguage();
  const progress = useProgress(),
    [round, setRound] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [score, setScore] = useState(0),
    [finished, setFinished] = useState(false),
    locked = useRef(false);
  const [questions, setQuestions] = useState<ReturnType<typeof makeQuiz>>([]);
  useEffect(() => setQuestions(makeQuiz()), []);
  const q = questions[round]?.word ?? lessons[0],
    correct = answer === q.group;
  function choose(i: number) {
    if (locked.current || !progress.ready || !questions.length) return;
    locked.current = true;
    setAnswer(i);
    if (i === q.group) {
      setScore((v) => v + 1);
      progress.reward();
    }
  }
  return (
    <Shell>
      <Text style={s.eyebrow}>{t('A LITTLE BRAIN ADVENTURE')}</Text>
      <Text style={s.title}>
        {finished
          ? t('Look at you grow!')
          : t('Which letter starts this word?')}
      </Text>
      {finished ? (
        <View
          style={[
            s.card,
            { alignItems: 'center', padding: 40, backgroundColor: '#FFF2CC' },
          ]}
        >
          <Text style={{ fontSize: 80 }}>🌟</Text>
          <Text style={s.title}>{t('{score} of 5 discovered', { score })}</Text>
          <Text style={s.sub}>
            {t('You collected {score} stars. Keep exploring!', { score })}
          </Text>
          <Button
            onPress={() => {
              setQuestions(makeQuiz());
              setRound(0);
              setAnswer(null);
              setScore(0);
              setFinished(false);
              locked.current = false;
            }}
          >
            {t('Play again')}
          </Button>
          <Button secondary onPress={() => router.push('/')}>
            {t('Back to the trail')}
          </Button>
        </View>
      ) : (
        <>
          <Text style={s.sub}>
            {t('Question {number} of 5 · {score} stars this round', {
              number: round + 1,
              score,
            })}
          </Text>
          <View
            style={[
              s.card,
              { alignItems: 'center', backgroundColor: '#EAF3D2', padding: 32 },
            ]}
          >
            <Text style={{ fontSize: 100 }}>{q.emoji}</Text>
            <Text style={s.arabic}>{q.arabic}</Text>
            <Text style={s.section}>{t(q.english)}</Text>
          </View>
          <View style={s.row}>
            {(questions[round]?.options ?? []).map((groupIndex) => {
              const letterGroup = groups[groupIndex];
              return (
                <Pressable
                  key={letterGroup.name}
                  accessibilityRole="button"
                  accessibilityLabel={t(letterGroup.name)}
                  disabled={answer !== null || !progress.ready}
                  onPress={() => choose(groupIndex)}
                  style={[
                    s.card,
                    {
                      flex: 1,
                      minWidth: 100,
                      alignItems: 'center',
                      backgroundColor:
                        answer === null
                          ? '#FFF'
                          : groupIndex === q.group
                            ? '#D9ECC5'
                            : answer === groupIndex
                              ? '#F9DBD1'
                              : '#FFF',
                      borderColor:
                        answer === groupIndex ? colors.green : '#E2E8D9',
                    },
                  ]}
                >
                  <Text style={{ fontSize: 50, color: colors.ink }}>
                    {letterGroup.letter}
                  </Text>
                  <Text style={s.sub}>{t(letterGroup.name)}</Text>
                </Pressable>
              );
            })}
          </View>
          {answer !== null && (
            <View style={s.card}>
              <Text accessibilityRole="alert" style={s.section}>
                {correct
                  ? t('You found it! ★ +1')
                  : t('Good try! It’s {letter} ({arabic}).', {
                      letter: t(groups[q.group].name),
                      arabic: groups[q.group].letter,
                    })}
              </Text>
              <Text style={s.sub}>
                {correct
                  ? t('One more little discovery.')
                  : t('Look at the first letter on the right of the word.')}
              </Text>
              <Button
                onPress={() => {
                  if (round === 4) setFinished(true);
                  else {
                    setRound(round + 1);
                    setAnswer(null);
                    locked.current = false;
                  }
                }}
              >
                {round === 4 ? t('See my stars') : t('Next question →')}
              </Button>
            </View>
          )}
        </>
      )}
    </Shell>
  );
}
