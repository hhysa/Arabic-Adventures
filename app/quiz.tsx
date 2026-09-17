import { makeQuiz, QUIZ_LENGTH } from '../src/quiz';
import { useLanguage } from '../src/language';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { arabicFont } from '../src/typography';
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
  const question = questions[round],
    q = question?.word ?? lessons[0],
    isImageQuestion = question?.kind === 'image',
    correct = answer === question?.correctOption,
    isLastQuestion = round === questions.length - 1;
  function choose(i: number) {
    if (locked.current || !progress.ready || !questions.length) return;
    locked.current = true;
    setAnswer(i);
    if (i === question.correctOption) {
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
          : isImageQuestion
            ? t('How do you say this in Arabic?')
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
          <Text style={s.title}>
            {t('{score} of {total} discovered', { score, total: QUIZ_LENGTH })}
          </Text>
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
            {t('Question {number} of {total} · {score} stars this round', {
              number: round + 1,
              total: QUIZ_LENGTH,
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
            {(!isImageQuestion || answer !== null) && (
              <>
                <Text style={[s.arabic, arabicFont]}>{q.arabic}</Text>
                <Text style={s.section}>{t(q.english)}</Text>
              </>
            )}
          </View>
          <View style={s.row}>
            {(questions[round]?.options ?? []).map((groupIndex) => {
              const option = isImageQuestion
                ? lessons[groupIndex]
                : groups[groupIndex];
              const optionArabic =
                'arabic' in option ? option.arabic : option.letter;
              const optionName = 'name' in option ? option.name : null;
              return (
                <Pressable
                  key={groupIndex}
                  accessibilityRole="button"
                  accessibilityLabel={optionName ? t(optionName) : optionArabic}
                  disabled={answer !== null || !progress.ready}
                  onPress={() => choose(groupIndex)}
                  style={[
                    s.card,
                    {
                      flex: 1,
                      minWidth: isImageQuestion ? 140 : 100,
                      alignItems: 'center',
                      backgroundColor:
                        answer === null
                          ? '#FFF'
                          : groupIndex === question.correctOption
                            ? '#D9ECC5'
                            : answer === groupIndex
                              ? '#F9DBD1'
                              : '#FFF',
                      borderColor:
                        answer === groupIndex ? colors.green : '#E2E8D9',
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: isImageQuestion ? 36 : 50,
                        color: colors.ink,
                      },
                      arabicFont,
                    ]}
                  >
                    {optionArabic}
                  </Text>
                  {optionName && (
                    <Text style={[s.sub, arabicFont]}>{t(optionName)}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
          {answer !== null && (
            <View style={s.card}>
              <Text
                accessibilityRole="alert"
                style={[s.section, !correct && arabicFont]}
              >
                {correct
                  ? t('You found it! ★ +1')
                  : isImageQuestion
                    ? t('Good try! It’s {arabic}.', { arabic: q.arabic })
                    : t('Good try! It’s {letter} ({arabic}).', {
                        letter: t(groups[q.group].name),
                        arabic: groups[q.group].letter,
                      })}
              </Text>
              <Text style={s.sub}>
                {correct
                  ? t('One more little discovery.')
                  : isImageQuestion
                    ? t('Match the picture to its Arabic word.')
                    : t('Look at the first letter on the right of the word.')}
              </Text>
              <Button
                onPress={() => {
                  if (isLastQuestion) setFinished(true);
                  else {
                    setRound(round + 1);
                    setAnswer(null);
                    locked.current = false;
                  }
                }}
              >
                {isLastQuestion ? t('See my stars') : t('Next question →')}
              </Button>
            </View>
          )}
        </>
      )}
    </Shell>
  );
}
