export type ExerciseCategory = 'upper' | 'lower' | 'core' | 'cardio' | 'full';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: ExerciseCategory;
  difficulty: Difficulty;
  icon: string;
  instructions: string[];
  calories: number;
}

export interface CompletedWorkout {
  id: string;
  date: string;
  exercises: Exercise[];
  totalDuration: number;
  totalCalories: number;
}

export interface WorkoutSettings {
  notificationsEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  dailyGoalMinutes: number;
}

export interface DailyWorkout {
  exercises: Exercise[];
  totalDuration: number;
  totalCalories: number;
  date: string;
}
