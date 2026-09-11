import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from './language';
import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { useProgress } from './progress';
export const colors = {
  ink: '#263E32',
  green: '#447D45',
  bg: '#F5F7EB',
  muted: '#788273',
  lime: '#E9F3BA',
};
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: colors.ink }]}>
        {children}
      </Text>
    </Pressable>
  );
}
export function Shell({
  children,
  scrollEnabled = true,
}: {
  children: React.ReactNode;
  scrollEnabled?: boolean;
}) {
  const { t, error: languageError } = useLanguage();
  const path = usePathname(),
    progress = useProgress(),
    { width } = useWindowDimensions();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View
          style={[
            s.header,
            {
              paddingHorizontal: width < 600 ? 20 : 48,
              paddingVertical: 20,
              flexWrap: 'wrap',
            },
          ]}
        >
          <Pressable
            onPress={() => router.push('/')}
            accessibilityRole="link"
            style={{ flexShrink: 1 }}
          >
            <Text style={[s.brand, { fontSize: width < 600 ? 18 : 23 }]}>
              ✳ {t('Arabic Adventures')}
            </Text>
            <Text style={s.brandSub}>
              {t('LITTLE STEPS. BIG DISCOVERIES.')}
            </Text>
          </Pressable>
          <View style={[s.row, { gap: 10, flexWrap: 'wrap' }]}>
            <LanguageSwitcher />
            <View style={s.star}>
              <Text style={{ fontWeight: '800', color: colors.ink }}>
                ★ {progress.stars}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[s.container, { paddingHorizontal: width < 600 ? 20 : 40 }]}
        >
          {progress.error ? (
            <Text accessibilityRole="alert">{t(progress.error)}</Text>
          ) : null}
          {languageError ? (
            <Text accessibilityRole="alert">{t(languageError)}</Text>
          ) : null}
          {children}
        </View>
        <Text style={s.footer}>
          {t('Made for little explorers  ·  Learn at your own pace')}
        </Text>
      </ScrollView>
      <View style={[s.nav, { maxWidth: '96%' }]}>
        {[
          ['/', '⌂', t('Learn')],
          ['/quiz', '✦', t('Quiz')],
          ['/progress', '◷', t('My progress')],
        ].map(([href, icon, label]) => (
          <Pressable
            key={href}
            accessibilityRole="tab"
            accessibilityState={{ selected: path === href }}
            onPress={() => router.push(href as any)}
            style={[
              s.navItem,
              { paddingHorizontal: width < 400 ? 16 : 24 },
              path === href && { backgroundColor: '#E7EFD9' },
            ]}
          >
            <Text
              style={{
                color: path === href ? colors.green : colors.muted,
                fontSize: 22,
              }}
            >
              {icon}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: path === href ? colors.green : colors.muted,
              }}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
export const s = StyleSheet.create({
  header: {
    minHeight: 105,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E1E6D8',
    gap: 12,
  },
  brand: { fontSize: 23, fontWeight: '900', color: colors.ink },
  brandSub: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.muted,
    marginTop: 6,
  },
  star: {
    backgroundColor: '#FFF2C3',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
  },
  container: {
    width: '100%',
    maxWidth: 1160,
    alignSelf: 'center',
    paddingTop: 36,
    gap: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -1,
  },
  sub: { fontSize: 16, lineHeight: 25, color: colors.muted },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '800',
    color: colors.green,
  },
  section: { fontSize: 23, fontWeight: '800', color: colors.ink },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8D9',
    gap: 12,
  },
  button: {
    backgroundColor: colors.green,
    paddingVertical: 17,
    paddingHorizontal: 26,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: '#F0F3E7',
    borderWidth: 1,
    borderColor: '#D7DFCA',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  nav: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 26,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DEE5D3',
    boxShadow: '0 4px 25px #263e3212',
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignItems: 'center',
    gap: 3,
  },
  footer: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
    marginTop: 42,
  },
  arabic: {
    fontSize: 64,
    color: colors.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  back: { fontSize: 14, fontWeight: '700', color: colors.green },
});
