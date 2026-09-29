export type Language = 'en' | 'fr';

export interface Translations {
  tabs: {
    home: string;
    exercises: string;
    progress: string;
    settings: string;
  };
  home: {
    greeting: string;
    days: string;
    record: string;
    done: string;
    no: string;
    today: string;
    workoutOfTheDay: string;
    exercises: string;
    start: string;
    completed: string;
    stop: string;
    rest: string;
    seconds: string;
    next: string;
  };
  exercises: {
    title: string;
    subtitle: (count: number) => string;
    favorites: string;
    noFavorites: string;
    categories: {
      all: string;
      favorites: string;
      cardio: string;
      upper: string;
      lower: string;
      core: string;
      full: string;
    };
    difficulty: {
      easy: string;
      medium: string;
      hard: string;
    };
  };
  progress: {
    title: string;
    thisWeek: string;
    weekSummary: (count: number) => string;
    currentStreak: string;
    bestStreak: string;
    totalSessions: string;
    totalMinutes: string;
    totalCaloriesBurned: string;
    recentHistory: string;
    noSessionsYet: string;
    startFirstWorkout: string;
    weekdays: string[];
  };
  settings: {
    title: string;
    notifications: string;
    dailyReminders: string;
    enabled: string;
    disabled: string;
    reminderTime: string;
    chooseTime: string;
    dailyGoal: string;
    minimumDuration: string;
    minutesPerDay: (mins: number) => string;
    about: string;
    permissionsRequired: string;
    permissionsMessage: string;
    ok: string;
    language: string;
    languageLabel: string;
    footerText: string;
    privacyPolicy: string;
  };
  notifications: {
    title: string;
    body: string;
  };
  back: string;
}

const en: Translations = {
  tabs: {
    home: 'Home',
    exercises: 'Exercises',
    progress: 'Progress',
    settings: 'Settings',
  },
  home: {
    greeting: 'Hello',
    days: 'days',
    record: 'record',
    done: 'Done',
    no: 'No',
    today: 'today',
    workoutOfTheDay: "Today's Workout",
    exercises: 'exercises',
    start: 'Start',
    completed: 'Completed!',
    stop: 'Stop',
    rest: 'REST',
    seconds: 'seconds',
    next: 'NEXT',
  },
  exercises: {
    title: 'Exercises',
    subtitle: (count: number) => `${count} no-equipment exercises`,
    favorites: 'Favorites',
    noFavorites: 'No favorites yet. Tap the heart icon to add exercises to your favorites!',
    categories: {
      all: 'All',
      favorites: 'Favorites',
      cardio: 'Cardio',
      upper: 'Upper',
      lower: 'Lower',
      core: 'Core',
      full: 'Full body',
    },
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
  },
  progress: {
    title: 'Progress',
    thisWeek: 'This Week',
    weekSummary: (count: number) => `${count} / 7 sessions this week`,
    currentStreak: 'Current streak',
    bestStreak: 'Best streak',
    totalSessions: 'Total sessions',
    totalMinutes: 'Total minutes',
    totalCaloriesBurned: 'total calories burned',
    recentHistory: 'Recent History',
    noSessionsYet: 'No sessions yet',
    startFirstWorkout: 'Complete your first workout to see your progress here!',
    weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  },
  settings: {
    title: 'Settings',
    notifications: 'NOTIFICATIONS',
    dailyReminders: 'Daily reminders',
    enabled: 'Enabled',
    disabled: 'Disabled',
    reminderTime: 'Reminder time',
    chooseTime: 'Choose time',
    dailyGoal: 'DAILY GOAL',
    minimumDuration: 'Minimum duration',
    minutesPerDay: (mins: number) => `${mins} minutes per day`,
    about: 'ABOUT',
    permissionsRequired: 'Permissions required',
    permissionsMessage: 'Enable notifications in your phone settings to receive reminders.',
    ok: 'OK',
    language: 'LANGUAGE',
    languageLabel: 'App language',
    footerText: "Short exercises, no equipment, to move every day.\nYou don't need to be an athlete, just consistent.",
    privacyPolicy: 'Privacy policy',
  },
  notifications: {
    title: "Time to move!",
    body: "Your daily workout is waiting. 5 minutes is all it takes!",
  },
  back: 'Back',
};

const fr: Translations = {
  tabs: {
    home: 'Accueil',
    exercises: 'Exercices',
    progress: 'Progrès',
    settings: 'Réglages',
  },
  home: {
    greeting: 'Bonjour',
    days: 'jours',
    record: 'record',
    done: 'Fait',
    no: 'Non',
    today: "aujourd'hui",
    workoutOfTheDay: 'Workout du jour',
    exercises: 'exercices',
    start: 'Commencer',
    completed: 'Terminé !',
    stop: 'Arrêter',
    rest: 'REPOS',
    seconds: 'secondes',
    next: 'SUIVANT',
  },
  exercises: {
    title: 'Exercices',
    subtitle: (count: number) => `${count} exercices sans matériel`,
    favorites: 'Favoris',
    noFavorites: 'Pas encore de favoris. Appuie sur le cœur pour ajouter des exercices à tes favoris !',
    categories: {
      all: 'Tous',
      favorites: 'Favoris',
      cardio: 'Cardio',
      upper: 'Haut',
      lower: 'Bas',
      core: 'Abdos',
      full: 'Full body',
    },
    difficulty: {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
    },
  },
  progress: {
    title: 'Progrès',
    thisWeek: 'Cette semaine',
    weekSummary: (count: number) => `${count} / 7 séances cette semaine`,
    currentStreak: 'Série actuelle',
    bestStreak: 'Meilleure série',
    totalSessions: 'Séances totales',
    totalMinutes: 'Minutes totales',
    totalCaloriesBurned: 'calories brûlées au total',
    recentHistory: 'Historique récent',
    noSessionsYet: 'Pas encore de séance',
    startFirstWorkout: 'Commence ton premier workout pour voir tes progrès ici !',
    weekdays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  },
  settings: {
    title: 'Réglages',
    notifications: 'NOTIFICATIONS',
    dailyReminders: 'Rappels quotidiens',
    enabled: 'Activés',
    disabled: 'Désactivés',
    reminderTime: 'Heure du rappel',
    chooseTime: "Choisir l'heure",
    dailyGoal: 'OBJECTIF QUOTIDIEN',
    minimumDuration: 'Durée minimale',
    minutesPerDay: (mins: number) => `${mins} minutes par jour`,
    about: 'À PROPOS',
    permissionsRequired: 'Permissions requises',
    permissionsMessage: "Active les notifications dans les réglages de ton téléphone pour recevoir des rappels.",
    ok: 'OK',
    language: 'LANGUE',
    languageLabel: 'Langue de l\'application',
    footerText: "Exercices courts, sans matériel, pour bouger chaque jour.\nPas besoin d'être un athlète, juste constant.",
    privacyPolicy: 'Politique de confidentialité',
  },
  notifications: {
    title: "C'est l'heure de bouger !",
    body: "Ton workout du jour t'attend. 5 minutes suffisent !",
  },
  back: 'Retour',
};

export const translations: Record<Language, Translations> = { en, fr };

export interface ExerciseTranslation {
  name: string;
  description: string;
  instructions: string[];
}

export const exerciseTranslations: Record<Language, Record<string, ExerciseTranslation>> = {
  en: {
    '1': { name: 'Jumping Jacks', description: 'Classic full-body warm-up exercise', instructions: ['Stand with feet together, arms at sides', 'Jump while spreading legs and raising arms overhead', 'Jump back to starting position', 'Repeat at a steady pace'] },
    '2': { name: 'Push-ups', description: 'Upper body strengthening classic', instructions: ['Start in plank position, hands shoulder-width apart', 'Lower your body until chest nearly touches the floor', 'Push back up to starting position', 'Keep core tight throughout'] },
    '3': { name: 'Squats', description: 'Fundamental lower body exercise', instructions: ['Stand with feet shoulder-width apart', 'Lower your hips back and down', 'Keep knees behind toes', 'Push through heels to stand back up'] },
    '4': { name: 'Plank', description: 'Core stability hold', instructions: ['Start in forearm plank position', 'Keep body in a straight line from head to heels', 'Engage core and glutes', 'Hold the position steadily'] },
    '5': { name: 'Lunges', description: 'Unilateral leg strengthener', instructions: ['Step forward with one leg', 'Lower until both knees are at 90 degrees', 'Push back to starting position', 'Alternate legs each rep'] },
    '6': { name: 'Mountain Climbers', description: 'High-intensity cardio and core', instructions: ['Start in plank position', 'Drive one knee toward chest', 'Quickly switch legs', 'Keep hips level and core engaged'] },
    '7': { name: 'Burpees', description: 'Full body explosive movement', instructions: ['Stand tall, then squat down', 'Jump feet back to plank', 'Do a push-up', 'Jump feet forward and leap up'] },
    '8': { name: 'High Knees', description: 'Cardio and lower body activation', instructions: ['Stand with feet hip-width apart', 'Run in place, driving knees high', 'Aim for waist height with each knee', 'Pump arms for momentum'] },
    '9': { name: 'Bicycle Crunches', description: 'Rotational core exercise', instructions: ['Lie on back, hands behind head', 'Lift shoulders off ground', 'Bring opposite elbow to knee', 'Alternate sides in pedaling motion'] },
    '10': { name: 'Wall Sit', description: 'Isometric leg hold', instructions: ['Lean back against a wall', 'Slide down until thighs are parallel to floor', 'Keep knees at 90 degrees', 'Hold the position'] },
    '11': { name: 'Tricep Dips', description: 'Arm strengthener using a chair', instructions: ['Sit on edge of a sturdy chair', 'Place hands beside hips', 'Slide forward and lower body', 'Push back up using triceps'] },
    '12': { name: 'Superman', description: 'Back and glute strengthener', instructions: ['Lie face down, arms extended forward', 'Simultaneously lift arms, chest, and legs', 'Hold briefly at the top', 'Lower back down with control'] },
    '13': { name: 'Side Plank', description: 'Oblique and stability hold', instructions: ['Lie on your side, stack feet', 'Prop up on forearm, elbow under shoulder', 'Lift hips to form straight line', 'Hold, then switch sides'] },
    '14': { name: 'Calf Raises', description: 'Lower leg strengthener', instructions: ['Stand with feet hip-width apart', 'Rise up onto your toes', 'Hold briefly at the top', 'Lower back down slowly'] },
    '15': { name: 'Shadow Boxing', description: 'Fun cardio and coordination', instructions: ['Stand in fighting stance', 'Throw alternating punches', 'Add hooks and uppercuts', 'Stay light on your feet'] },
    '16': { name: 'Glute Bridges', description: 'Hip and glute activation', instructions: ['Lie on back, knees bent, feet flat', 'Push hips up toward ceiling', 'Squeeze glutes at the top', 'Lower back down with control'] },
  },
  fr: {
    '1': { name: 'Jumping Jacks', description: 'Échauffement classique corps entier', instructions: ['Debout, pieds joints, bras le long du corps', 'Sauter en écartant les jambes et en levant les bras', 'Revenir en position initiale', 'Répéter à un rythme régulier'] },
    '2': { name: 'Pompes', description: 'Classique du renforcement du haut du corps', instructions: ['Position de planche, mains écartées largeur d\'épaules', 'Descendre jusqu\'à ce que la poitrine frôle le sol', 'Remonter en position initiale', 'Garder les abdos gainés'] },
    '3': { name: 'Squats', description: 'Exercice fondamental pour le bas du corps', instructions: ['Debout, pieds écartés largeur d\'épaules', 'Descendre les hanches vers l\'arrière et le bas', 'Garder les genoux derrière les orteils', 'Pousser sur les talons pour remonter'] },
    '4': { name: 'Planche', description: 'Gainage et stabilité du tronc', instructions: ['Position de planche sur les avant-bras', 'Garder le corps aligné de la tête aux talons', 'Contracter les abdos et les fessiers', 'Maintenir la position'] },
    '5': { name: 'Fentes', description: 'Renforcement unilatéral des jambes', instructions: ['Faire un pas en avant avec une jambe', 'Descendre jusqu\'à ce que les deux genoux soient à 90°', 'Revenir en position initiale', 'Alterner les jambes à chaque répétition'] },
    '6': { name: 'Mountain Climbers', description: 'Cardio intense et gainage', instructions: ['Position de planche', 'Amener un genou vers la poitrine', 'Alterner rapidement les jambes', 'Garder les hanches stables et les abdos gainés'] },
    '7': { name: 'Burpees', description: 'Mouvement explosif corps entier', instructions: ['Debout, puis s\'accroupir', 'Sauter pieds en arrière en position planche', 'Faire une pompe', 'Sauter pieds en avant et bondir'] },
    '8': { name: 'Montées de genoux', description: 'Cardio et activation du bas du corps', instructions: ['Debout, pieds écartés largeur de hanches', 'Courir sur place en montant les genoux', 'Viser la hauteur de la taille', 'Accompagner avec les bras'] },
    '9': { name: 'Crunchs vélo', description: 'Exercice rotatif pour les abdos', instructions: ['Allongé sur le dos, mains derrière la tête', 'Décoller les épaules du sol', 'Amener le coude opposé vers le genou', 'Alterner en mouvement de pédalage'] },
    '10': { name: 'Chaise murale', description: 'Maintien isométrique des jambes', instructions: ['S\'adosser contre un mur', 'Glisser vers le bas jusqu\'à avoir les cuisses parallèles au sol', 'Garder les genoux à 90°', 'Maintenir la position'] },
    '11': { name: 'Dips triceps', description: 'Renforcement des bras avec une chaise', instructions: ['S\'asseoir au bord d\'une chaise stable', 'Placer les mains à côté des hanches', 'Glisser vers l\'avant et descendre le corps', 'Remonter en poussant sur les triceps'] },
    '12': { name: 'Superman', description: 'Renforcement du dos et des fessiers', instructions: ['Allongé face au sol, bras tendus devant', 'Lever simultanément les bras, la poitrine et les jambes', 'Maintenir brièvement en haut', 'Redescendre avec contrôle'] },
    '13': { name: 'Planche latérale', description: 'Gainage des obliques et stabilité', instructions: ['S\'allonger sur le côté, pieds empilés', 'Se soulever sur l\'avant-bras, coude sous l\'épaule', 'Lever les hanches pour former une ligne droite', 'Maintenir, puis changer de côté'] },
    '14': { name: 'Mollets', description: 'Renforcement des mollets', instructions: ['Debout, pieds écartés largeur de hanches', 'Monter sur la pointe des pieds', 'Maintenir brièvement en haut', 'Redescendre lentement'] },
    '15': { name: 'Shadow boxing', description: 'Cardio ludique et coordination', instructions: ['Se mettre en position de combat', 'Enchaîner des coups de poing alternés', 'Ajouter des crochets et des uppercuts', 'Rester léger sur ses appuis'] },
    '16': { name: 'Pont fessier', description: 'Activation des hanches et fessiers', instructions: ['Allongé sur le dos, genoux pliés, pieds à plat', 'Pousser les hanches vers le plafond', 'Serrer les fessiers en haut', 'Redescendre avec contrôle'] },
  },
};
