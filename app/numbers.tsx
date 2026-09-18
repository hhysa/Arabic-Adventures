import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { numberAudio } from '../src/number-audio';
import { SpeakerIcon } from '../src/SpeakerIcon';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Shell, s, colors } from '../src/ui';
import { arabicNumbers } from '../src/number-data';
import { useLanguage } from '../src/language';

export default function Numbers() {
  const { t } = useLanguage();
  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
  const [audioError, setAudioError] = useState(false);
  useFocusEffect(useCallback(() => () => player.pause(), [player]));

  function playNumber(value: number) {
    try {
      player.pause();
      player.replace(numberAudio[value]);
      player.play();
      setAudioError(false);
    } catch {
      setAudioError(true);
    }
  }

  return (
    <Shell>
      <Text accessibilityRole="header" style={[s.title, styles.title]}>
        {t('Numbers')}
      </Text>
      {audioError || playerStatus.error ? (
        <Text accessibilityRole="alert">
          {t('Audio could not play. Please try again.')}
        </Text>
      ) : null}
      <View style={styles.grid}>
        {arabicNumbers.map((number) => (
          <Pressable
            key={number.value}
            accessibilityRole="button"
            accessibilityLabel={t('Hear {word} in Arabic', {
              word: String(number.value),
            })}
            onPress={() => playNumber(number.value)}
            style={({ pressed }) => [
              s.card,
              styles.card,
              { opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <Text style={styles.numeral}>{number.value}</Text>
            <Text style={[s.arabic, styles.word]}>{number.arabic}</Text>
            <View aria-hidden style={styles.speaker}>
              <SpeakerIcon />
            </View>
          </Pressable>
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
  numeral: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    writingDirection: 'ltr',
  },
  word: { fontSize: 40, lineHeight: 72 },
});
