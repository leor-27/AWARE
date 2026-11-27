import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BlindRoleIcon,
  TrustedRoleIcon,
} from '../components/AwareIllustrations';
import { OrganicBackground } from '../components/OrganicBackground';
import { colors, radii, spacing } from '../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../utils/feedback';

export type UserRole = 'blind' | 'trusted';

interface RoleSelectionScreenProps {
  initialRole?: UserRole | null;
  feedbackPrefs: FeedbackPreferences;
  onGetStarted: (role: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  initialRole = null,
  feedbackPrefs,
  onGetStarted,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 390);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(initialRole);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    speakCue(
      role === 'blind'
        ? 'Blind Individual selected. Tap Get Started to continue.'
        : 'Trusted Contact selected. Tap Get Started to continue.',
      feedbackPrefs
    );
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    onGetStarted(selectedRole);
  };

  return (
    <View style={styles.root}>
      <OrganicBackground variant={selectedRole ? 'role-active' : 'role-neutral'} />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { width: clampedWidth }]}>
          <View style={styles.mainContent}>
            <Text style={styles.heading}>Choose your role</Text>
            <Text style={styles.subheading}>
              Select the option that best describes how you will use AWARE.
            </Text>

            <View style={styles.cardsRow}>
              {/* Blind Individual Card */}
              <Pressable
                onPress={() => handleSelectRole('blind')}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedRole === 'blind' }}
                accessibilityLabel="Blind Individual. Access AWARE and connect with the people you trust."
                style={({ pressed }) => [
                  styles.card,
                  selectedRole === 'blind' && styles.cardSelected,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.cardIconWrap}>
                  <BlindRoleIcon
                    size={62}
                    color={selectedRole === 'blind' ? colors.white : colors.sage}
                  />
                </View>
                <Text
                  style={[
                    styles.cardTitle,
                    selectedRole === 'blind' && styles.cardTitleSelected,
                  ]}
                >
                  Blind Individual
                </Text>
                <Text
                  style={[
                    styles.cardBody,
                    selectedRole === 'blind' && styles.cardBodySelected,
                  ]}
                >
                  Access AWARE and connect with the people you trust.
                </Text>
              </Pressable>

              {/* Trusted Contact Card */}
              <Pressable
                onPress={() => handleSelectRole('trusted')}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedRole === 'trusted' }}
                accessibilityLabel="Trusted Contact. Support a blind individual as part of their trusted circle."
                style={({ pressed }) => [
                  styles.card,
                  selectedRole === 'trusted' && styles.cardSelected,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.cardIconWrap}>
                  <TrustedRoleIcon
                    size={62}
                    color={selectedRole === 'trusted' ? colors.white : colors.sage}
                  />
                </View>
                <Text
                  style={[
                    styles.cardTitle,
                    selectedRole === 'trusted' && styles.cardTitleSelected,
                  ]}
                >
                  Trusted Contact
                </Text>
                <Text
                  style={[
                    styles.cardBody,
                    selectedRole === 'trusted' && styles.cardBodySelected,
                  ]}
                >
                  Support a blind individual as part of their trusted circle.
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              disabled={!selectedRole}
              onPress={handleContinue}
              accessibilityRole="button"
              accessibilityState={{ disabled: !selectedRole }}
              accessibilityLabel="Get Started"
              style={({ pressed }) => [
                styles.ctaButton,
                selectedRole ? styles.ctaButtonEnabled : styles.ctaButtonDisabled,
                pressed && selectedRole && styles.ctaButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.ctaText,
                  selectedRole ? styles.ctaTextEnabled : styles.ctaTextDisabled,
                ]}
              >
                Get Started
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  heading: {
    fontSize: 33,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardUnselected,
    borderWidth: 1.2,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    paddingVertical: 22,
    paddingHorizontal: 14,
    alignItems: 'center',
    minHeight: 208,
    shadowColor: '#2E4057',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSelected: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
  },
  cardIconWrap: {
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardTitleSelected: {
    color: colors.white,
  },
  cardBody: {
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cardBodySelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  footer: {
    alignItems: 'flex-end',
    paddingBottom: spacing.xl,
  },
  ctaButton: {
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: 26,
    minWidth: 138,
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: '#CBD1CD',
  },
  ctaButtonEnabled: {
    backgroundColor: colors.navy,
    shadowColor: colors.navyDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  ctaText: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  ctaTextDisabled: {
    color: '#8E9792',
  },
  ctaTextEnabled: {
    color: colors.white,
  },
});
