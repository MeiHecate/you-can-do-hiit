import { Tabs } from 'expo-router';
import { Home, Dumbbell, BarChart3, Settings } from 'lucide-react-native';
import React from 'react';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.accent,
        tabBarInactiveTintColor: Colors.dark.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.dark.tabBar,
          borderTopColor: Colors.dark.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: t.tabs.exercises,
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t.tabs.progress,
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabs.settings,
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
