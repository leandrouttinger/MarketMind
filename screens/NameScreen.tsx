import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';

interface Props {
  onContinue: (name: string) => void;
}

export default function NameScreen({ onContinue }: Props) {
  const [name, setName] = useState('');
  const ready = name.trim().length > 0;

  const handleContinue = async () => {
    if (!ready) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onContinue(name.trim());
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Small logo */}
        <View style={styles.logoSmall}>
          <Text style={styles.logoSmallText}>MM</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.question}>What should I{'\n'}call you?</Text>
          <Text style={styles.subtitle}>Enter the name you'd like to go by</Text>

          <TextInput
            style={[styles.input, name.length > 0 && styles.inputActive]}
            value={name}
            onChangeText={setName}
            placeholder="Your name..."
            placeholderTextColor={MUTED}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            maxLength={20}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueBtn, !ready && styles.continueBtnOff]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={[styles.continueBtnText, !ready && styles.continueBtnTextOff]}>
              Continue →
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  inner: { flex: 1, paddingHorizontal: 24 },
  logoSmall: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  logoSmallText: { color: '#000', fontSize: 16, fontWeight: '900' },
  content: { flex: 1, justifyContent: 'center', gap: 10 },
  question: {
    color: TEXT,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: { color: MUTED, fontSize: 15, marginBottom: 24 },
  input: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 18,
    color: TEXT,
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  inputActive: { borderColor: BRAND },
  footer: { paddingBottom: 40 },
  continueBtn: {
    backgroundColor: BRAND,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueBtnOff: { backgroundColor: SURFACE },
  continueBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
  continueBtnTextOff: { color: MUTED },
});
