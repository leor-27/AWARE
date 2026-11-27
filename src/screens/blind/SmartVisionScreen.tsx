import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  AlertExclamationCircleIcon,
  CarFrontIcon,
  HangingSignIcon,
  PersonBustIcon,
  EmergencySirenIcon,
  PowerIcon,
} from '../../components/AwareIcons';
import { colors, radii, spacing } from '../../theme/tokens';
import {
  FeedbackPreferences,
  speakCue,
  speakCueAndWait,
  stopSpeaking,
  triggerHaptic,
} from '../../utils/feedback';

type VisionStatus = 'idle' | 'detecting' | 'detected' | 'feedback';

interface FeedbackAlertItem {
  id: string;
  heading: string;
  prefix?: 'WARNING:' | 'CAUTION:' | 'CRITICAL:';
  message: string;
  otherCountText: string;
  iconType: 'car' | 'alert' | 'person' | 'hanging' | 'siren';
  haptic: 'tap' | 'warning' | 'sos';
}

const FEEDBACK_ALERTS: FeedbackAlertItem[] = [
  {
    id: 'car-500',
    heading: 'Car Detected',
    message: 'The Car is approximately 500 cm away',
    otherCountText: '2 other objects detected',
    iconType: 'car',
    haptic: 'tap',
  },
  {
    id: 'person-600',
    heading: 'Person Detected',
    message: 'The Person is approximately 600 cm away',
    otherCountText: '2 other objects detected',
    iconType: 'person',
    haptic: 'tap',
  },
  {
    id: 'hanging-700',
    heading: 'Hanging Object Detected',
    message: 'The Hanging Object is approximately 700 cm away',
    otherCountText: '2 other objects detected',
    iconType: 'hanging',
    haptic: 'tap',
  },
  {
    id: 'car-warning-300',
    heading: 'Car Detected',
    prefix: 'WARNING:',
    message: 'The Car is approximately 300 cm away',
    otherCountText: '2 other objects detected',
    iconType: 'alert',
    haptic: 'warning',
  },
  {
    id: 'car-caution-200',
    heading: 'Car Detected',
    prefix: 'CAUTION:',
    message: 'The Car is approximately 200 cm away',
    otherCountText: '1 other object detected',
    iconType: 'alert',
    haptic: 'warning',
  },
  {
    id: 'car-critical',
    heading: 'Car Detected',
    prefix: 'CRITICAL:',
    message: 'The Car is approximately 1 cm away',
    otherCountText: '1 other object detected',
    iconType: 'alert',
    haptic: 'sos',
  },
  {
    id: 'emergency-siren',
    heading: 'Emergency Detected',
    message: 'Activate the SOS function for assistance',
    otherCountText: '1 other object detected',
    iconType: 'siren',
    haptic: 'sos',
  },
];

interface SmartVisionScreenProps {
  feedbackPrefs: FeedbackPreferences;
  isVisible: boolean;
  onSaveRecording: (isImportant: boolean) => void;
  onStartEmergencySos: () => void;
}

export const SmartVisionScreen: React.FC<SmartVisionScreenProps> = ({
  feedbackPrefs,
  isVisible,
  onSaveRecording,
  onStartEmergencySos,
}) => {
  const [status, setStatus] = useState<VisionStatus>('idle');
  const [alertIndex, setAlertIndex] = useState(0);
  const [scanRun, setScanRun] = useState(0);
  const [completedFeedbackKey, setCompletedFeedbackKey] = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const currentAlert = FEEDBACK_ALERTS[alertIndex];
  const feedbackKey = `${scanRun}:${alertIndex}:${feedbackPrefs.voiceEnabled}:${feedbackPrefs.speechRate}:${feedbackPrefs.audioIntensity}:${feedbackPrefs.hapticsEnabled}`;
  const feedbackComplete = completedFeedbackKey === feedbackKey;

  useEffect(() => {
    if (!isVisible) return;

    if (status === 'detecting') {
      const timer = setTimeout(() => {
        setStatus('detected');
        triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
        speakCue('3 objects detected.', feedbackPrefs);
      }, 2200);
      return () => clearTimeout(timer);
    }

    if (status === 'detected') {
      const timer = setTimeout(() => {
        setAlertIndex(0);
        setStatus('feedback');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, status, feedbackPrefs]);

  useEffect(() => {
    if (!isVisible || status !== 'feedback') return;
    let cancelled = false;
    const startedAt = Date.now();
    const item = FEEDBACK_ALERTS[alertIndex];
    const announcement = `${item.heading}. ${item.prefix ? `${item.prefix} ` : ''}${item.message}. ${item.otherCountText}.`;

    const deliverFeedback = async () => {
      await Promise.all([
        triggerHaptic(item.haptic, feedbackPrefs.hapticsEnabled),
        speakCueAndWait(announcement, feedbackPrefs),
      ]);
      if (cancelled) return;

      setCompletedFeedbackKey(feedbackKey);
      if (item.id === 'emergency-siren') return;

      const remainingDisplayTime = Math.max(0, 3600 - (Date.now() - startedAt));
      if (remainingDisplayTime > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, remainingDisplayTime));
      }
      if (!cancelled) {
        setAlertIndex((prev) => (prev + 1) % FEEDBACK_ALERTS.length);
      }
    };

    void deliverFeedback();
    return () => {
      cancelled = true;
    };
  }, [isVisible, status, alertIndex, feedbackPrefs, feedbackKey]);

  const handleMainButtonPress = () => {
    if (status === 'idle') {
      setScanRun((prev) => prev + 1);
      setStatus('detecting');
      triggerHaptic('success', feedbackPrefs.hapticsEnabled);
      speakCue(
        'Smart Vision is active. Detecting nearby objects and distance.',
        feedbackPrefs
      );
      return;
    }

    if (status === 'feedback' && !feedbackComplete) return;

    if (
      status === 'feedback' &&
      currentAlert.iconType === 'siren'
    ) {
      triggerHaptic('sos', feedbackPrefs.hapticsEnabled);
      speakCue('SOS activated. Preparing your emergency message.', feedbackPrefs);
      onStartEmergencySos();
      return;
    }

    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    setShowDeactivateModal(true);
  };

  const handleConfirmDeactivate = () => {
    stopSpeaking();
    setShowDeactivateModal(false);
    setStatus('idle');
    setAlertIndex(0);
    onSaveRecording(true);
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    speakCue(
      'Smart Vision deactivated. Safety recording saved to the cloud.',
      feedbackPrefs
    );
  };

  const isActive = status !== 'idle';
  const circleColor = isActive ? colors.sage : colors.navy;

  const topTitle =
    status === 'feedback' ? 'Audio & Vibration Feedback' : 'Smart Vision';

  const headline =
    status === 'idle'
      ? 'Activate Smart Vision'
      : status === 'detecting'
      ? 'Smart Vision is Active'
      : status === 'detected'
      ? 'Object Detected'
      : currentAlert.heading;

  const bottomCaption =
    status === 'idle'
      ? 'Tap to start detection'
      : status === 'detecting'
      ? 'Detecting nearby objects and its distance...'
      : status === 'detected'
      ? '3 objects detected'
      : currentAlert.otherCountText;

  const renderCenterIcon = () => {
    if (status !== 'feedback') {
      return (
        <Svg width={104} height={104} viewBox="0 0 104 104" fill="none">
          <Path
            d="M14 34C14 29.6 17.6 26 22 26H31.5L37 18.5C38.2 16.9 40 16 42 16H62C64 16 65.8 16.9 67 18.5L72.5 26H82C86.4 26 90 29.6 90 34V77C90 81.4 86.4 85 82 85H22C17.6 85 14 81.4 14 77V34Z"
            stroke={colors.white}
            strokeWidth={5.5}
            strokeLinejoin="round"
          />
          <Circle cx="52" cy="55" r="16.5" stroke={colors.white} strokeWidth={5.5} />
          <Circle cx="76" cy="38" r="3.8" stroke={colors.white} strokeWidth={3.8} />
        </Svg>
      );
    }

    switch (currentAlert.iconType) {
      case 'car':
        return <CarFrontIcon size={102} color={colors.white} />;
      case 'alert':
        return <AlertExclamationCircleIcon size={96} />;
      case 'person':
        return <PersonBustIcon size={100} color={colors.white} />;
      case 'hanging':
        return <HangingSignIcon size={104} color={colors.white} />;
      case 'siren':
        return <EmergencySirenIcon size={102} color={colors.white} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topTitle}>{topTitle}</Text>

      <View style={styles.centerSection}>
        <Text style={styles.headline}>{headline}</Text>

        {status === 'feedback' ? (
          <Text style={styles.subheadline}>
            {currentAlert.prefix ? (
              <Text style={styles.prefixBold}>{currentAlert.prefix} </Text>
            ) : null}
            {currentAlert.message}
          </Text>
        ) : (
          <Text style={styles.subheadline}>
            {status === 'idle'
              ? 'The camera will improve your awareness of nearby objects.'
              : status === 'detecting'
              ? 'Tap the camera button to deactivate'
              : 'AWARE will provide object information'}
          </Text>
        )}

        {/* Large concentric activation / alert circle */}
        <Pressable
          onPress={handleMainButtonPress}
          disabled={status === 'feedback' && !feedbackComplete}
          onLongPress={() => {
            if (isActive) setShowDeactivateModal(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={
            status === 'feedback' && currentAlert.iconType === 'siren'
              ? 'Activate Emergency SOS'
              : isActive
              ? 'Deactivate Smart Vision'
              : 'Activate Smart Vision'
          }
          style={({ pressed }) => [
            styles.outerRing,
            {
              borderColor: isActive
                ? 'rgba(100, 125, 112, 0.25)'
                : 'rgba(23, 75, 138, 0.2)',
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <View
            style={[
              styles.middleRing,
              {
                borderColor: isActive
                  ? 'rgba(100, 125, 112, 0.42)'
                  : 'rgba(23, 75, 138, 0.35)',
              },
            ]}
          >
            <View style={[styles.mainCircle, { backgroundColor: circleColor }]}>
              {renderCenterIcon()}
            </View>
          </View>
        </Pressable>

        <Pressable
          disabled={status !== 'detected' && !(status === 'feedback' && feedbackComplete)}
          onPress={() => {
            if (status === 'detected') {
              setAlertIndex(0);
              setStatus('feedback');
            } else if (status === 'feedback' && feedbackComplete) {
              setAlertIndex((prev) => (prev + 1) % FEEDBACK_ALERTS.length);
            }
          }}
          accessibilityRole={
            status === 'detected' || (status === 'feedback' && feedbackComplete)
              ? 'button'
              : undefined
          }
          accessibilityLabel={bottomCaption}
        >
          <Text style={styles.bottomCaption}>{bottomCaption}</Text>
        </Pressable>
      </View>

      {/* Deactivate Confirmation Modal */}
      <Modal
        visible={showDeactivateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeactivateModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <PowerIcon size={30} color={colors.sage} />
            </View>

            <Text style={styles.modalTitle}>Deactivate Smart Vision?</Text>
            <Text style={styles.modalBody}>
              Object detection and automatic safety recording will stop. Your
              current recording will be saved to the cloud before Smart Vision
              turns off.
            </Text>

            <Pressable
              onPress={() => {
                triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
                setShowDeactivateModal(false);
              }}
              accessibilityRole="button"
              style={styles.modalPrimaryBtn}
            >
              <Text style={styles.modalPrimaryText}>Keep Smart Vision on</Text>
            </Pressable>

            <Pressable
              onPress={handleConfirmDeactivate}
              accessibilityRole="button"
              style={styles.modalOutlineBtn}
            >
              <Text style={styles.modalOutlineText}>Yes, deactivate</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  topTitle: {
    fontSize: 19.5,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 6,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -22,
  },
  headline: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 270,
    marginBottom: 28,
  },
  prefixBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  outerRing: {
    width: 224,
    height: 224,
    borderRadius: 112,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginBottom: 26,
  },
  middleRing: {
    width: 208,
    height: 208,
    borderRadius: 104,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  mainCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0E294D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  bottomCaption: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(205, 210, 212, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: colors.background,
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingVertical: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  modalIconWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  modalPrimaryBtn: {
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalPrimaryText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '600',
  },
  modalOutlineBtn: {
    borderWidth: 1.2,
    borderColor: colors.navy,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  modalOutlineText: {
    color: colors.textSecondary,
    fontSize: 13.5,
    fontWeight: '600',
  },
});
