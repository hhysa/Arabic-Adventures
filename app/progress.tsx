import { useLanguage } from '../src/language';
import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Shell, Button, s, colors } from '../src/ui';
import { groups, lessons } from '../src/data';
import { useProgress, streak } from '../src/progress';
export default function Progress() {
  const { t } = useLanguage();
  const progress = useProgress();
  return (
    <Shell>
      <Text style={s.eyebrow}>{t('EVERY LITTLE STEP COUNTS')}</Text>
      <Text style={s.title}>{t('Your adventure so far')}</Text>
      <View
        style={[
          s.card,
          { backgroundColor: '#FFF1C7', alignItems: 'center', padding: 36 },
        ]}
      >
        <Text style={{ fontSize: 65 }}>🌟</Text>
        <Text style={s.title}>
          {t('{count} stars collected', { count: progress.stars })}
        </Text>
        <Text style={s.sub}>
          {t('{count} of {total} lessons · {days} day streak', {
            count: progress.completed.length,
            total: lessons.length,
            days: streak(progress.days),
          })}
        </Text>
      </View>
      <Text style={s.section}>{t('Look what you’ve discovered')}</Text>
      {groups.map((letterGroup) => (
        <View key={t(letterGroup.name)} style={s.card}>
          <View style={s.row}>
            <Text style={{ fontSize: 40, color: colors.green }}>
              {letterGroup.letter}
            </Text>
            <Text style={s.section}>{t(letterGroup.name)}</Text>
          </View>
          {letterGroup.words.map((word) => (
            <View
              key={word.id}
              style={[s.row, { justifyContent: 'space-between' }]}
            >
              <Text style={{ fontSize: 17, color: colors.ink }}>
                {word.emoji} {t(word.english)} · {word.arabic}
              </Text>
              <Button
                secondary
                onPress={() => router.push(`/lesson/${word.id}`)}
              >
                {progress.completed.includes(word.id)
                  ? t('★ ★ ★  Revisit')
                  : t('Explore →')}
              </Button>
            </View>
          ))}
        </View>
      ))}
      <Text style={s.sub}>
        {t('Your progress stays on this device. No account needed.')}
      </Text>
    </Shell>
  );
}
