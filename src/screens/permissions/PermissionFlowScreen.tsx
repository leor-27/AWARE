import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import Svg, { Polyline } from 'react-native-svg';
import {
  CameraPermissionIcon,
  LocationPermissionIcon,
  MicPermissionIcon,
  SosShortcutPermissionIcon,
} from '../../components/AwareIcons';
import { colors, radii, spacing } from '../../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../../utils/feedback';

interface PermissionStep {
  stepLabel: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  renderIcon: () => React.ReactNode;
}

const PERMISSION_STEPS: PermissionStep[] = [
  {
    stepLabel: '1 of 4',
    title: 'Camera Access',
    description:
      'Camera Access allows AWARE to use your device’s camera to detect objects and provide real-time environmental awareness.',
    bullets: [
      'Only active when Smart Vision is enabled',
      'Identifies supported objects in your surroundings',
      'Used to estimate how far detected objects are from you',
    ],
    cta: 'Allow camera access',
    renderIcon: () => <CameraPermissionIcon size={108} />,
  },
  {
    stepLabel: '2 of 4',
    title: 'Microphone\nAccess',
    description:
      'Microphone Access allows AWARE to use your device’s microphone for interaction and talkback.',
    bullets: [
      'Only active when Audio & Vibration Feedback is enabled',
      'Allows talkback and activation support through speech',
      'Used for activating features and replying in feedback',
    ],
    cta: 'Allow microphone access',
    renderIcon: () => <MicPermissionIcon size={108} />,
  },
  {
    stepLabel: '3 of 4',
    title: 'Location Access',
    description:
      'Location Access allows AWARE to use your device’s location to track and provide location updates.',
    bullets: [
      'Only active when Navigation and Mapping is enabled',
      'Maps surrounding paths and tracks your location in real time',
      'Guides you directly to nearby emergency facilities like hospitals and police stations',
    ],
    cta: 'Allow location access',
    renderIcon: () => <LocationPermissionIcon size={108} />,
  },
  {
    stepLabel: '4 of 4',
    title: 'SOS Shortcut',
    description:
      'Allow AWARE to use your volume buttons to trigger an SOS call when you need help.',
    bullets: [
      'Press volume up and down together',
      'Hold both buttons for 3 seconds to trigger an SOS call',
      'Release before 3 seconds to cancel',
    ],
    cta: 'Enable SOS shortcut',
    renderIcon: () => <SosShortcutPermissionIcon size={108} />,
  },
];

interface PermissionFlowScreenProps {
  feedbackPrefs: FeedbackPreferences;
  onComplete: () => void;
}

export const PermissionFlowScreen: React.FC<PermissionFlowScreenProps> = ({
  feedbackPrefs,
  onComplete,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 460);
  const [stepIdx, setStepIdx] = useState(0);
  const [, requestCamera] = useCameraPermissions();

  const current = PERMISSION_STEPS[stepIdx];

  const handleAllow = async () => {
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);

    if (Platform.OS !== 'web') {
      try {
        if (stepIdx === 0) {
          await requestCamera();
        } else if (stepIdx === 2) {
          await Location.requestForegroundPermissionsAsync();
        }
      } catch {
        // Proceed even if simulator declines permission
      }
    }

    if (stepIdx < PERMISSION_STEPS.length - 1) {
      const next = stepIdx + 1;
      setStepIdx(next);
      speakCue(
        `${PERMISSION_STEPS[next].title.replace('\n', ' ')}. ${PERMISSION_STEPS[next].description}`,
        feedbackPrefs
      );
    } else {
      speakCue('All permissions configured. Smart Vision is ready.', feedbackPrefs);
      onComplete();
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.container, { width: clampedWidth }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top-right step badge */}
        <View style={styles.badgeRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{current.stepLabel}</Text>
          </View>
        </View>

        <View style={styles.iconWrap}>{current.renderIcon()}</View>

        <Text style={styles.eyebrow}>Permission Needed</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>

        {/* Sage outlined checklist card */}
        <View style={styles.checklistCard}>
          {current.bullets.map((bullet, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View style={styles.checkCircle}>
                <Svg width={13} height={13} viewBox="0 0 16 16" fill="none">
                  <Polyline
                    points="3.5,8.5 6.5,11.5 12.5,5"
                    stroke={colors.white}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={handleAllow}
          accessibilityRole="button"
          accessibilityLabel={current.cta}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <Text style={styles.ctaText}>{current.cta}</Text>
        </Pressable>
      </ScrollView>
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
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  badgeRow: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  stepBadge: {
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  stepBadgeText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '600',
  },
  iconWrap: {
    marginTop: 6,
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.sage,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'left',
    width: '100%',
    marginBottom: 20,
  },
  checklistCard: {
    width: '100%',
    borderWidth: 1.8,
    borderColor: colors.sage,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 18,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginBottom: 28,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#AAB5AE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18.5,
    color: colors.textPrimary,
  },
  ctaButton: {
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 196,
    alignItems: 'center',
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
