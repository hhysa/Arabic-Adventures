import { LanguageSwitcher } from '../../src/LanguageSwitcher';
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
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
    [error, setError] = useState(''),
    [showCompletion, setShowCompletion] = useState(false);
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
    next = groups[(lesson.group + 1) % groups.length].words[0];
  const levelDone = letterGroup.words.every((word) =>
    progress.completed.includes(word.id),
  );
  const boardWidth = Math.min(width - 20, 780);
  function closeCompletion() {
    setShowCompletion(false);
    player.pause();
  }
  function nextLetter() {
    closeCompletion();
    router.replace(`/lesson/${next.id}`);
  }
  function finishLetter() {
    if (!progress.ready || levelDone || showCompletion) return;
    letterGroup.words.forEach((word) => progress.complete(word.id));
    setShowCompletion(true);
    try {
      player.pause();
      player.replace(require('../../assets/audio/MashaAllah.mp3'));
      player.play();
      setError('');
    } catch {
      setError('Audio could not play. Please try again.');
    }
  }
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
            {levelDone
              ? t('Your progress is saved.')
              : t('Finish both words to complete this letter.')}
          </Text>
          <Button
            disabled={!progress.ready}
            onPress={levelDone ? nextLetter : finishLetter}
          >
            {levelDone ? t('Next letter →') : t('I learned this letter!')}
          </Button>
        </View>
      </ScrollView>
      <Modal
        visible={showCompletion}
        transparent
        animationType="fade"
        onRequestClose={closeCompletion}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(28, 48, 25, 0.55)',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          >
            <View
              accessibilityViewIsModal
              style={[
                s.card,
                {
                  width: '100%',
                  maxWidth: 440,
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FFF0BA',
                },
              ]}
            >
              <Text aria-hidden style={{ fontSize: 44 }}>
                🏆
              </Text>
              <Text
                accessibilityRole="header"
                style={[s.section, { textAlign: 'center' }]}
              >
                {t('MashaAllah!')}
              </Text>
              <Text style={[s.section, { textAlign: 'center' }]}>
                {t('Level {number} complete!', { number: lesson.group + 1 })}
              </Text>
              <Text aria-hidden style={{ fontSize: 36, color: '#AF7A15' }}>
                ★★★
              </Text>
              <Text style={[s.sub, { textAlign: 'center' }]}>
                {t('Both words discovered. Your next adventure is waiting.')}
              </Text>
              {error ? <Text accessibilityRole="alert">{t(error)}</Text> : null}
              <Button onPress={nextLetter}>{t('Next letter →')}</Button>
              <Button secondary onPress={closeCompletion}>
                {t('Keep practicing')}
              </Button>
              <Button
                secondary
                onPress={() => {
                  closeCompletion();
                  router.push('/levels');
                }}
              >
                {t('Back to the level map →')}
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
