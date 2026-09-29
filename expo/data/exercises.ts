import { Exercise } from '@/types/exercise';
import { Language, exerciseTranslations } from '@/constants/i18n';

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Jumping Jacks',
    description: 'Classic full-body warm-up exercise',
    duration: 30,
    category: 'cardio',
    difficulty: 'easy',
    icon: 'Zap',
    instructions: [
      'Stand with feet together, arms at sides',
      'Jump while spreading legs and raising arms overhead',
      'Jump back to starting position',
      'Repeat at a steady pace',
    ],
    calories: 8,
  },
  {
    id: '2',
    name: 'Push-ups',
    description: 'Upper body strengthening classic',
    duration: 30,
    category: 'upper',
    difficulty: 'medium',
    icon: 'ArrowUp',
    instructions: [
      'Start in plank position, hands shoulder-width apart',
      'Lower your body until chest nearly touches the floor',
      'Push back up to starting position',
      'Keep core tight throughout',
    ],
    calories: 10,
  },
  {
    id: '3',
    name: 'Squats',
    description: 'Fundamental lower body exercise',
    duration: 30,
    category: 'lower',
    difficulty: 'easy',
    icon: 'ArrowDown',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your hips back and down',
      'Keep knees behind toes',
      'Push through heels to stand back up',
    ],
    calories: 9,
  },
  {
    id: '4',
    name: 'Plank',
    description: 'Core stability hold',
    duration: 30,
    category: 'core',
    difficulty: 'easy',
    icon: 'Minus',
    instructions: [
      'Start in forearm plank position',
      'Keep body in a straight line from head to heels',
      'Engage core and glutes',
      'Hold the position steadily',
    ],
    calories: 5,
  },
  {
    id: '5',
    name: 'Lunges',
    description: 'Unilateral leg strengthener',
    duration: 30,
    category: 'lower',
    difficulty: 'medium',
    icon: 'Footprints',
    instructions: [
      'Step forward with one leg',
      'Lower until both knees are at 90 degrees',
      'Push back to starting position',
      'Alternate legs each rep',
    ],
    calories: 9,
  },
  {
    id: '6',
    name: 'Mountain Climbers',
    description: 'High-intensity cardio and core',
    duration: 30,
    category: 'cardio',
    difficulty: 'hard',
    icon: 'Mountain',
    instructions: [
      'Start in plank position',
      'Drive one knee toward chest',
      'Quickly switch legs',
      'Keep hips level and core engaged',
    ],
    calories: 12,
  },
  {
    id: '7',
    name: 'Burpees',
    description: 'Full body explosive movement',
    duration: 30,
    category: 'full',
    difficulty: 'hard',
    icon: 'Flame',
    instructions: [
      'Stand tall, then squat down',
      'Jump feet back to plank',
      'Do a push-up',
      'Jump feet forward and leap up',
    ],
    calories: 14,
  },
  {
    id: '8',
    name: 'High Knees',
    description: 'Cardio and lower body activation',
    duration: 30,
    category: 'cardio',
    difficulty: 'medium',
    icon: 'ChevronsUp',
    instructions: [
      'Stand with feet hip-width apart',
      'Run in place, driving knees high',
      'Aim for waist height with each knee',
      'Pump arms for momentum',
    ],
    calories: 11,
  },
  {
    id: '9',
    name: 'Bicycle Crunches',
    description: 'Rotational core exercise',
    duration: 30,
    category: 'core',
    difficulty: 'medium',
    icon: 'RotateCcw',
    instructions: [
      'Lie on back, hands behind head',
      'Lift shoulders off ground',
      'Bring opposite elbow to knee',
      'Alternate sides in pedaling motion',
    ],
    calories: 7,
  },
  {
    id: '10',
    name: 'Wall Sit',
    description: 'Isometric leg hold',
    duration: 30,
    category: 'lower',
    difficulty: 'easy',
    icon: 'Square',
    instructions: [
      'Lean back against a wall',
      'Slide down until thighs are parallel to floor',
      'Keep knees at 90 degrees',
      'Hold the position',
    ],
    calories: 5,
  },
  {
    id: '11',
    name: 'Tricep Dips',
    description: 'Arm strengthener using a chair',
    duration: 30,
    category: 'upper',
    difficulty: 'medium',
    icon: 'ChevronDown',
    instructions: [
      'Sit on edge of a sturdy chair',
      'Place hands beside hips',
      'Slide forward and lower body',
      'Push back up using triceps',
    ],
    calories: 8,
  },
  {
    id: '12',
    name: 'Superman',
    description: 'Back and glute strengthener',
    duration: 30,
    category: 'core',
    difficulty: 'easy',
    icon: 'Star',
    instructions: [
      'Lie face down, arms extended forward',
      'Simultaneously lift arms, chest, and legs',
      'Hold briefly at the top',
      'Lower back down with control',
    ],
    calories: 6,
  },
  {
    id: '13',
    name: 'Side Plank',
    description: 'Oblique and stability hold',
    duration: 20,
    category: 'core',
    difficulty: 'medium',
    icon: 'AlignLeft',
    instructions: [
      'Lie on your side, stack feet',
      'Prop up on forearm, elbow under shoulder',
      'Lift hips to form straight line',
      'Hold, then switch sides',
    ],
    calories: 5,
  },
  {
    id: '14',
    name: 'Calf Raises',
    description: 'Lower leg strengthener',
    duration: 30,
    category: 'lower',
    difficulty: 'easy',
    icon: 'TrendingUp',
    instructions: [
      'Stand with feet hip-width apart',
      'Rise up onto your toes',
      'Hold briefly at the top',
      'Lower back down slowly',
    ],
    calories: 4,
  },
  {
    id: '15',
    name: 'Shadow Boxing',
    description: 'Fun cardio and coordination',
    duration: 30,
    category: 'cardio',
    difficulty: 'easy',
    icon: 'Swords',
    instructions: [
      'Stand in fighting stance',
      'Throw alternating punches',
      'Add hooks and uppercuts',
      'Stay light on your feet',
    ],
    calories: 10,
  },
  {
    id: '16',
    name: 'Glute Bridges',
    description: 'Hip and glute activation',
    duration: 30,
    category: 'lower',
    difficulty: 'easy',
    icon: 'TrendingUp',
    instructions: [
      'Lie on back, knees bent, feet flat',
      'Push hips up toward ceiling',
      'Squeeze glutes at the top',
      'Lower back down with control',
    ],
    calories: 6,
  },
];

export const motivationalQuotes: Record<Language, string[]> = {
  en: [
    "No equipment? No excuses. Let's go!",
    "5 minutes today is better than 0 tomorrow.",
    "Your body can do it. Convince your mind.",
    "Small steps every day lead to big results.",
    "You don't have to be extreme, just consistent.",
    "The hardest part is starting. You've got this.",
    "Every rep counts. Every second matters.",
    "Be stronger than your excuses.",
    "Progress, not perfection.",
    "You're one workout away from a good mood.",
  ],
  fr: [
    "Pas de matériel ? Pas d'excuses. C'est parti !",
    "5 minutes aujourd'hui valent mieux que 0 demain.",
    "Ton corps peut le faire. Convaincs ta tête.",
    "De petits pas chaque jour mènent à de grands résultats.",
    "Pas besoin d'être extrême, juste régulier.",
    "Le plus dur, c'est de commencer. Tu vas y arriver.",
    "Chaque répétition compte. Chaque seconde compte.",
    "Sois plus fort que tes excuses.",
    "Le progrès, pas la perfection.",
    "Un seul workout te sépare d'une bonne humeur.",
  ],
};

export function getTranslatedExercises(language: Language): Exercise[] {
  const trans = exerciseTranslations[language];
  return exercises.map((exercise) => {
    const t = trans[exercise.id];
    if (!t) return exercise;
    return { ...exercise, name: t.name, description: t.description, instructions: t.instructions };
  });
}

export function getTranslatedExercise(exercise: Exercise, language: Language): Exercise {
  const t = exerciseTranslations[language][exercise.id];
  if (!t) return exercise;
  return { ...exercise, name: t.name, description: t.description, instructions: t.instructions };
}

export function generateDailyWorkout(count: number = 5): Exercise[] {
  const shuffled = [...exercises].sort(() => Math.random() - 0.5);
  const categories = new Set<string>();
  const selected: Exercise[] = [];

  for (const exercise of shuffled) {
    if (selected.length >= count) break;
    if (categories.size < 3 || !categories.has(exercise.category)) {
      selected.push(exercise);
      categories.add(exercise.category);
    }
  }

  while (selected.length < count && shuffled.length > selected.length) {
    const next = shuffled.find((e) => !selected.includes(e));
    if (next) selected.push(next);
    else break;
  }

  return selected;
}
