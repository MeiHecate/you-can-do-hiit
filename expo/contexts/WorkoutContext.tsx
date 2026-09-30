import React, { useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import * as Notifications from 'expo-notifications';
import { CompletedWorkout, WorkoutSettings } from '@/types/exercise';
import { translations } from '@/constants/i18n';
import type { Language } from '@/constants/i18n';
import { toDateKey, startOfWeek } from '@/utils/date';

const STORAGE_KEYS = {
  COMPLETED_WORKOUTS: 'completed_workouts',
  SETTINGS: 'workout_settings',
  STREAK: 'workout_streak',
  FAVORITES: 'favorite_exercises',
};

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
}

const DEFAULT_SETTINGS: WorkoutSettings = {
  notificationsEnabled: false,
  reminderHour: 8,
  reminderMinute: 0,
  dailyGoalMinutes: 5,
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
};


function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return toDateKey(yesterday) === dateStr;
}

function isToday(dateStr: string): boolean {
  return toDateKey() === dateStr;
}

export const [WorkoutProvider, useWorkout] = createContextHook(() => {
  const queryClient = useQueryClient();

  const workoutsQuery = useQuery({
    queryKey: ['completedWorkouts'],
    queryFn: async (): Promise<CompletedWorkout[]> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_WORKOUTS);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const settingsQuery = useQuery({
    queryKey: ['workoutSettings'],
    queryFn: async (): Promise<WorkoutSettings> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    },
  });

  const favoritesQuery = useQuery({
    queryKey: ['favoriteExercises'],
    queryFn: async (): Promise<string[]> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      const current = favoritesQuery.data ?? [];
      const updated = current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : [...current, exerciseId];
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['favoriteExercises'], data);
    },
  });

  const streakQuery = useQuery({
    queryKey: ['streakData'],
    queryFn: async (): Promise<StreakData> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
      if (!stored) return DEFAULT_STREAK;
      const data: StreakData = JSON.parse(stored);
      if (data.lastWorkoutDate && !isToday(data.lastWorkoutDate) && !isYesterday(data.lastWorkoutDate)) {
        const reset = { ...DEFAULT_STREAK, longestStreak: data.longestStreak };
        await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(reset));
        return reset;
      }
      return data;
    },
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: async (workout: CompletedWorkout) => {
      const current = workoutsQuery.data ?? [];
      const updated = [workout, ...current];
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_WORKOUTS, JSON.stringify(updated));

      const currentStreak = streakQuery.data ?? DEFAULT_STREAK;
      const today = toDateKey();
      let newStreak: StreakData;

      if (currentStreak.lastWorkoutDate === today) {
        newStreak = currentStreak;
      } else {
        const streakCount = (currentStreak.lastWorkoutDate && (isYesterday(currentStreak.lastWorkoutDate) || isToday(currentStreak.lastWorkoutDate)))
          ? currentStreak.currentStreak + 1
          : 1;
        newStreak = {
          currentStreak: streakCount,
          longestStreak: Math.max(streakCount, currentStreak.longestStreak),
          lastWorkoutDate: today,
        };
      }

      await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(newStreak));
      return { workouts: updated, streak: newStreak };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['completedWorkouts'], data.workouts);
      queryClient.setQueryData(['streakData'], data.streak);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: WorkoutSettings) => {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      if (newSettings.notificationsEnabled) {
        await scheduleNotification(newSettings.reminderHour, newSettings.reminderMinute);
      } else {
        await cancelNotifications();
      }
      return newSettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['workoutSettings'], data);
    },
  });

  const favorites = useMemo(() => favoritesQuery.data ?? [], [favoritesQuery.data]);
  const completedWorkouts = useMemo(() => workoutsQuery.data ?? [], [workoutsQuery.data]);
  const settings = useMemo(() => settingsQuery.data ?? DEFAULT_SETTINGS, [settingsQuery.data]);
  const streak = useMemo(() => streakQuery.data ?? DEFAULT_STREAK, [streakQuery.data]);

  const todayCompleted = useMemo(() => {
    const today = toDateKey();
    return completedWorkouts.some((w) => w.date === today);
  }, [completedWorkouts]);

  const thisWeekWorkouts = useMemo(() => {
    const monday = toDateKey(startOfWeek());
    return completedWorkouts.filter((w) => w.date >= monday);
  }, [completedWorkouts]);

  const totalWorkouts = completedWorkouts.length;
  const totalMinutes = useMemo(
    () => Math.round(completedWorkouts.reduce((acc, w) => acc + w.totalDuration, 0) / 60),
    [completedWorkouts]
  );
  const totalCalories = useMemo(
    () => completedWorkouts.reduce((acc, w) => acc + w.totalCalories, 0),
    [completedWorkouts]
  );

  const toggleFavorite = useCallback(
    (exerciseId: string) => toggleFavoriteMutation.mutate(exerciseId),
    [toggleFavoriteMutation]
  );

  const isFavorite = useCallback(
    (exerciseId: string) => favorites.includes(exerciseId),
    [favorites]
  );

  const completeWorkout = useCallback(
    (workout: CompletedWorkout) => completeWorkoutMutation.mutate(workout),
    [completeWorkoutMutation]
  );

  const updateSettings = useCallback(
    (newSettings: WorkoutSettings) => updateSettingsMutation.mutate(newSettings),
    [updateSettingsMutation]
  );

  const isLoading = workoutsQuery.isLoading || settingsQuery.isLoading || streakQuery.isLoading || favoritesQuery.isLoading;

  return {
    completedWorkouts,
    favorites,
    toggleFavorite,
    isFavorite,
    settings,
    streak,
    todayCompleted,
    thisWeekWorkouts,
    totalWorkouts,
    totalMinutes,
    totalCalories,
    completeWorkout,
    updateSettings,
    isLoading,
  };
});

async function scheduleNotification(hour: number, minute: number) {
  if (Platform.OS === 'web') return;
  try {
    const storedLang = await AsyncStorage.getItem('app_language');
    const lang: Language = (storedLang === 'fr' || storedLang === 'en') ? storedLang : 'en';
    const t = translations[lang];
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t.notifications.title,
        body: t.notifications.body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch {
    // Notification scheduling can fail if permissions were revoked; nothing to recover here.
  }
}

async function cancelNotifications() {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Cancelling is best-effort; a failure here shouldn't block the caller.
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    return false;
  }
}
