import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

export type HapticPattern = 'tap' | 'success' | 'warning' | 'sos';

export interface FeedbackPreferences {
  voiceEnabled: boolean;
  hapticsEnabled: boolean;
  speechRate: number;
  alertDistanceMeters: number;
  vibrationIntensity: number;
  audioIntensity: number;
}

export const defaultFeedbackPreferences: FeedbackPreferences = {
  voiceEnabled: true,
  hapticsEnabled: true,
  speechRate: 1.0,
  alertDistanceMeters: 2.0,
  vibrationIntensity: 40,
  audioIntensity: 40,
};

/**
 * Speaks an announcement using Expo Speech, stopping any prior queued utterance
 * so blind users receive immediate, up-to-date spatial cues.
 */
export function speakCue(
  message: string,
  prefs: Pick<
    FeedbackPreferences,
    'voiceEnabled' | 'speechRate' | 'audioIntensity'
  >
): void {
  if (!prefs.voiceEnabled || prefs.audioIntensity <= 0 || !message.trim()) {
    return;
  }

  try {
    Speech.stop();
    Speech.speak(message, {
      language: 'en-US',
      rate: prefs.speechRate,
      pitch: 1.0,
      volume: Math.max(0.1, Math.min(1, prefs.audioIntensity / 100)),
    });
  } catch {
    // Ignore speech errors on unsupported web browsers
  }
}

export function stopSpeaking(): void {
  try {
    Speech.stop();
  } catch {
    // No-op
  }
}

/**
 * Triggers tactile haptic alerts tailored for navigation and emergency feedback.
 */
export async function triggerHaptic(
  pattern: HapticPattern,
  enabled = true
): Promise<void> {
  if (!enabled || Platform.OS === 'web') {
    return;
  }

  try {
    if (pattern === 'tap') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (pattern === 'success') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (pattern === 'warning') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (pattern === 'sos') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      }, 180);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      }, 360);
    }
  } catch {
    // Ignore haptics errors on devices without haptic engines
  }
}
