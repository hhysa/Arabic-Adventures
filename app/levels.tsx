import { arabicFont } from '../src/typography';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Shell, Button, s, colors } from '../src/ui';
import { useProgress } from '../src/progress';
import { useLanguage } from '../src/language';
import { getLevels } from '../src/levels';

export default function Levels() {
  const { t } = useLanguage(),
    progress = useProgress(),
    levels = getLevels(progress.completed);
  const current = levels.find((level) => !level.complete);
  return (
    <Shell>
      <Text style={s.eyebrow}>{t('YOUR ADVENTURE MAP')}</Text>
      <Text style={s.title}>{t('One letter. One new level.')}</Text>
      <Text style={s.sub}>
        {t(
          'Finish both words to complete a level. You can explore or replay any letter.',
        )}
      </Text>
      <View style={[s.card, { backgroundColor: '#E4EECB' }]}>
        <Text style={s.section}>
          {t('{count} of {total} levels complete', {
            count: levels.filter((l) => l.complete).length,
            total: levels.length,
          })}
        </Text>
        <Button
          disabled={!progress.ready}
          onPress={() =>
            router.push(`/lesson/${(current ?? levels[0]).nextWord.id}`)
          }
        >
          {current
            ? t('Continue level {number} →', { number: current.number })
            : t('Play again')}
        </Button>
      </View>
      <View style={styles.path}>
        {levels.map((level, i) => {
          const isCurrent = level.index === current?.index;
          return (
            <View
              key={level.group.letter}
              style={{ width: '100%', alignItems: 'center' }}
            >
              {i > 0 && (
                <View
                  style={{
                    height: 34,
                    borderLeftWidth: 5,
                    borderStyle: 'dotted',
                    borderColor: '#A8BB8B',
                    marginLeft: i % 2 ? 30 : -30,
                  }}
                />
              )}
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: i % 2 ? 100 : -100,
                  gap: 7,
                }}
              >
                {isCurrent && (
                  <Text style={styles.flag}>{t('YOU ARE HERE')}</Text>
                )}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t(
                    'Level {number}: {letter}, {count} of 2 words',
                    {
                      number: level.number,
                      letter: t(level.group.name),
                      count: level.count,
                    },
                  )}
                  disabled={!progress.ready}
                  onPress={() => router.push(`/lesson/${level.nextWord.id}`)}
                  style={({ pressed }) => [
                    styles.node,
                    {
                      backgroundColor: level.complete
                        ? '#F6CE56'
                        : isCurrent
                          ? '#63954C'
                          : '#FFFFFF',
                      borderColor: level.complete
                        ? '#C3982E'
                        : isCurrent
                          ? '#3B6630'
                          : '#BCCCA9',
                      transform: [{ translateY: pressed ? 4 : 0 }],
                      opacity: progress.ready ? 1 : 0.6,
                    },
                  ]}
                >
                  <Text
                    style={{
                      ...arabicFont,
                      fontSize: 49,
                      color: isCurrent ? '#FFF' : colors.ink,
                    }}
                  >
                    {level.group.letter}
                  </Text>
                  <View style={styles.number}>
                    <Text
                      style={{
                        fontWeight: '900',
                        color: colors.ink,
                        fontSize: 13,
                      }}
                    >
                      {level.number}
                    </Text>
                  </View>
                </Pressable>
                <Text
                  style={{
                    fontSize: 17,
                    ...arabicFont,
                    color: colors.ink,
                  }}
                >
                  {t(level.group.name)}
                </Text>
                <Text
                  style={{
                    fontSize: 21,
                    color: '#AF7A15',
                    letterSpacing: 4,
                  }}
                >
                  {level.count >= 1 ? '★' : '☆'}
                  {level.count >= 2 ? '★' : '☆'}
                  {level.complete ? '★' : '☆'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Shell>
  );
}
const styles = StyleSheet.create({
  path: {
    backgroundColor: '#E7F0CB',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: '#DCE4CD',
    width: '100%',
    maxWidth: 670,
    alignSelf: 'center',
  },
  node: {
    height: 94,
    width: 100,
    borderRadius: 32,
    borderBottomWidth: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    position: 'absolute',
    right: -7,
    top: -8,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#FFF4D0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C4AD6B',
  },
  flag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    backgroundColor: '#3F7039',
    color: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
});
