import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Cette page n’existe pas</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour à l’accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: Colors.dark.accent,
  },
});
