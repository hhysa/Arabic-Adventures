import { LanguageSwitcher } from '../../src/LanguageSwitcher';
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';
import { Button, s } from '../../src/ui';
import { groups, lessons } from '../../src/data';
import { useProgress } from '../../src/progress';
import { useLanguage } from '../../src/language';
import { audio } from '../../src/audio';
import { LessonBoard } from '../../src/LessonBoard';
export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}
export default function Lesson() {
  const { t, error: languageError } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>(),
    lesson = lessons.find((l) => l.id === id),
    progress = useProgress();
  const { width } = useWindowDimensions(),
    [error, setError] = useState('');
  const player = useAudioPlayer(null);
  if (!lesson)
    return (
      <View style={[s.card, { margin: 24 }]}>
        <Text style={s.title}>{t('Let’s find your lesson')}</Text>
        <Button onPress={() => router.replace('/')}>
          {t('Go to learning trail')}
        </Button>
      </View>
    );
  const letterGroup = groups[lesson.group],
    done = progress.completed.includes(lesson.id),
    next = groups[(lesson.group + 1) % groups.length].words[0];
  const levelDone = letterGroup.words.every((word) =>
    progress.completed.includes(word.id),
  );
  const boardWidth = Math.min(width - 20, 780);
  function play(wordId: string) {
    try {
      player.pause();
      player.replace(audio[wordId]);
      player.play();
      setError('');
    } catch {
      setError('Audio could not play. Please try again.');
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#E2E7DC' }}>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 36 }}
      >
        <View
          style={{
            width: boardWidth,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/levels')}
            style={{ paddingVertical: 12 }}
          >
            <Text style={s.back}>{t('← Level map')}</Text>
          </Pressable>
          <LanguageSwitcher />
        </View>
        <LessonBoard
          group={lesson.group}
          words={letterGroup.words}
          width={boardWidth}
          onPlay={play}
          onColor={(wordId) => router.push(`/coloring?id=${wordId}`)}
        />
        <View
          style={{
            width: boardWidth,
            gap: 16,
            paddingTop: 20,
            paddingHorizontal: 8,
          }}
        >
          {error || progress.error || languageError ? (
            <Text accessibilityRole="alert">
              {t(error || progress.error || languageError)}
            </Text>
          ) : null}
          {'أدذرزو'.includes(letterGroup.letter) && (
            <Text style={s.sub}>
              {t(
                'This letter joins to the letter before it, but never to the letter after it.',
              )}
            </Text>
          )}
          <Text
            accessibilityRole="alert"
            style={[s.sub, { textAlign: 'center' }]}
          >
            {done
              ? t('Your three stars are saved.')
              : t('Finish this lesson to collect three stars.')}
          </Text>
          {levelDone && (
            <View
              style={[
                s.card,
                { alignItems: 'center', backgroundColor: '#FFF0BA' },
              ]}
            >
              <Text style={{ fontSize: 44 }}>🏆</Text>
              <Text style={s.section}>
                {t('Level {number} complete!', { number: lesson.group + 1 })}
              </Text>
              <Text style={[s.sub, { textAlign: 'center' }]}>
                {t('Both words discovered. Your next adventure is waiting.')}
              </Text>
              <Button onPress={() => router.push('/levels')}>
                {t('Back to the level map →')}
              </Button>
            </View>
          )}
          <Button
            disabled={!progress.ready}
            onPress={() => {
              if (!done) progress.complete(lesson.id);
              else router.replace(`/lesson/${next.id}`);
            }}
          >
            {done ? t('Next letter →') : t('I learned this word!  ★ +3')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
