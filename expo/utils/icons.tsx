import React from 'react';
import {
  Zap, ArrowUp, ArrowDown, Minus, Footprints, Mountain, Flame,
  ChevronsUp, RotateCcw, Square, ChevronDown, Star, AlignLeft,
  TrendingUp, Swords, Dumbbell,
} from 'lucide-react-native';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Footprints,
  Mountain,
  Flame,
  ChevronsUp,
  RotateCcw,
  Square,
  ChevronDown,
  Star,
  AlignLeft,
  TrendingUp,
  Swords,
  Dumbbell,
};

export function getExerciseIcon(iconName: string, size: number = 24, color: string = '#fff') {
  const IconComponent = iconMap[iconName] || Dumbbell;
  return <IconComponent size={size} color={color} />;
}
