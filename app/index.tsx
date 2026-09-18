import { arabicFont } from '../src/typography';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Shell, Button, s, colors } from '../src/ui';
import { useLanguage } from '../src/language';
import { useProgress, streak } from '../src/progress';
import { getLevels } from '../src/levels';

export default function Home() {
  const { t } = useLanguage(),
    progress = useProgress(),
    levels = getLevels(progress.completed);
  const current = levels.find((level) => !level.complete),
    finished = levels.filter((level) => level.complete).length;
  return (
    <Shell>
      <View style={styles.stage}>
        <Text style={styles.kicker}>
          {t('YOUR NEXT ADVENTURE STARTS HERE')}
        </Text>
        <View style={styles.emblem}>
          <Text
            style={{ fontSize: 25, position: 'absolute', left: 5, top: 12 }}
          >
            ✦
          </Text>
          <Text style={[arabicFont, { fontSize: 105, color: '#365C36' }]}>
            {current?.group.letter ?? '★'}
          </Text>
          <Text
            style={{ fontSize: 28, position: 'absolute', right: 0, bottom: 10 }}
          >
            🌟
          </Text>
        </View>
        <Text style={[s.title, { textAlign: 'center', fontSize: 40 }]}>
          {t('Little explorer, big adventure!')}
        </Text>
        <Text
          style={[
            s.sub,
            { textAlign: 'center', maxWidth: 450, color: '#526D43' },
          ]}
        >
          {t('28 letter levels. A whole alphabet to discover.')}
        </Text>
        <View style={{ width: '100%', maxWidth: 360, gap: 12, marginTop: 10 }}>
          <Button
            disabled={!progress.ready}
            onPress={() =>
              progress.completed.length && current
                ? router.push(`/lesson/${current.nextWord.id}`)
                : router.push('/levels')
            }
          >
            {progress.completed.length && current
              ? t('Continue adventure →')
              : t('Let’s play! →')}
          </Button>
          <Button secondary onPress={() => router.push('/levels')}>
            {t('Explore the level map')}
          </Button>
        </View>
        <Text style={[{ fontSize: 14, color: '#567346' }, arabicFont]}>
          {current
            ? t('Next stop: level {number} · {letter}', {
                number: current.number,
                letter: t(current.group.name),
              })
            : t('You discovered the whole alphabet!')}
        </Text>
      </View>
      <View style={[s.row, { justifyContent: 'center' }]}>
        {[
          ['★', progress.stars, t('Stars collected')],
          ['⚑', `${finished}/28`, t('Levels complete')],
          ['🔥', streak(progress.days), t('Day streak')],
        ].map(([icon, value, label]) => (
          <View key={label} style={styles.stat}>
            <Text style={{ fontSize: 24 }}>{icon}</Text>
            <Text
              style={{ fontSize: 26, fontWeight: '900', color: colors.ink }}
            >
              {value}
            </Text>
            <Text
              style={{ fontSize: 12, color: colors.muted, textAlign: 'center' }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
      <View style={[s.card, { backgroundColor: '#F2EAFB' }]}>
        <Text style={s.eyebrow}>{t('Colors')}</Text>
        <Text style={s.section}>{t('Colors. A rainbow of new words.')}</Text>
        <Text style={s.sub}>
          {t(
            'Learn each color’s Arabic name and practice matching it to a swatch.',
          )}
        </Text>
        <Button onPress={() => router.push('/colors')}>
          {t('Explore colors →')}
        </Button>
      </View>
      <View style={[s.card, { backgroundColor: '#EDF5FC' }]}>
        <Text style={s.eyebrow}>{t('Numbers')}</Text>
        <Text style={s.section}>{t('Numbers. Every number has a name.')}</Text>
        <Text style={s.sub}>
          {t('Discover Arabic numbers and tap each card to hear its name.')}
        </Text>
        <Button onPress={() => router.push('/numbers')}>
          {t('Explore numbers →')}
        </Button>
      </View>
      <View
        style={[
          s.card,
          {
            backgroundColor: '#FFF1CC',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
      >
        <View style={{ gap: 6, flex: 1, minWidth: 190 }}>
          <Text style={s.eyebrow}>{t('BONUS CHALLENGE')}</Text>
          <Text style={s.section}>{t('Ten questions. More stars!')}</Text>
          <Text style={s.sub}>{t('Put your letter skills to the test.')}</Text>
        </View>
        <Button secondary onPress={() => router.push('/quiz')}>
          {t('Play quiz →')}
        </Button>
      </View>
    </Shell>
  );
}
const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#E4F0BE',
    borderRadius: 34,
    padding: 28,
    alignItems: 'center',
    gap: 18,
    borderWidth: 2,
    borderColor: '#D0DFA9',
    borderBottomWidth: 8,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: '900',
    color: '#54733D',
    textAlign: 'center',
  },
  emblem: {
    height: 167,
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7CC',
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#C4DA7E',
    transform: [{ rotate: '-5deg' }],
  },
  stat: {
    flex: 1,
    minWidth: 85,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E1E7D6',
  },
});
