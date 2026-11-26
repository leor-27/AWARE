import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { NavPaperArrowIcon, PersonPinIcon } from '../../components/AwareIcons';
import { colors, radii, spacing } from '../../theme/tokens';
import {
  FeedbackPreferences,
  speakCue,
  triggerHaptic,
} from '../../utils/feedback';
import { EmergencyContact } from './EmergencyScreen';
import { SosSessionFlow, SosViewState } from './SosSessionFlow';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

const DESTINATIONS = [
  'Deca Grandvale 3, San Felipe, Naga City',
  'Magsaysay Avenue, Naga City',
  'Naga City Police Office',
];

interface NavigationScreenProps {
  feedbackPrefs: FeedbackPreferences;
  location: Coordinates;
  onLocationUpdate: (coords: Coordinates) => void;
  contacts: EmergencyContact[];
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
  onDispatchSosAlert: (messageText: string) => void;
}

export const NavigationScreen: React.FC<NavigationScreenProps> = ({
  feedbackPrefs,
  location,
  onLocationUpdate,
  contacts,
  onUpdateContacts,
  onDispatchSosAlert,
}) => {
  const [navState, setNavState] = useState<'locating' | 'located'>('locating');
  const [destIndex, setDestIndex] = useState(0);
  const [sosInitialView, setSosInitialView] = useState<SosViewState | null>(null);

  const destinationName = DESTINATIONS[destIndex];

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Location.requestForegroundPermissionsAsync()
        .then(({ status }) => {
          if (status === 'granted') {
            return Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
          }
          return null;
        })
        .then((pos) => {
          if (pos) {
            onLocationUpdate({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            });
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sosInitialView !== null || navState !== 'locating') return;
    speakCue(`Locating destination. ${destinationName}`, feedbackPrefs);
    const timer = setTimeout(() => {
      setNavState('located');
      triggerHaptic('success', feedbackPrefs.hapticsEnabled);
      speakCue(`Destination located. ${destinationName}`, feedbackPrefs);
    }, 2600);
    return () => clearTimeout(timer);
  }, [navState, destinationName, feedbackPrefs, sosInitialView]);

  if (sosInitialView !== null) {
    return (
      <SosSessionFlow
        initialView={sosInitialView}
        feedbackPrefs={feedbackPrefs}
        location={location}
        contacts={contacts}
        onUpdateContacts={onUpdateContacts}
        onDispatchSosAlert={onDispatchSosAlert}
        onBackToNavigation={() => setSosInitialView(null)}
      />
    );
  }

  const handleCirclePress = () => {
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    if (navState === 'locating') {
      setNavState('located');
      speakCue(`Destination located. ${destinationName}`, feedbackPrefs);
    } else {
      const next = (destIndex + 1) % DESTINATIONS.length;
      setDestIndex(next);
      setNavState('locating');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topTitle}>Audio & Vibration Feedback</Text>

      <View style={styles.centerSection}>
        <Text style={styles.headline}>
          {navState === 'locating'
            ? 'Locating destination...'
            : 'Destination located'}
        </Text>
        <Text style={styles.subheadline}>{destinationName}</Text>

        <Pressable
          onPress={handleCirclePress}
          accessibilityRole="button"
          accessibilityLabel={
            navState === 'locating'
              ? `Locating destination ${destinationName}`
              : `Destination located ${destinationName}. Tap to switch destination.`
          }
          style={({ pressed }) => [
            styles.outerRing,
            pressed && styles.buttonPressed,
          ]}
        >
          <View style={styles.middleRing}>
            <View style={styles.mainCircle}>
              {navState === 'locating' ? (
                <NavPaperArrowIcon size={98} color={colors.white} />
              ) : (
                <PersonPinIcon size={102} color={colors.white} />
              )}
            </View>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            setSosInitialView('sos-home');
          }}
          accessibilityRole="button"
          accessibilityLabel="Open Emergency SOS"
          style={({ pressed }) => [
            styles.emergencyBtn,
            pressed && { opacity: 0.88 },
          ]}
        >
          <Text style={styles.emergencyBtnText}>Emergency SOS</Text>
        </Pressable>
      </View>
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
    maxWidth: 290,
    marginBottom: 28,
  },
  outerRing: {
    width: 224,
    height: 224,
    borderRadius: 112,
    borderWidth: 2,
    borderColor: 'rgba(100, 125, 112, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginBottom: 24,
  },
  middleRing: {
    width: 208,
    height: 208,
    borderRadius: 104,
    borderWidth: 2,
    borderColor: 'rgba(100, 125, 112, 0.42)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  mainCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.sage,
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
  emergencyBtn: {
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  emergencyBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.white,
  },
});
