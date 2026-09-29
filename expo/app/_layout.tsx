import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WorkoutProvider, useWorkout } from '@/contexts/WorkoutContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function AppReady() {
  const { isLoading: workoutLoading } = useWorkout();
  const { isLoading: languageLoading } = useLanguage();
  const [splashHidden, setSplashHidden] = useState(false);

  useEffect(() => {
    if (!workoutLoading && !languageLoading && !splashHidden) {
      SplashScreen.hideAsync()
        .then(() => setSplashHidden(true))
        .catch(() => setSplashHidden(true));
    }
  }, [workoutLoading, languageLoading, splashHidden]);

  if (!splashHidden && (workoutLoading || languageLoading)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
      </View>
    );
  }

  return <RootLayoutNav />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <WorkoutProvider>
            <AppReady />
          </WorkoutProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
