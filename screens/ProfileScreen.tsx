import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';
import { getLevelInfo, getNextLevel, getProgressToNext, XP_LEVELS } from '../utils/xpSystem';
import { UserLevel } from '../utils/questionPicker';
import { signUp, signIn, signOut, getCurrentUser, fetchProfile, upsertProfile } from '../utils/supabase';
import { clearState } from '../utils/storage';
import { ICONS } from '../utils/imageAssets';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';
const ERROR = '#FF453A';

const LANGUAGES: { code: Language; label: string; flagImg: any }[] = [
  { code: 'en', label: 'English', flagImg: ICONS.flagEn },
  { code: 'de', label: 'Deutsch', flagImg: ICONS.flagDe },
  { code: 'es', label: 'Español', flagImg: ICONS.flagEs },
  { code: 'pt', label: 'Português', flagImg: ICONS.flagPt },
];

const DIFFICULTIES: { key: UserLevel; label: string; desc: string; icon: any }[] = [
  { key: 'beginner',     label: 'Beginner',     desc: 'Easy & medium questions', icon: ICONS.diffBeginner },
  { key: 'intermediate', label: 'Intermediate', desc: 'Mix of all levels',        icon: ICONS.diffIntermediate },
  { key: 'advanced',     label: 'Advanced',     desc: 'Mostly hard questions',    icon: ICONS.diffAdvanced },
];

interface Props {
  userName: string;
  level: UserLevel;
  xp: number;
  streak: number;
  totalQuestions: number;
  onLevelChange: (level: UserLevel) => void;
}

type AuthMode = 'idle' | 'signup' | 'login';

export default function ProfileScreen({ userName, level, xp, streak, totalQuestions, onLevelChange }: Props) {
  const { t, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('idle');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showDiffPicker, setShowDiffPicker] = useState(false);
  const [notifOn, setNotifOn] = useState(true);

  const levelInfo = getLevelInfo(xp);
  const nextLevel = getNextLevel(xp);
  const progress = getProgressToNext(xp);
  const initial = userName?.[0]?.toUpperCase() ?? '?';

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user?.email) setLoggedInEmail(user.email);
    });
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authMode === 'signup') {
        await signUp(email.trim(), password, userName);
      } else {
        await signIn(email.trim(), password);
      }
      setLoggedInEmail(email.trim());
      setAuthMode('idle');
      setEmail('');
      setPassword('');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setAuthError(err.message ?? 'Something went wrong.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
    setLoggedInEmail(null);
  };

  const handleLangSelect = async (lang: Language) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(lang);
    setShowLangPicker(false);
  };

  const handleDiffSelect = async (diff: UserLevel) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLevelChange(diff);
    setShowDiffPicker(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];
  const currentDiff = DIFFICULTIES.find(d => d.key === level) ?? DIFFICULTIES[0];
  const currentDiffIcon = currentDiff.icon;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          <Text style={styles.screenTitle}>{t('profileTitle')}</Text>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={[styles.avatar, { backgroundColor: levelInfo.color }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.profileRight}>
              <Text style={styles.profileName}>{userName}</Text>
              <View style={styles.levelRow}>
                <View style={[styles.levelDot, { backgroundColor: levelInfo.color }]} />
                <Text style={[styles.levelTitle, { color: levelInfo.color }]}>{levelInfo.title}</Text>
                <Text style={styles.levelNum}>Lv. {levelInfo.level}</Text>
              </View>
              <View style={styles.xpBarTrack}>
                <View style={[styles.xpBarFill, { width: `${progress * 100}%`, backgroundColor: levelInfo.color }]} />
              </View>
              <Text style={styles.xpText}>
                {xp} XP{nextLevel ? ` / ${nextLevel.minXP} (${nextLevel.minXP - xp} to go)` : ' — MAX LEVEL'}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalQuestions}</Text>
              <Text style={styles.statLabel}>Questions Done</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: levelInfo.color }]}>Lv.{levelInfo.level}</Text>
              <Text style={styles.statLabel}>Current Level</Text>
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>

            {loggedInEmail ? (
              /* Logged in state */
              <View style={[styles.accountCard, { borderColor: `${BRAND}40` }]}>
                <Image source={ICONS.cloudSynced} style={styles.accountIcon} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Synced to Cloud</Text>
                  <Text style={styles.cardSub}>{loggedInEmail}</Text>
                  <Text style={[styles.cardSub, { color: BRAND, marginTop: 2 }]}>
                    Your streak is backed up
                  </Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut} activeOpacity={0.8}>
                  <Text style={styles.logoutBtnText}>Sign out</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Logged out state */
              <>
                <View style={styles.accountCard}>
                  <Image source={ICONS.cloudBackup} style={styles.accountIcon} resizeMode="contain" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Backup your streak</Text>
                    <Text style={styles.cardSub}>Free account — never lose your progress</Text>
                  </View>
                </View>

                <View style={styles.authBtns}>
                  <TouchableOpacity
                    style={[styles.authBtn, authMode === 'signup' && styles.authBtnActive]}
                    onPress={() => { setAuthMode(m => m === 'signup' ? 'idle' : 'signup'); setAuthError(''); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.authBtnText, authMode === 'signup' && styles.authBtnTextActive]}>
                      Create Account
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.authBtn, authMode === 'login' && styles.authBtnActive]}
                    onPress={() => { setAuthMode(m => m === 'login' ? 'idle' : 'login'); setAuthError(''); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.authBtnText, authMode === 'login' && styles.authBtnTextActive]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>

                {authMode !== 'idle' && (
                  <View style={styles.form}>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Email address"
                      placeholderTextColor={MUTED}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Password"
                      placeholderTextColor={MUTED}
                      secureTextEntry
                    />
                    {authError !== '' && (
                      <Text style={styles.errorText}>{authError}</Text>
                    )}
                    <TouchableOpacity
                      style={[styles.saveBtn, (!email || !password) && styles.saveBtnOff]}
                      onPress={handleAuth}
                      activeOpacity={0.85}
                      disabled={authLoading || !email || !password}
                    >
                      {authLoading
                        ? <ActivityIndicator color="#000" />
                        : <Text style={styles.saveBtnText}>
                            {authMode === 'signup' ? 'Create Account →' : 'Sign In →'}
                          </Text>
                      }
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings')}</Text>
            <View style={styles.settingsList}>

              {/* Notifications */}
              <TouchableOpacity
                style={[styles.settingRow, styles.settingRowBorder]}
                onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setNotifOn(v => !v); }}
                activeOpacity={0.7}
              >
                <Image source={ICONS.bell} style={styles.settingIconImg} resizeMode="contain" />
                <Text style={styles.settingLabel}>{t('dailyReminders')}</Text>
                <View style={[styles.toggle, notifOn && styles.toggleOn]}>
                  <View style={[styles.toggleThumb, notifOn && styles.toggleThumbOn]} />
                </View>
              </TouchableOpacity>

              {/* Language */}
              <TouchableOpacity
                style={[styles.settingRow, styles.settingRowBorder]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowLangPicker(v => !v); }}
                activeOpacity={0.7}
              >
                <Image source={currentLang.flagImg} style={styles.settingIconImg} resizeMode="contain" />
                <Text style={styles.settingLabel}>{t('language')}</Text>
                <Text style={styles.settingValue}>{currentLang.label} {showLangPicker ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showLangPicker && (
                <View style={styles.picker}>
                  {LANGUAGES.map(lang => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[styles.pickerOption, language === lang.code && styles.pickerOptionActive]}
                      onPress={() => handleLangSelect(lang.code)}
                      activeOpacity={0.75}
                    >
                      <Image source={lang.flagImg} style={styles.pickerFlagImg} resizeMode="contain" />
                      <Text style={[styles.pickerLabel, language === lang.code && { color: BRAND }]}>
                        {lang.label}
                      </Text>
                      {language === lang.code && <Text style={styles.pickerCheck}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Difficulty */}
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowDiffPicker(v => !v); }}
                activeOpacity={0.7}
              >
                <Image source={currentDiffIcon} style={styles.settingIconImg} resizeMode="contain" />
                <Text style={styles.settingLabel}>{t('difficulty')}</Text>
                <Text style={styles.settingValue}>{currentDiff.label} {showDiffPicker ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showDiffPicker && (
                <View style={styles.picker}>
                  {DIFFICULTIES.map(d => (
                    <TouchableOpacity
                      key={d.key}
                      style={[styles.pickerOption, level === d.key && styles.pickerOptionActive]}
                      onPress={() => handleDiffSelect(d.key)}
                      activeOpacity={0.75}
                    >
                      <Image source={d.icon} style={styles.pickerDiffImg} resizeMode="contain" />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.pickerLabel, level === d.key && { color: BRAND }]}>{d.label}</Text>
                        <Text style={styles.pickerDesc}>{d.desc}</Text>
                      </View>
                      {level === d.key && <Text style={styles.pickerCheck}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <Text style={styles.versionText}>{t('versionText')}</Text>

          {/* Dev reset — clears all data and restarts onboarding */}
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              await clearState();
              // Reload the app
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.resetBtnText}>Reset App (Dev)</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8, gap: 20 },

  screenTitle: { color: '#FFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },

  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: SURFACE, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: BORDER,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#000', fontSize: 24, fontWeight: '900' },
  profileRight: { flex: 1, gap: 5 },
  profileName: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelEmoji: { fontSize: 16 },
  levelDot: { width: 10, height: 10, borderRadius: 5 },
  levelTitle: { fontSize: 13, fontWeight: '700' },
  levelNum: { color: MUTED, fontSize: 11 },
  xpBarTrack: { height: 6, backgroundColor: BORDER, borderRadius: 99, overflow: 'hidden' },
  xpBarFill: { height: '100%', borderRadius: 99 },
  xpText: { color: MUTED, fontSize: 10 },

  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: SURFACE, borderRadius: 14, padding: 14,
    alignItems: 'center', gap: 4, borderWidth: 1, borderColor: BORDER,
  },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  statLabel: { color: MUTED, fontSize: 10, textAlign: 'center' },

  section: { gap: 10 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  accountCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: SURFACE, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: BORDER,
  },
  cardTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  cardSub: { color: MUTED, fontSize: 12 },

  authBtns: { flexDirection: 'row', gap: 10 },
  authBtn: {
    flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center',
    backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER,
  },
  authBtnActive: { backgroundColor: BRAND, borderColor: BRAND },
  authBtnText: { color: MUTED, fontSize: 14, fontWeight: '700' },
  authBtnTextActive: { color: '#000' },

  logoutBtn: { backgroundColor: SURFACE, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: BORDER },
  logoutBtnText: { color: MUTED, fontSize: 12, fontWeight: '600' },

  form: {
    backgroundColor: SURFACE, borderRadius: 16, padding: 16, gap: 10,
    borderWidth: 1, borderColor: BORDER,
  },
  input: {
    backgroundColor: BG, borderRadius: 12, padding: 13,
    color: '#FFF', fontSize: 14, borderWidth: 1, borderColor: BORDER,
  },
  errorText: { color: ERROR, fontSize: 12, lineHeight: 17 },
  saveBtn: { backgroundColor: BRAND, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveBtnOff: { backgroundColor: '#2C2C2E' },
  saveBtnText: { color: '#000', fontSize: 14, fontWeight: '800' },

  settingsList: {
    backgroundColor: SURFACE, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: BORDER,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 15, gap: 12,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: BORDER },
  settingIcon: { fontSize: 18, width: 26 },
  settingIconImg: { width: 28, height: 28 },
  accountIcon: { width: 40, height: 40 },
  pickerDiffImg: { width: 36, height: 36 },
  settingLabel: { flex: 1, color: '#FFF', fontSize: 14 },
  settingValue: { color: MUTED, fontSize: 13 },

  toggle: {
    width: 44, height: 26, borderRadius: 13,
    backgroundColor: BORDER, justifyContent: 'center', paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: BRAND },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#888' },
  toggleThumbOn: { backgroundColor: '#000', alignSelf: 'flex-end' },

  picker: { backgroundColor: '#0A0A0A', borderTopWidth: 1, borderTopColor: BORDER },
  pickerOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, gap: 12,
    borderBottomWidth: 1, borderBottomColor: '#0F0F0F',
  },
  pickerOptionActive: { backgroundColor: `${BRAND}10` },
  pickerFlag: { fontSize: 20 },
  pickerFlagImg: { width: 28, height: 28 },
  pickerLabel: { flex: 1, color: '#FFF', fontSize: 14, fontWeight: '500' },
  pickerDesc: { color: MUTED, fontSize: 11, marginTop: 1 },
  pickerCheck: { color: BRAND, fontSize: 16, fontWeight: '800' },

  versionText: { color: '#3A3A3C', fontSize: 11, textAlign: 'center' },
  resetBtn: { borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FF453A30', backgroundColor: '#FF453A10' },
  resetBtnText: { color: '#FF453A', fontSize: 12, fontWeight: '700' },
});
