import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shell, s, colors } from '../src/ui';
import { arabicNumbers } from '../src/number-data';
import { useLanguage } from '../src/language';

export default function Numbers() {
  const { t } = useLanguage();
  return (
    <Shell>
      <Text accessibilityRole="header" style={[s.title, styles.title]}>
        {t('Numbers')}
      </Text>
      <View style={styles.grid}>
        {arabicNumbers.map((number) => (
          <View key={number.value} style={[s.card, styles.card]}>
            <Text style={styles.numeral}>{number.value}</Text>
            <Text style={[s.arabic, styles.word]}>{number.arabic}</Text>
          </View>
        ))}
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 48, textAlign: 'center' },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 16 },
  card: {
    flexGrow: 1,
    flexBasis: 220,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#EDF5FC',
  },
  numeral: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    writingDirection: 'ltr',
  },
  word: { fontSize: 40, lineHeight: 72 },
});
