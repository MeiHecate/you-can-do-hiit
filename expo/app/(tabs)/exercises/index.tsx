import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Zap, ChevronDown, ChevronUp, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { getTranslatedExercises } from '@/mocks/exercises';
import { getExerciseIcon } from '@/utils/icons';
import { ExerciseCategory, Difficulty } from '@/types/exercise';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkout } from '@/contexts/WorkoutContext';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: Colors.dark.success,
  medium: Colors.dark.warning,
  hard: '#FF3B30',
};

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();

  const { t, language } = useLanguage();
  const { favorites, toggleFavorite, isFavorite } = useWorkout();
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all' | 'favorites'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: { key: ExerciseCategory | 'all' | 'favorites'; label: string }[] = useMemo(() => [
    { key: 'all', label: t.exercises.categories.all },
    { key: 'favorites', label: t.exercises.categories.favorites },
    { key: 'cardio', label: t.exercises.categories.cardio },
    { key: 'upper', label: t.exercises.categories.upper },
    { key: 'lower', label: t.exercises.categories.lower },
    { key: 'core', label: t.exercises.categories.core },
    { key: 'full', label: t.exercises.categories.full },
  ], [t]);

  const translatedExercises = useMemo(() => getTranslatedExercises(language), [language]);

  const filteredExercises = useMemo(
    () => {
      if (selectedCategory === 'all') return translatedExercises;
      if (selectedCategory === 'favorites') return translatedExercises.filter((e) => favorites.includes(e.id));
      return translatedExercises.filter((e) => e.category === selectedCategory);
    },
    [selectedCategory, translatedExercises, favorites]
  );

  const handleToggleFavorite = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(id);
  }, [toggleFavorite]);

  const toggleExpand = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#10151a', Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.headerSection}>
        <Text style={styles.title}>{t.exercises.title}</Text>
        <Text style={styles.subtitle}>{t.exercises.subtitle(translatedExercises.length)}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
          style={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedCategory(cat.key);
              }}
              style={[
                styles.categoryChip,
                selectedCategory === cat.key && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.key && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {selectedCategory === 'favorites' && filteredExercises.length === 0 && (
          <View style={styles.emptyFavorites}>
            <Heart size={48} color={Colors.dark.textTertiary} />
            <Text style={styles.emptyFavoritesText}>{t.exercises.noFavorites}</Text>
          </View>
        )}
        {filteredExercises.map((exercise) => {
          const isExpanded = expandedId === exercise.id;
          return (
            <TouchableOpacity
              key={exercise.id}
              onPress={() => toggleExpand(exercise.id)}
              activeOpacity={0.7}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBg, { backgroundColor: `${DIFFICULTY_COLORS[exercise.difficulty]}20` }]}>
                  {getExerciseIcon(exercise.icon, 22, DIFFICULTY_COLORS[exercise.difficulty])}
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{exercise.name}</Text>
                  <Text style={styles.cardDesc}>{exercise.description}</Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation?.();
                    handleToggleFavorite(exercise.id);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.favoriteButton}
                >
                  <Heart
                    size={20}
                    color={isFavorite(exercise.id) ? '#FF3B6E' : Colors.dark.textTertiary}
                    fill={isFavorite(exercise.id) ? '#FF3B6E' : 'transparent'}
                  />
                </TouchableOpacity>
                <View style={styles.cardRight}>
                  <View style={[styles.diffBadge, { backgroundColor: `${DIFFICULTY_COLORS[exercise.difficulty]}20` }]}>
                    <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[exercise.difficulty] }]}>
                      {t.exercises.difficulty[exercise.difficulty]}
                    </Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={18} color={Colors.dark.textTertiary} />
                  ) : (
                    <ChevronDown size={18} color={Colors.dark.textTertiary} />
                  )}
                </View>
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.expandedMeta}>
                    <View style={styles.expandedMetaItem}>
                      <Clock size={14} color={Colors.dark.accent} />
                      <Text style={styles.expandedMetaText}>{exercise.duration}s</Text>
                    </View>
                    <View style={styles.expandedMetaItem}>
                      <Zap size={14} color={Colors.dark.accent} />
                      <Text style={styles.expandedMetaText}>{exercise.calories} cal</Text>
                    </View>
                  </View>
                  <View style={styles.instructionsList}>
                    {exercise.instructions.map((inst, idx) => (
                      <View key={idx} style={styles.instructionItem}>
                        <View style={styles.instructionNumber}>
                          <Text style={styles.instructionNumberText}>{idx + 1}</Text>
                        </View>
                        <Text style={styles.instructionText}>{inst}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerSection: {
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  categoryScroll: {
    maxHeight: 44,
    marginBottom: 12,
  },
  categoryRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.dark.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.dark.accent,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end' as const,
    gap: 6,
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  expandedMeta: {
    flexDirection: 'row' as const,
    gap: 16,
    marginBottom: 14,
  },
  expandedMetaItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  expandedMetaText: {
    fontSize: 14,
    color: Colors.dark.text,
    fontWeight: '500' as const,
  },
  instructionsList: {
    gap: 10,
  },
  instructionItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 10,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.accentDim,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.dark.accent,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  favoriteButton: {
    padding: 6,
    marginRight: 4,
  },
  emptyFavorites: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 60,
    gap: 16,
  },
  emptyFavoritesText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 22,
    paddingHorizontal: 32,
  },
});
