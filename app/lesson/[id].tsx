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
import { Button, s, colors } from '../../src/ui';
import { groups, lessons, bonusOrange } from '../../src/data';
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
    next = lessons[(lessons.indexOf(lesson) + 1) % lessons.length];
  const groupWords = lessons.filter((word) => word.group === lesson.group);
  const words =
    letterGroup.letter === 'ب'
      ? [lesson.id === 'door' ? lesson : groupWords[0], bonusOrange]
      : groupWords;
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
            onPress={() => router.push('/')}
            style={{ paddingVertical: 12 }}
          >
            <Text style={s.back}>{t('← Your learning trail')}</Text>
          </Pressable>
          <LanguageSwitcher />
        </View>
        <LessonBoard
          group={lesson.group}
          words={words}
          width={boardWidth}
          onPlay={play}
        />
        <View
          style={{
            width: boardWidth,
            gap: 16,
            paddingTop: 20,
            paddingHorizontal: 8,
          }}
        >
          <Text style={[s.sub, { textAlign: 'center' }]}>
            {t('Tap a picture or word to hear it in Arabic.')}
          </Text>
          {error || progress.error || languageError ? (
            <Text accessibilityRole="alert">
              {t(error || progress.error || languageError)}
            </Text>
          ) : null}
          <View style={[s.row, { justifyContent: 'center' }]}>
            {letterGroup.words.map((word) => (
              <Button
                key={word.id}
                secondary={lesson.id !== word.id}
                onPress={() => router.replace(`/lesson/${word.id}`)}
              >
                {t(word.english)}{' '}
                {progress.completed.includes(word.id) ? '✓' : ''}
              </Button>
            ))}
          </View>
          {'أدذرزو'.includes(letterGroup.letter) && (
            <Text style={s.sub}>
              {t(
                'This letter joins to the letter before it, but never to the letter after it.',
              )}
            </Text>
          )}
          <View style={[s.row, { justifyContent: 'center' }]}>
            <Button secondary onPress={() => play(lesson.id)}>
              {t('♫  Listen to the word')}
            </Button>
            <Button
              secondary
              onPress={() => router.push(`/coloring?id=${lesson.id}`)}
            >
              {t('✎  Let’s color')}
            </Button>
          </View>
          <Text
            accessibilityRole="alert"
            style={[s.sub, { textAlign: 'center' }]}
          >
            {done
              ? t('Your three stars are saved.')
              : t('Finish this lesson to collect three stars.')}
          </Text>
          <Button
            disabled={!progress.ready}
            onPress={() => {
              if (!done) progress.complete(lesson.id);
              else router.replace(`/lesson/${next.id}`);
            }}
          >
            {done ? t('Next word →') : t('I learned this word!  ★ +3')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
