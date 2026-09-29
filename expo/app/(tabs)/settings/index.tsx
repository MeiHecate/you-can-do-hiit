import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Clock, Target, ChevronRight, Info, Globe, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import Colors from '@/constants/colors';
import { useWorkout, requestNotificationPermissions } from '@/contexts/WorkoutContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/constants/i18n';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useWorkout();
  const { t, language, setLanguage } = useLanguage();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleNotificationToggle = useCallback(
    async (value: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (value) {
        const granted = await requestNotificationPermissions();
        if (!granted) {
          Alert.alert(
            t.settings.permissionsRequired,
            t.settings.permissionsMessage,
            [{ text: t.settings.ok }]
          );
          return;
        }
      }
      updateSettings({ ...settings, notificationsEnabled: value });
    },
    [settings, updateSettings, t]
  );

  const handleTimeSelect = useCallback(
    (hour: number, minute: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateSettings({ ...settings, reminderHour: hour, reminderMinute: minute });
      setShowTimePicker(false);
    },
    [settings, updateSettings]
  );

  const handleGoalChange = useCallback(
    (minutes: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateSettings({ ...settings, dailyGoalMinutes: minutes });
    },
    [settings, updateSettings]
  );

  const handleLanguageToggle = useCallback(
    (lang: Language) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setLanguage(lang);
    },
    [setLanguage]
  );

  const handlePrivacyPolicy = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    WebBrowser.openBrowserAsync('https://maelrochard.com/privacy');
  }, []);

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#141018', Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>{t.settings.title}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.language}</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(99,160,255,0.15)' }]}>
                  <Globe size={18} color="#63A0FF" />
                </View>
                <View>
                  <Text style={styles.settingLabel}>{t.settings.languageLabel}</Text>
                </View>
              </View>
            </View>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                onPress={() => handleLanguageToggle('en')}
                style={[
                  styles.languageChip,
                  language === 'en' && styles.languageChipActive,
                ]}
              >
                <Text style={[
                  styles.languageChipText,
                  language === 'en' && styles.languageChipTextActive,
                ]}>
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLanguageToggle('fr')}
                style={[
                  styles.languageChip,
                  language === 'fr' && styles.languageChipActive,
                ]}
              >
                <Text style={[
                  styles.languageChipText,
                  language === 'fr' && styles.languageChipTextActive,
                ]}>
                  Français
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.notifications}</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: Colors.dark.accentDim }]}>
                  <Bell size={18} color={Colors.dark.accent} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>{t.settings.dailyReminders}</Text>
                  <Text style={styles.settingDesc}>
                    {settings.notificationsEnabled ? t.settings.enabled : t.settings.disabled}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: Colors.dark.surfaceLight, true: Colors.dark.accent }}
                thumbColor="#fff"
              />
            </View>

            {settings.notificationsEnabled && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={() => setShowTimePicker(!showTimePicker)}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(99,99,255,0.15)' }]}>
                      <Clock size={18} color="#6363FF" />
                    </View>
                    <View>
                      <Text style={styles.settingLabel}>{t.settings.reminderTime}</Text>
                      <Text style={styles.settingDesc}>
                        {formatTime(settings.reminderHour, settings.reminderMinute)}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color={Colors.dark.textTertiary} />
                </TouchableOpacity>
              </>
            )}
          </View>

          {showTimePicker && settings.notificationsEnabled && (
            <View style={styles.timePickerCard}>
              <Text style={styles.timePickerTitle}>{t.settings.chooseTime}</Text>
              <ScrollView
                style={styles.timeScrollContainer}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.timeGrid}>
                  {HOURS.map((hour) =>
                    MINUTES.map((minute) => {
                      const isSelected =
                        hour === settings.reminderHour && minute === settings.reminderMinute;
                      return (
                        <TouchableOpacity
                          key={`${hour}-${minute}`}
                          onPress={() => handleTimeSelect(hour, minute)}
                          style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                        >
                          <Text
                            style={[
                              styles.timeChipText,
                              isSelected && styles.timeChipTextSelected,
                            ]}
                          >
                            {formatTime(hour, minute)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.dailyGoal}</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: Colors.dark.successDim }]}>
                  <Target size={18} color={Colors.dark.success} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>{t.settings.minimumDuration}</Text>
                  <Text style={styles.settingDesc}>{t.settings.minutesPerDay(settings.dailyGoalMinutes)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.goalButtons}>
              {[3, 5, 7, 10, 15].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  onPress={() => handleGoalChange(mins)}
                  style={[
                    styles.goalChip,
                    settings.dailyGoalMinutes === mins && styles.goalChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.goalChipText,
                      settings.dailyGoalMinutes === mins && styles.goalChipTextActive,
                    ]}
                  >
                    {mins} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.about}</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: Colors.dark.warningDim }]}>
                  <Info size={18} color={Colors.dark.warning} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>You Can Do Hiit</Text>
                  <Text style={styles.settingDesc}>Version 1.0.0</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handlePrivacyPolicy}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(99,160,255,0.15)' }]}>
                  <Shield size={18} color="#63A0FF" />
                </View>
                <View>
                  <Text style={styles.settingLabel}>{t.settings.privacyPolicy}</Text>
                </View>
              </View>
              <ChevronRight size={18} color={Colors.dark.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerText}>
          {t.settings.footerText}
        </Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.dark.textTertiary,
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 4,
    overflow: 'hidden' as const,
  },
  settingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 14,
  },
  settingLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.dark.text,
  },
  settingDesc: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 14,
  },
  languageButtons: {
    flexDirection: 'row' as const,
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  languageChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center' as const,
  },
  languageChipActive: {
    backgroundColor: Colors.dark.accentDim,
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  languageChipText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  languageChipTextActive: {
    color: Colors.dark.accent,
  },
  timePickerCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  timePickerTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  timeScrollContainer: {
    maxHeight: 200,
  },
  timeGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.dark.surfaceLight,
  },
  timeChipSelected: {
    backgroundColor: Colors.dark.accent,
  },
  timeChipText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500' as const,
  },
  timeChipTextSelected: {
    color: '#fff',
  },
  goalButtons: {
    flexDirection: 'row' as const,
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  goalChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center' as const,
  },
  goalChipActive: {
    backgroundColor: Colors.dark.accentDim,
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  goalChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  goalChipTextActive: {
    color: Colors.dark.accent,
  },
  footerText: {
    fontSize: 13,
    color: Colors.dark.textTertiary,
    textAlign: 'center' as const,
    lineHeight: 20,
    marginTop: 8,
  },
});
