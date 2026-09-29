import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, Clock, Flame as FlameIcon, Trophy, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateDailyWorkout, motivationalQuotes, getTranslatedExercise } from '@/mocks/exercises';
import { getExerciseIcon } from '@/utils/icons';
import { Exercise, CompletedWorkout } from '@/types/exercise';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { streak, todayCompleted, completeWorkout } = useWorkout();
  const { t, language } = useLanguage();
  const [dailyExercises, setDailyExercises] = useState<Exercise[]>(() => generateDailyWorkout(5));
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const quote = useMemo(() => {
    const quotes = motivationalQuotes[language];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [language]);

  const totalDuration = useMemo(
    () => dailyExercises.reduce((acc, e) => acc + e.duration, 0),
    [dailyExercises]
  );

  const totalCalories = useMemo(
    () => dailyExercises.reduce((acc, e) => acc + e.calories, 0),
    [dailyExercises]
  );

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (!activeWorkout || workoutComplete) return;

    if (timeLeft <= 0) {
      if (isResting) {
        setIsResting(false);
        const nextIndex = currentExerciseIndex + 1;
        if (nextIndex >= dailyExercises.length) {
          finishWorkout();
          return;
        }
        setCurrentExerciseIndex(nextIndex);
        setTimeLeft(dailyExercises[nextIndex].duration);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        if (currentExerciseIndex < dailyExercises.length - 1) {
          setIsResting(true);
          setTimeLeft(10);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          finishWorkout();
        }
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const exerciseDuration = isResting ? 10 : dailyExercises[currentExerciseIndex]?.duration ?? 30;
    Animated.timing(progressAnim, {
      toValue: 1 - timeLeft / exerciseDuration,
      duration: 300,
      useNativeDriver: false,
    }).start();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, activeWorkout, isResting, currentExerciseIndex, workoutComplete]);

  const startWorkout = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setActiveWorkout(true);
    setCurrentExerciseIndex(0);
    setTimeLeft(dailyExercises[0].duration);
    setIsResting(false);
    setWorkoutComplete(false);
    progressAnim.setValue(0);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [dailyExercises, progressAnim, slideAnim]);

  const finishWorkout = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setWorkoutComplete(true);
    setActiveWorkout(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const workout: CompletedWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      exercises: dailyExercises,
      totalDuration: totalDuration,
      totalCalories: totalCalories,
    };
    completeWorkout(workout);
  }, [dailyExercises, totalDuration, totalCalories, completeWorkout]);

  const refreshWorkout = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDailyExercises(generateDailyWorkout(5));
    setWorkoutComplete(false);
    setActiveWorkout(false);
    setCurrentExerciseIndex(0);
    slideAnim.setValue(0);
  }, [slideAnim]);

  const currentExercise = dailyExercises[currentExerciseIndex];

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (activeWorkout && currentExercise) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={isResting ? ['#1a2a1a', '#0D0D0F'] : ['#2a1a10', '#0D0D0F']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.workoutHeader}>
          <Text style={styles.workoutProgress}>
            {currentExerciseIndex + 1} / {dailyExercises.length}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setActiveWorkout(false);
              if (timerRef.current) clearInterval(timerRef.current);
            }}
            style={styles.stopButton}
          >
            <Text style={styles.stopButtonText}>{t.home.stop}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerLabel}>
              {isResting ? t.home.rest : getTranslatedExercise(currentExercise, language).name.toUpperCase()}
            </Text>
            <Text style={styles.timerText}>{timeLeft}</Text>
            <Text style={styles.timerUnit}>{t.home.seconds}</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>

        {!isResting && (
          <View style={styles.instructionContainer}>
            {getTranslatedExercise(currentExercise, language).instructions.map((instruction, idx) => (
              <View key={idx} style={styles.instructionRow}>
                <View style={styles.instructionDot} />
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {isResting && currentExerciseIndex < dailyExercises.length - 1 && (
          <View style={styles.nextExercisePreview}>
            <Text style={styles.nextLabel}>{t.home.next}</Text>
            <View style={styles.nextExerciseCard}>
              {getExerciseIcon(dailyExercises[currentExerciseIndex + 1].icon, 28, Colors.dark.accent)}
              <Text style={styles.nextExerciseName}>
                {getTranslatedExercise(dailyExercises[currentExerciseIndex + 1], language).name}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#1a1410', '#0D0D0F']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t.home.greeting}</Text>
            <Text style={styles.subtitle}>{quote}</Text>
          </View>
        </View>

        <View style={styles.streakRow}>
          <View style={styles.streakCard}>
            <LinearGradient
              colors={[Colors.dark.accentDim, 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <FlameIcon size={22} color={Colors.dark.accent} />
            <Text style={styles.streakNumber}>{streak.currentStreak}</Text>
            <Text style={styles.streakLabel}>{t.home.days}</Text>
          </View>
          <View style={styles.streakCard}>
            <LinearGradient
              colors={[Colors.dark.warningDim, 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Trophy size={22} color={Colors.dark.warning} />
            <Text style={styles.streakNumber}>{streak.longestStreak}</Text>
            <Text style={styles.streakLabel}>{t.home.record}</Text>
          </View>
          <View style={styles.streakCard}>
            <LinearGradient
              colors={[Colors.dark.successDim, 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <CheckCircle size={22} color={todayCompleted ? Colors.dark.success : Colors.dark.textTertiary} />
            <Text style={[styles.streakNumber, { color: todayCompleted ? Colors.dark.success : Colors.dark.text }]}>
              {todayCompleted ? t.home.done : t.home.no}
            </Text>
            <Text style={styles.streakLabel}>{t.home.today}</Text>
          </View>
        </View>

        <View style={styles.workoutCard}>
          <LinearGradient
            colors={['#252018', '#1A1A1F']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.workoutCardHeader}>
            <Text style={styles.workoutTitle}>{t.home.workoutOfTheDay}</Text>
            <TouchableOpacity onPress={refreshWorkout} style={styles.refreshButton} testID="refresh-workout">
              <RefreshCw size={18} color={Colors.dark.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <Clock size={14} color={Colors.dark.accent} />
              <Text style={styles.metaText}>{Math.ceil(totalDuration / 60)} min</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <FlameIcon size={14} color={Colors.dark.accent} />
              <Text style={styles.metaText}>{totalCalories} cal</Text>
            </View>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{dailyExercises.length} {t.home.exercises}</Text>
          </View>

          {dailyExercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <View style={styles.exerciseIconContainer}>
                {getExerciseIcon(exercise.icon, 20, Colors.dark.accent)}
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{getTranslatedExercise(exercise, language).name}</Text>
                <Text style={styles.exerciseDuration}>{exercise.duration}s</Text>
              </View>
              {index < dailyExercises.length - 1 && <View style={styles.connector} />}
            </View>
          ))}

          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              onPress={startWorkout}
              style={[
                styles.startButton,
                (todayCompleted || workoutComplete) && styles.startButtonDone,
              ]}
              activeOpacity={0.8}
              testID="start-workout"
            >
              <LinearGradient
                colors={
                  todayCompleted || workoutComplete
                    ? [Colors.dark.success, '#2d9e5a']
                    : [Colors.dark.accent, '#e85520']
                }
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              {todayCompleted || workoutComplete ? (
                <>
                  <CheckCircle size={22} color="#fff" />
                  <Text style={styles.startButtonText}>{t.home.completed}</Text>
                </>
              ) : (
                <>
                  <Play size={22} color="#fff" fill="#fff" />
                  <Text style={styles.startButtonText}>{t.home.start}</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    marginTop: 6,
    lineHeight: 20,
    fontStyle: 'italic' as const,
  },
  streakRow: {
    flexDirection: 'row' as const,
    gap: 10,
    marginBottom: 24,
  },
  streakCard: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.dark.surface,
    overflow: 'hidden' as const,
  },
  streakNumber: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginTop: 8,
  },
  streakLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  workoutCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden' as const,
  },
  workoutCardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.dark.surfaceLight,
  },
  workoutMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.dark.textTertiary,
  },
  exerciseRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 14,
    position: 'relative' as const,
  },
  exerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.dark.accentDim,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  exerciseInfo: {
    flex: 1,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.dark.text,
  },
  exerciseDuration: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  connector: {
    position: 'absolute' as const,
    left: 19,
    top: 42,
    width: 2,
    height: 12,
    backgroundColor: Colors.dark.border,
  },
  startButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    gap: 10,
    overflow: 'hidden' as const,
  },
  startButtonDone: {
    opacity: 0.9,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#fff',
  },
  workoutHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  workoutProgress: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  stopButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,59,48,0.15)',
  },
  stopButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FF3B30',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: Colors.dark.accent,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  timerLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.dark.accent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '200' as const,
    color: Colors.dark.text,
  },
  timerUnit: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 2,
    marginHorizontal: 20,
    marginVertical: 20,
    overflow: 'hidden' as const,
  },
  progressBarFill: {
    height: '100%' as const,
    backgroundColor: Colors.dark.accent,
    borderRadius: 2,
  },
  instructionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  instructionRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  instructionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.accent,
  },
  instructionText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    flex: 1,
  },
  nextExercisePreview: {
    alignItems: 'center' as const,
    paddingBottom: 40,
  },
  nextLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.dark.textTertiary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  nextExerciseCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  nextExerciseName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
});
