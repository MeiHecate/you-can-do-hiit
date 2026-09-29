import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Clock, Zap, Calendar, TrendingUp, Award } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const {
    streak,
    completedWorkouts,
    thisWeekWorkouts,
    totalWorkouts,
    totalMinutes,
    totalCalories,
  } = useWorkout();

  const weekActivity = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    return t.progress.weekdays.map((label, idx) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + idx);
      const dateStr = date.toISOString().split('T')[0];
      const done = completedWorkouts.some((w) => w.date === dateStr);
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      return { label, done, isToday };
    });
  }, [completedWorkouts, t]);

  const recentWorkouts = useMemo(
    () => completedWorkouts.slice(0, 10),
    [completedWorkouts]
  );

  const dateLocale = language === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#0f1a10', Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>{t.progress.title}</Text>

        <View style={styles.weekCard}>
          <Text style={styles.sectionTitle}>{t.progress.thisWeek}</Text>
          <View style={styles.weekRow}>
            {weekActivity.map((day, idx) => (
              <View key={idx} style={styles.dayColumn}>
                <View
                  style={[
                    styles.dayDot,
                    day.done && styles.dayDotDone,
                    day.isToday && !day.done && styles.dayDotToday,
                  ]}
                >
                  {day.done && <Flame size={14} color="#fff" />}
                </View>
                <Text style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}>
                  {day.label}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.weekSummary}>
            {t.progress.weekSummary(thisWeekWorkouts.length)}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.dark.accentDim, 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Flame size={24} color={Colors.dark.accent} />
            <Text style={styles.statNumber}>{streak.currentStreak}</Text>
            <Text style={styles.statLabel}>{t.progress.currentStreak}</Text>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.dark.warningDim, 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Award size={24} color={Colors.dark.warning} />
            <Text style={styles.statNumber}>{streak.longestStreak}</Text>
            <Text style={styles.statLabel}>{t.progress.bestStreak}</Text>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.dark.successDim, 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <TrendingUp size={24} color={Colors.dark.success} />
            <Text style={styles.statNumber}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>{t.progress.totalSessions}</Text>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['rgba(99,99,255,0.15)', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Clock size={24} color="#6363FF" />
            <Text style={styles.statNumber}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>{t.progress.totalMinutes}</Text>
          </View>
        </View>

        <View style={styles.totalCalCard}>
          <Zap size={20} color={Colors.dark.accent} />
          <Text style={styles.totalCalNumber}>{totalCalories}</Text>
          <Text style={styles.totalCalLabel}>{t.progress.totalCaloriesBurned}</Text>
        </View>

        {recentWorkouts.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>{t.progress.recentHistory}</Text>
            {recentWorkouts.map((workout) => (
              <View key={workout.id} style={styles.historyCard}>
                <View style={styles.historyDate}>
                  <Calendar size={14} color={Colors.dark.accent} />
                  <Text style={styles.historyDateText}>
                    {new Date(workout.date).toLocaleDateString(dateLocale, {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <View style={styles.historyMeta}>
                  <Text style={styles.historyMetaText}>
                    {workout.exercises.length} {t.home.exercises}
                  </Text>
                  <View style={styles.historyDot} />
                  <Text style={styles.historyMetaText}>
                    {Math.ceil(workout.totalDuration / 60)} min
                  </Text>
                  <View style={styles.historyDot} />
                  <Text style={styles.historyMetaText}>
                    {workout.totalCalories} cal
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {recentWorkouts.length === 0 && (
          <View style={styles.emptyState}>
            <Flame size={48} color={Colors.dark.textTertiary} />
            <Text style={styles.emptyTitle}>{t.progress.noSessionsYet}</Text>
            <Text style={styles.emptySubtitle}>
              {t.progress.startFirstWorkout}
            </Text>
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 14,
  },
  weekCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  weekRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 14,
  },
  dayColumn: {
    alignItems: 'center' as const,
    gap: 8,
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  dayDotDone: {
    backgroundColor: Colors.dark.accent,
  },
  dayDotToday: {
    borderWidth: 2,
    borderColor: Colors.dark.accent,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.dark.textSecondary,
  },
  dayLabelToday: {
    color: Colors.dark.accent,
    fontWeight: '700' as const,
  },
  weekSummary: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center' as const,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: '48%' as const,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden' as const,
    flexGrow: 1,
    flexBasis: '45%' as const,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginTop: 10,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  totalCalCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 24,
  },
  totalCalNumber: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  totalCalLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    flex: 1,
  },
  historySection: {
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  historyDate: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 6,
  },
  historyDateText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  historyMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  historyMetaText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  historyDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.dark.textTertiary,
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
    paddingHorizontal: 24,
  },
});
