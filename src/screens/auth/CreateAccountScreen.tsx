import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  EyeIcon,
  EyeOffIcon,
  GoogleLogoIcon,
  GuestUserIcon,
} from '../../components/AwareIcons';
import { colors, radii, spacing } from '../../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../../utils/feedback';
import { UserProfile } from './LoginScreen';

interface CreateAccountScreenProps {
  feedbackPrefs: FeedbackPreferences;
  onCreateSuccess: (profile: Partial<UserProfile>, password?: string) => void;
  onGoToSignIn: () => void;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  feedbackPrefs,
  onCreateSuccess,
  onGoToSignIn,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 370);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountError, setAccountError] = useState(false);

  const handleCreate = () => {
    if (!name.trim() || !email.trim() || !password) {
      setAccountError(true);
      return;
    }
    setAccountError(false);
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    speakCue('Account created. Let us configure permissions.', feedbackPrefs);
    onCreateSuccess({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
    }, password);
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { width: clampedWidth }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started with AWARE</Text>

          <View style={styles.form}>
            <View style={styles.inputPill}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.sage}
                style={styles.input}
                accessibilityLabel="Enter your name"
              />
            </View>

            <View style={styles.inputPill}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.sage}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                accessibilityLabel="Enter your email"
              />
            </View>

            <View style={styles.inputPill}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.sage}
                keyboardType="phone-pad"
                style={styles.input}
                accessibilityLabel="Enter your phone number"
              />
            </View>

            <View style={styles.inputPill}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a Password"
                placeholderTextColor={colors.sage}
                secureTextEntry={!showPassword}
                style={styles.input}
                accessibilityLabel="Create a Password"
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeIcon size={18} color={colors.sage} />
                ) : (
                  <EyeOffIcon size={18} color={colors.sage} />
                )}
              </Pressable>
            </View>

            <Pressable
              onPress={handleCreate}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.primaryBtnPressed,
              ]}
            >
              <Text style={styles.primaryBtnText}>Create Account</Text>
            </Pressable>
          </View>

          {accountError && (
            <Text style={styles.accountError}>
              Enter your name, email, and password to create an account.
            </Text>
          )}

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Continue With</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('success', feedbackPrefs.hapticsEnabled);
                onCreateSuccess({});
              }}
              style={styles.socialItem}
              accessibilityRole="button"
            >
              <GoogleLogoIcon size={24} />
              <Text style={styles.socialLabel}>Google</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic('success', feedbackPrefs.hapticsEnabled);
                onCreateSuccess({ name: 'Guest User' });
              }}
              style={styles.socialItem}
              accessibilityRole="button"
            >
              <GuestUserIcon size={24} color={colors.textSecondary} />
              <Text style={styles.socialLabel}>Guest</Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={onGoToSignIn} accessibilityRole="link">
              <Text style={styles.footerLink}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.sage,
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 15,
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#8B9A91',
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.45)',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  primaryBtn: {
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  accountError: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  primaryBtnPressed: {
    opacity: 0.9,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  dividerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D6DCD8',
  },
  dividerText: {
    fontSize: 11.5,
    color: colors.sage,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 36,
    marginBottom: 26,
  },
  socialItem: {
    alignItems: 'center',
    gap: 6,
  },
  socialLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12.5,
    color: colors.sage,
  },
  footerLink: {
    fontSize: 12.5,
    color: colors.sage,
    fontWeight: '700',
  },
});
