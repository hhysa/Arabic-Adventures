import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLanguage } from './language';

export const languageOptions = [
  ['sq', 'Shqip'],
  ['en', 'English'],
] as const;

export function LanguageSwitcher() {
  const { language, setLanguage, ready, t } = useLanguage();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t('Language')}
      style={{
        flexDirection: 'row',
        backgroundColor: '#E7EFD9',
        borderRadius: 14,
        padding: 4,
      }}
    >
      {languageOptions.map(([code, label]) => (
        <Pressable
          key={code}
          accessibilityRole="radio"
          accessibilityLabel={label}
          accessibilityState={{ checked: language === code, disabled: !ready }}
          disabled={!ready}
          onPress={() => setLanguage(code)}
          style={{
            minHeight: 44,
            paddingHorizontal: 14,
            justifyContent: 'center',
            borderRadius: 11,
            backgroundColor: language === code ? '#447D45' : 'transparent',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: language === code ? '#FFF' : '#263E32',
            }}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
