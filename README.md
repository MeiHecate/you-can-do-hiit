# You Can Do Hiit

Application iOS d'entraînement fractionné de haute intensité : une courte séance par jour, guidée exercice par exercice, en français ou en anglais selon la langue du téléphone.

Disponible sur l'[App Store](https://apps.apple.com/app/id6761679465).

## Ce que fait l'app

- Chaque jour, une séance de 5 exercices tirés d'une bibliothèque de 16 (haut du corps, bas du corps, gainage, cardio, corps entier).
- Un minuteur enchaîne les exercices avec 10 secondes de repos entre chacun, avec retour haptique.
- Bibliothèque filtrable par catégorie, avec des favoris.
- Suivi des séances terminées, série de jours d'affilée et objectif quotidien en minutes.
- Rappel quotidien par notification, à l'heure choisie.
- Toutes les données restent sur le téléphone (AsyncStorage), sans compte.

## Stack

- React Native, Expo SDK 54, expo-router
- TypeScript
- TanStack Query pour l'état persistant, AsyncStorage
- expo-notifications, expo-haptics, expo-localization
- Bun, EAS Build et EAS Submit

## Organisation du code

Le projet est dans `expo/` :

- `app/` : les écrans, rangés par onglet (accueil, exercices, progrès, réglages) avec expo-router.
- `contexts/` : l'état de l'entraînement (séances, série de jours, favoris, réglages, notifications) et la langue.
- `constants/` : couleurs et traductions.
- `data/` : la bibliothèque d'exercices et la génération de la séance du jour.
- `types/` : les types partagés.

## Lancer le projet

```bash
cd expo
bun install
bunx expo start
```

Vérifications :

```bash
bunx tsc --noEmit
bunx expo lint
```

## Build et publication

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

La clé App Store Connect n'est pas dans le dépôt : `eas submit` la lit dans les variables `EXPO_ASC_API_KEY_PATH`, `EXPO_ASC_KEY_ID` et `EXPO_ASC_ISSUER_ID`.

## Licence

Code source consultable, tous droits réservés. Voir [LICENSE](LICENSE).
