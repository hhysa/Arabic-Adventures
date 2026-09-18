import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { colorAudio } from '../src/color-audio';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Shell, Button, s, colors } from '../src/ui';
import { useLanguage } from '../src/language';
import { arabicColors } from '../src/color-data';
import { makeColorQuiz } from '../src/color-quiz';
import { arabicFont } from '../src/typography';
import { SpeakerIcon } from '../src/SpeakerIcon';

export default function Colors() {
  const { t } = useLanguage();
  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
  const [audioError, setAudioError] = useState(false);
  useFocusEffect(useCallback(() => () => player.pause(), [player]));

  function playColor(id: string) {
    try {
      player.pause();
      player.replace(colorAudio[id]);
      player.play();
      setAudioError(false);
    } catch {
      setAudioError(true);
    }
  }

  const [questions, setQuestions] = useState<ReturnType<typeof makeColorQuiz>>(
    [],
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<string[]>([]);
  const question = questions[index];
  const correct = !!question && attempts.includes(question.color.id);
  const practicing = questions.length > 0;

  function startPractice() {
    player.pause();
    setQuestions(makeColorQuiz());
    setIndex(0);
    setScore(0);
    setAttempts([]);
  }

  return (
    <Shell>
      <View style={{ gap: 12 }}>
        <Text style={s.eyebrow}>{t('Colors')}</Text>
        <Text style={s.title}>{t('Arabic colors')}</Text>
        <Text style={s.sub}>
          {t(
            'Learn each color’s Arabic name and practice matching it to a swatch.',
          )}
        </Text>
        <View style={s.row}>
          <Button
            secondary={practicing}
            onPress={() => {
              player.pause();
              setQuestions([]);
            }}
          >
            {t('Learn colors')}
          </Button>
          <Button secondary={!practicing} onPress={startPractice}>
            {t('Practice colors')}
          </Button>
        </View>
      </View>
      {audioError || playerStatus.error ? (
        <Text accessibilityRole="alert">
          {t('Audio could not play. Please try again.')}
        </Text>
      ) : null}
      {!practicing ? (
        <>
          <Text style={s.sub}>
            {t('Color names use the masculine singular form.')}
          </Text>
          <Text style={[s.sub, arabicFont]}>
            {t('Light = فَاتِح · Dark = دَاكِن')}
          </Text>
          <View style={styles.grid}>
            {arabicColors.map((color) => (
              <Pressable
                key={color.id}
                accessibilityRole="button"
                accessibilityLabel={t('Hear {word} in Arabic', {
                  word: t(color.english),
                })}
                onPress={() => playColor(color.id)}
                style={({ pressed }) => [
                  s.card,
                  styles.card,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <View
                  aria-hidden
                  style={[styles.swatch, { backgroundColor: color.hex }]}
                >
                  <View style={[styles.speaker, styles.swatchSpeaker]}>
                    <SpeakerIcon />
                  </View>
                </View>
                <Text style={[s.arabic, styles.arabic]}>{color.arabic}</Text>
                <Text style={styles.label}>{t(color.english)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : question ? (
        <View style={s.card}>
          <Text style={s.eyebrow}>
            {t('Question {number} of {total}', {
              number: index + 1,
              total: questions.length,
              score,
            })}
          </Text>
          <Text style={s.section}>
            {t('Match the Arabic name to a color.')}
          </Text>
          <Text style={[s.arabic, { fontSize: 48 }]}>
            {question.color.arabic}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('♫  Listen to the word')}
            onPress={() => playColor(question.color.id)}
            style={({ pressed }) => [
              styles.speaker,
              { alignSelf: 'center', opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <SpeakerIcon />
          </Pressable>
          <View style={styles.grid}>
            {question.options.map((option, optionIndex) => {
              const selected = attempts.includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityLabel={
                    t('Color option {number}', { number: optionIndex + 1 }) +
                    ': ' +
                    t(option.english)
                  }
                  accessibilityState={{ disabled: correct || selected }}
                  disabled={correct || selected}
                  onPress={() => {
                    if (!attempts.length && option.id === question.color.id)
                      setScore((value) => value + 1);
                    setAttempts((previous) => [...previous, option.id]);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    {
                      opacity:
                        selected && option.id !== question.color.id
                          ? 0.45
                          : pressed
                            ? 0.8
                            : 1,
                      borderColor: selected
                        ? option.id === question.color.id
                          ? colors.green
                          : '#AD4747'
                        : '#D7DFCA',
                    },
                  ]}
                >
                  <View
                    aria-hidden
                    style={[styles.swatch, { backgroundColor: option.hex }]}
                  />
                  <Text style={styles.label}>
                    {selected
                      ? option.id === question.color.id
                        ? '✓ '
                        : '× '
                      : ''}
                    {t(option.english)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text accessibilityLiveRegion="polite" style={styles.label}>
            {attempts.length
              ? t(correct ? 'Correct!' : 'Try another color.')
              : ''}
          </Text>
          <Button
            disabled={!correct}
            onPress={() => {
              player.pause();
              setIndex((value) => value + 1);
              setAttempts([]);
            }}
          >
            {t(
              index === questions.length - 1 ? 'See results →' : 'Next color →',
            )}
          </Button>
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.section}>{t('Practice complete!')}</Text>
          <Text style={s.sub}>
            {t('{score} of {total} correct on the first try', {
              score,
              total: questions.length,
            })}
          </Text>
          <Button onPress={startPractice}>{t('Practice again')}</Button>
        </View>
      )}
    </Shell>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: { flexGrow: 1, flexBasis: 220, alignItems: 'center', padding: 18 },
  swatch: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#00000026',
  },
  arabic: { fontSize: 32, lineHeight: 54 },
  speaker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D7DFCA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSpeaker: { position: 'absolute', right: -8, bottom: -2 },
  label: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  option: {
    flexGrow: 1,
    flexBasis: 220,
    gap: 12,
    borderWidth: 3,
    borderRadius: 22,
    padding: 12,
  },
});
