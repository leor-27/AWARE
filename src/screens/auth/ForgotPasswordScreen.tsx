import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackArrowIcon, PadlockLargeIcon } from '../../components/AwareIcons';
import { colors, radii, spacing } from '../../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../../utils/feedback';

interface ForgotPasswordScreenProps {
  feedbackPrefs: FeedbackPreferences;
  onBack: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  feedbackPrefs,
  onBack,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 390);
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [query, setQuery] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const handleContinue = () => {
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    setSentNotice(true);
    speakCue(
      mode === 'phone'
        ? 'Recovery code sent to your phone number.'
        : 'Password reset link sent to your email.',
      feedbackPrefs
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.container, { width: clampedWidth }]}>
        <View style={styles.topRow}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back to login"
            style={styles.backFab}
          >
            <BackArrowIcon size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.centerBlock}>
          <PadlockLargeIcon size={84} />

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Find your account via email or phone.
          </Text>

          <View style={styles.inputBox}>
            <TextInput
              value={query}
              onChangeText={(val) => {
                setQuery(val);
                if (sentNotice) setSentNotice(false);
              }}
              placeholder={mode === 'phone' ? 'Phone Number' : 'Email Address'}
              placeholderTextColor={colors.sage}
              keyboardType={mode === 'phone' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {sentNotice && (
            <View style={styles.noticePill}>
              <Text style={styles.noticeText}>
                Reset instructions dispatched. Check your{' '}
                {mode === 'phone' ? 'SMS messages' : 'inbox'}.
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleContinue}
            accessibilityRole="button"
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
              setQuery('');
              setSentNotice(false);
            }}
            accessibilityRole="button"
            style={styles.secondaryBtn}
          >
            <Text style={styles.secondaryBtnText}>
              {mode === 'phone'
                ? 'Search by Email Address'
                : 'Search by Phone Number'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  topRow: {
    alignItems: 'flex-start',
    zIndex: 2,
    elevation: 2,
  },
  backFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 18,
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.sage,
    marginTop: 8,
    marginBottom: 24,
  },
  inputBox: {
    width: '100%',
    borderWidth: 1.2,
    borderColor: '#8B9A91',
    borderRadius: 22,
    paddingHorizontal: 18,
    height: 54,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginBottom: 14,
  },
  input: {
    fontSize: 14.5,
    color: colors.textPrimary,
  },
  noticePill: {
    width: '100%',
    backgroundColor: colors.successSoft,
    borderRadius: radii.md,
    padding: 10,
    marginBottom: 12,
  },
  noticeText: {
    color: colors.success,
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 14.5,
    fontWeight: '600',
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: '#88A2C3',
    borderRadius: radii.pill,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.white,
    fontSize: 14.5,
    fontWeight: '600',
  },
});
