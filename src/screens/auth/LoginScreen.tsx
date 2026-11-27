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
  LockIcon,
  MailIcon,
} from '../../components/AwareIcons';
import { SplashIllustration } from '../../components/AwareIllustrations';
import { colors, radii, spacing } from '../../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../../utils/feedback';
import type { UserRole } from '../RoleSelectionScreen';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

interface LoginScreenProps {
  feedbackPrefs: FeedbackPreferences;
  role: UserRole;
  accounts: Array<{ role: UserRole; email: string; password: string; profile: UserProfile }>;
  onLoginSuccess: (profile?: Partial<UserProfile>) => void;
  onGoToSignUp: () => void;
  onGoToForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  feedbackPrefs,
  role,
  accounts,
  onLoginSuccess,
  onGoToSignUp,
  onGoToForgotPassword,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 370);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleLogin = () => {
    const trimmed = identifier.trim().toLowerCase();
    const account = accounts.find(
      (item) => item.role === role && item.email.toLowerCase() === trimmed && item.password === password
    );
    if (!account) {
      setLoginError(true);
      return;
    }
    setLoginError(false);
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    speakCue('Logged in to AWARE.', feedbackPrefs);
    onLoginSuccess(account.profile);
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
          <View style={styles.illustrationWrap}>
            <SplashIllustration width={215} />
          </View>

          <Text style={styles.title}>
            Welcome to <Text style={styles.titleBrand}>AWARE</Text>
          </Text>
          <Text style={styles.subtitle}>Explore the world, your way</Text>
          <View style={styles.form}>
            <View style={styles.inputPill}>
              <MailIcon size={18} color={colors.sage} />
              <TextInput
                value={identifier}
                onChangeText={(value) => { setIdentifier(value); setLoginError(false); }}
                placeholder="Email or Phone Number"
                placeholderTextColor={colors.sage}
                autoCapitalize="none"
                style={styles.input}
                accessibilityLabel="Email or Phone Number"
              />
            </View>

            <View style={styles.inputPill}>
              <LockIcon size={18} color={colors.sage} />
              <TextInput
                value={password}
                onChangeText={(value) => { setPassword(value); setLoginError(false); }}
                placeholder="Password"
                placeholderTextColor={colors.sage}
                secureTextEntry={!showPassword}
                style={styles.input}
                accessibilityLabel="Password"
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

            {loginError && (
              <View style={styles.loginErrorWrap}>
                <Text style={styles.loginErrorText}>
                  Account not found. Create an account first.
                </Text>
                <Pressable onPress={onGoToSignUp} accessibilityRole="link">
                  <Text style={styles.loginErrorLink}>Create account</Text>
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={() => {
                onGoToForgotPassword();
                triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              }}
              style={styles.forgotWrap}
              accessibilityRole="link"
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            <Pressable
              onPress={handleLogin}
              accessibilityRole="button"
              accessibilityLabel="Login"
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.primaryBtnPressed,
              ]}
            >
              <Text style={styles.primaryBtnText}>Login</Text>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Continue With</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('success', feedbackPrefs.hapticsEnabled);
                setLoginError(true);
              }}
              style={styles.socialItem}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
            >
              <GoogleLogoIcon size={24} />
              <Text style={styles.socialLabel}>Google</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic('success', feedbackPrefs.hapticsEnabled);
                onLoginSuccess({ name: 'Guest User', email: '', phone: '' });
              }}
              style={styles.socialItem}
              accessibilityRole="button"
              accessibilityLabel="Continue as Guest"
            >
              <GuestUserIcon size={24} color={colors.textSecondary} />
              <Text style={styles.socialLabel}>Guest</Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Need an account? </Text>
            <Pressable onPress={onGoToSignUp} accessibilityRole="link">
              <Text style={styles.footerLink}>Sign up</Text>
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
  illustrationWrap: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  titleBrand: {
    fontWeight: '800',
    color: colors.navy,
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.sage,
    marginTop: 6,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 14,
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#8B9A91',
    borderRadius: radii.pill,
    paddingHorizontal: 16,
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
  loginErrorWrap: {
    alignItems: 'center',
    gap: 4,
  },
  loginErrorText: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
  },
  loginErrorLink: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -2,
    marginBottom: 4,
  },
  forgotText: {
    fontSize: 12,
    color: colors.sage,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
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
    marginVertical: 24,
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
    marginBottom: 24,
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
