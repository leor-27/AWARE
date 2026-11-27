import React, { useEffect, useState } from 'react';
import {
  Platform,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { AudioSpeakerWaveIcon, MapPinOutlineIcon, NavPaperArrowIcon, PersonPinIcon, ShieldCheckIcon } from '../../components/AwareIcons';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../../theme/tokens';
import {
  FeedbackPreferences,
  speakCue,
  speakCueAndWait,
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
  const [sosInitialView, setSosInitialView] = useState<SosViewState | null>(null);
  const [routeMode, setRouteMode] = useState<'location' | 'locating' | 'destination-located' | 'navigation'>('location');

  const destinationName = DESTINATIONS[0];

  useEffect(() => {
    if (routeMode !== 'locating') return;
    const timer = setTimeout(() => setRouteMode('destination-located'), 1400);
    return () => clearTimeout(timer);
  }, [routeMode]);

  useEffect(() => {
    if (routeMode !== 'destination-located') return;
    let cancelled = false;
    const announceAndContinue = async () => {
      await speakCueAndWait(`Destination located. ${destinationName}.`, feedbackPrefs);
      if (cancelled) return;
      setRouteMode('navigation');
      speakCue('Turn right onto Magsaysay Avenue in 120 meters.', feedbackPrefs);
    };
    void announceAndContinue();
    return () => {
      cancelled = true;
    };
  }, [routeMode, destinationName, feedbackPrefs]);

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

  if (routeMode === 'locating') {
    return (
      <View style={styles.locatingContainer}>
        <Text style={styles.feedbackTitle}>Audio &amp; Vibration Feedback</Text>
        <View style={styles.locatingCenter}>
          <Text style={styles.locatingHeadline}>Locating destination...</Text>
          <Text style={styles.locatingSubheadline}>{destinationName}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Locate destination ${destinationName}.`}
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setRouteMode('destination-located');
            }}
            style={({ pressed }) => [styles.locatingOuterRing, pressed && styles.locatingPressed]}
          >
            <View style={styles.locatingMiddleRing}>
              <View style={styles.locatingMainCircle}>
                <NavPaperArrowIcon size={98} color={colors.white} />
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  if (routeMode === 'destination-located') {
    return (
      <View style={styles.locatingContainer}>
        <Text style={styles.feedbackTitle}>Audio &amp; Vibration Feedback</Text>
        <View style={styles.locatingCenter}>
          <Text style={styles.locatingHeadline}>Destination located</Text>
          <Text style={styles.locatingSubheadline}>{destinationName}</Text>
          <View style={styles.locatingOuterRing}>
            <View style={styles.locatingMiddleRing}>
              <View style={styles.locatingMainCircle}>
                <PersonPinIcon size={112} color={colors.white} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>Your Location</Text>
        <View style={styles.liveChip}><View style={styles.liveDot} /><Text style={styles.liveText}>Live</Text></View>
      </View>
      <ImageBackground source={require('../../../assets/location-map-user.png')} resizeMode="cover" style={styles.mapCanvas}>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 400 620" preserveAspectRatio="xMidYMid slice">
          {routeMode !== 'location' && <Path d="M60 330 Q120 280 197 304 T330 248" stroke={colors.navy} strokeWidth="5" strokeDasharray="10 7" fill="none" />}
        </Svg>
        {routeMode === 'navigation' && <View style={styles.turnBanner}><View style={styles.turnHeader}><Text style={styles.turnTitle}>↱  In 120 m</Text><AudioSpeakerWaveIcon size={19} color={colors.white} /></View><Text style={styles.turnSub}>Turn right onto Magsaysay Ave.</Text></View>}
        <View style={styles.mapInfo}>
          {routeMode === 'location' ? <>
            <View style={styles.infoHeading}><MapPinOutlineIcon size={21} color={colors.white} /><Text style={styles.infoTitle}>Current Location  |  3.1 km · 9:17 AM</Text></View>
            <Text style={styles.infoText}>Deca Grandvale 3, San Felipe, Naga City</Text>
            <Text style={styles.infoText}>GPS Accuracy ±5 m · Updated just now</Text>
            <View style={styles.actionRow}><Pressable onPress={() => { triggerHaptic('tap', feedbackPrefs.hapticsEnabled); speakCue('Location shared with trusted contacts.', feedbackPrefs); }} style={styles.mapAction}><Text style={styles.mapActionText}>Share Location</Text></Pressable><Pressable onPress={() => { triggerHaptic('tap', feedbackPrefs.hapticsEnabled); setRouteMode('locating'); }} style={styles.mapAction}><Text style={styles.mapActionText}>Pick Destination</Text></Pressable></View>
          </> : <>
            <View style={styles.routeStats}><Text style={styles.routeTime}>8 min</Text><View><Text style={styles.infoTitle}>600 m · Walking</Text><Text style={styles.infoText}>Arrive at 9:25 AM</Text></View></View>
            <View style={styles.divider} /><Text style={styles.infoText}>⚑  {destinationName}</Text>
            <Pressable onPress={() => setRouteMode('location')} style={styles.endAction}><Text style={styles.endActionText}>End Navigation</Text></Pressable>
          </>}
        </View>
      </ImageBackground>
      <View style={styles.privacy}><ShieldCheckIcon size={15} color={colors.sage} /><Text style={styles.privacyText}>Your location stays private until you share it.</Text><Pressable onPress={() => setSosInitialView('sos-home')}><Text style={styles.sosLink}>Emergency SOS</Text></Pressable></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  locatingContainer: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  feedbackTitle: { fontSize: 19.5, fontWeight: '500', color: colors.textPrimary, textAlign: 'center', marginTop: 6 },
  locatingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -22 },
  locatingHeadline: { fontSize: 19, fontWeight: '600', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  locatingSubheadline: { fontSize: 12.5, lineHeight: 18, color: colors.textSecondary, textAlign: 'center', maxWidth: 290, marginBottom: 28 },
  locatingOuterRing: { width: 224, height: 224, borderRadius: 112, borderWidth: 2, borderColor: 'rgba(100, 125, 112, 0.25)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.45)' },
  locatingMiddleRing: { width: 208, height: 208, borderRadius: 104, borderWidth: 2, borderColor: 'rgba(100, 125, 112, 0.42)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.65)' },
  locatingMainCircle: { width: 190, height: 190, borderRadius: 95, backgroundColor: colors.sage, justifyContent: 'center', alignItems: 'center', shadowColor: '#0E294D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 14, elevation: 6 },
  locatingPressed: { transform: [{ scale: 0.97 }] },
  mapHeader: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  mapTitle: { fontSize: 19, fontWeight: '600', color: colors.textPrimary },
  liveChip: { backgroundColor: colors.sage, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  liveText: { color: colors.white, fontSize: 11 },
  mapCanvas: { flex: 1, overflow: 'hidden', borderRadius: 16, backgroundColor: '#E4E6E1', position: 'relative' },
  turnBanner: { position: 'absolute', top: 12, left: 12, right: 12, borderRadius: 25, paddingHorizontal: 18, paddingVertical: 13, backgroundColor: colors.sage },
  turnHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  turnTitle: { color: colors.white, fontSize: 19, fontWeight: '700' },
  turnSub: { color: colors.white, fontSize: 13, marginTop: 7 },
  mapInfo: { position: 'absolute', left: 8, right: 8, bottom: 8, borderRadius: 14, padding: 16, backgroundColor: 'rgba(44,55,53,0.78)', gap: 9 },
  infoHeading: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  infoTitle: { color: colors.white, fontSize: 14, fontWeight: '600' },
  infoText: { color: colors.white, fontSize: 13, lineHeight: 19 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 3 },
  mapAction: { flex: 1, borderRadius: 24, backgroundColor: colors.navy, height: 40, justifyContent: 'center', alignItems: 'center' },
  mapActionText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  routeStats: { flexDirection: 'row', alignItems: 'center', gap: 17 },
  routeTime: { color: colors.white, fontSize: 19, fontWeight: '700' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.65)', marginVertical: 3 },
  endAction: { alignSelf: 'center', minWidth: 190, marginTop: 5, borderWidth: 1, borderColor: colors.navy, backgroundColor: colors.background, borderRadius: 24, height: 39, justifyContent: 'center', alignItems: 'center' },
  endActionText: { color: colors.navy, fontSize: 13, fontWeight: '600' },
  privacy: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 6 },
  privacyText: { flex: 1, fontSize: 10.5, color: colors.textSecondary },
  sosLink: { color: colors.navy, fontSize: 11, fontWeight: '600' },
});
