import React from 'react';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { arabicFonts } from '../src/typography';
import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ProgressProvider } from '../src/progress';
import { LanguageProvider } from '../src/language';
export default function Layout() {
  const [fontsLoaded, fontError] = useFonts(arabicFonts);
  // Keep web prerendering available; native screens wait for their bundled font.
  if (Platform.OS !== 'web' && !fontsLoaded && !fontError) return null;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7EB' }}>
        <LanguageProvider>
          <ProgressProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F5F7EB' },
              }}
            />
          </ProgressProvider>
        </LanguageProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
