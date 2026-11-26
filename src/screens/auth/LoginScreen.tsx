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

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

interface LoginScreenProps {
  feedbackPrefs: FeedbackPreferences;
  onLoginSuccess: (profile?: Partial<UserProfile>) => void;
  onGoToSignUp: () => void;
  onGoToForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  feedbackPrefs,
  onLoginSuccess,
  onGoToSignUp,
  onGoToForgotPassword,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 460);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    speakCue('Logged in to AWARE.', feedbackPrefs);
    const trimmed = identifier.trim();
    if (trimmed.includes('@')) {
      onLoginSuccess({ email: trimmed });
    } else if (trimmed.length > 0) {
      onLoginSuccess({ phone: trimmed });
    } else {
      onLoginSuccess();
    }
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
                onChangeText={setIdentifier}
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
                onChangeText={setPassword}
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

            <Pressable
              onPress={() => {
                triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
                onGoToForgotPassword();
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
                onLoginSuccess();
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
                onLoginSuccess({ name: 'Guest User' });
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
