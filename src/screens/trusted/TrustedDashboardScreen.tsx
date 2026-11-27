import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { OpenStreetMap } from '../../components/OpenStreetMap';
import { AwareWordmark } from '../../components/AwareIllustrations';
import { TabLocationIcon, TabProfileIcon, TabVideoIcon } from '../../components/AwareIcons';
import { ProfileScreen } from '../profile/ProfileScreen';
import { UserProfile } from '../auth/LoginScreen';
import { VideoRecordingItem, VideoRecordingsScreen } from '../blind/VideoRecordingsScreen';
import { colors, radii, spacing } from '../../theme/tokens';
import {
  FeedbackPreferences,
  triggerHaptic,
} from '../../utils/feedback';
import { Coordinates } from '../blind/NavigationScreen';

export interface SosAlertEvent {
  id: string;
  timestamp: string;
  message: string;
  acknowledged: boolean;
  deliveryAttempts: number;
}

interface TrustedDashboardScreenProps {
  profile: UserProfile;
  hasDemoConnection: boolean;
  onUpdateProfile: (profile: UserProfile) => void;
  feedbackPrefs: FeedbackPreferences;
  onUpdatePrefs: (prefs: FeedbackPreferences) => void;
  recordings: VideoRecordingItem[];
  onToggleImportantRecording: (id: string) => void;
  onSignOut: () => void;
  location: Coordinates;
  alerts: SosAlertEvent[];
  onAcknowledgeAlert: (id: string) => void;
  onSimulateIncomingAlert: () => void;
  onReplayOnboarding: () => void;
  onSwitchRole: () => void;
}

export const TrustedDashboardScreen: React.FC<TrustedDashboardScreenProps> = ({
  profile,
  hasDemoConnection,
  onUpdateProfile,
  feedbackPrefs,
  onUpdatePrefs,
  recordings,
  onToggleImportantRecording,
  onSignOut,
  location,
  alerts,
  onAcknowledgeAlert,
  onReplayOnboarding,
  onSwitchRole,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 370);
  const [monitoring, setMonitoring] = useState(false);
  const [activeTab, setActiveTab] = useState<'recordings' | 'location' | 'profile'>('location');

  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  const handleOpenMap = () => {
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    setMonitoring(true);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.shell, { width: clampedWidth }]}>
        {activeTab === 'location' && (
          <>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <AwareWordmark width={96} color={colors.navy} />
            <View style={styles.rolePill}>
              <Text style={styles.rolePillText}>Trusted Contact</Text>
            </View>
          </View>
          <Pressable
            onPress={onSwitchRole}
            accessibilityRole="button"
            accessibilityLabel="Switch role"
            style={styles.switchBtn}
          >
            <Text style={styles.switchBtnText}>Role</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {!monitoring && <View style={styles.greeting}>
            <Text style={styles.greetingTitle}>
              Hi, {profile.name.trim().split(/\s+/)[0] || 'there'}!
            </Text>
            <Text style={styles.greetingCaption}>What would you like to check on today?</Text>
          </View>}
          {/* Active Emergency Alert Banner */}
          {activeAlerts.length > 0 && (
            <View style={styles.alertBanner}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertBadge}>SOS ALERT ACTIVE</Text>
                <Text style={styles.alertTime}>{activeAlerts[0].timestamp}</Text>
              </View>
              <Text style={styles.alertMsg}>{activeAlerts[0].message}</Text>
              <Text style={styles.alertRetryInfo}>
                SMS delivered via {activeAlerts[0].deliveryAttempts} attempt(s)
              </Text>
              <View style={styles.alertActions}>
                <Pressable
                  onPress={handleOpenMap}
                  style={styles.alertMapBtn}
                >
                  <Text style={styles.alertMapBtnText}>Open Location</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
                    onAcknowledgeAlert(activeAlerts[0].id);
                  }}
                  style={styles.alertAckBtn}
                >
                  <Text style={styles.alertAckBtnText}>Acknowledge</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Connected Individual Live Status */}
          {hasDemoConnection ? (
          <View style={styles.heroCard}>
            <View style={styles.personRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JC</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.personName}>Jeremy L. Cinco</Text>
                <Text style={styles.personStatus}>
                  {monitoring ? 'Walking to Magsaysay Avenue' : 'Chose you as their Trusted Contact'}
                </Text>
              </View>
              <View style={styles.liveChip}>
                <View style={styles.liveDot} />
                <Text style={styles.liveChipText}>Live</Text>
              </View>
            </View>

            {monitoring && <View style={styles.turnBanner}><Text style={styles.turnTitle}>↱  In 120 m</Text><Text style={styles.turnSub}>Jeremy will reach Magsaysay Ave.</Text></View>}
            <View style={styles.locationTitle}><Text style={styles.cardTitle}>{monitoring ? 'Jeremy’s Location' : 'Current Location'}</Text><Text style={styles.locationAddress}>Coffee Table, Magsaysay Avenue, Naga City</Text></View>
            <View style={styles.mapPreview}>
              <OpenStreetMap center={location} style={StyleSheet.absoluteFill} />
              {monitoring && <Svg style={StyleSheet.absoluteFill} width="100%" height={260} viewBox="0 0 320 260"><Path d="M45 205 Q120 145 160 132 T250 70" stroke={colors.navy} strokeWidth="4" strokeDasharray="7 5" fill="none" /></Svg>}
              <Text style={styles.coordsCaption}>{location.latitude.toFixed(5)}°, {location.longitude.toFixed(5)}° · {monitoring ? '3.1 km · 9:17 AM' : 'Live'}</Text>
            </View>

            <View style={styles.quickActions}>
              <Pressable onPress={handleOpenMap} style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>{monitoring ? 'Monitoring' : 'Monitor'}</Text>
              </Pressable>
            </View>
          </View>
          ) : (
            <View style={styles.heroCard}>
              <Text style={styles.cardTitle}>No connected person yet</Text>
              <Text style={styles.locationAddress}>
                A person must add your account as their trusted contact before their location appears here.
              </Text>
            </View>
          )}

          {hasDemoConnection && monitoring && <View style={styles.monitorCard}><View style={styles.monitorStats}><Text style={styles.monitorTime}>8 min</Text><Text style={styles.monitorInfo}>600 m · Walking  ·  Arrive at 9:25 AM</Text></View><Text style={styles.monitorDestination}>⚑  Coffee Table, Magsaysay Avenue, Naga City</Text><Pressable onPress={() => setMonitoring(false)} style={styles.endMonitoring}><Text style={styles.endMonitoringText}>End Monitoring</Text></Pressable></View>}

          {hasDemoConnection && !monitoring && <View style={styles.previousLocation}><View style={styles.previousHeader}><Text style={styles.cardTitle}>Previous Location</Text><Pressable onPress={handleOpenMap}><Text style={styles.viewAll}>View All →</Text></Pressable></View><Text style={styles.previousDate}>Today</Text><View style={styles.previousMap}><OpenStreetMap center={location} style={StyleSheet.absoluteFill} /></View></View>}

        </ScrollView>
          </>
        )}

        {activeTab === 'recordings' && (
          <VideoRecordingsScreen
            recordings={recordings}
            feedbackPrefs={feedbackPrefs}
            onToggleImportant={onToggleImportantRecording}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            feedbackPrefs={feedbackPrefs}
            onUpdatePrefs={onUpdatePrefs}
            onBack={() => setActiveTab('location')}
            onReplayOnboarding={onReplayOnboarding}
            onSwitchRole={onSwitchRole}
            onSignOut={onSignOut}
          />
        )}

        <View style={styles.tabBar}>
          <Pressable onPress={() => setActiveTab('recordings')} style={styles.tabButton} accessibilityRole="tab" accessibilityLabel="Recordings" accessibilityState={{ selected: activeTab === 'recordings' }}>
            <TabVideoIcon size={27} color={activeTab === 'recordings' ? colors.navy : colors.sage} />
            {activeTab === 'recordings' && <View style={styles.activeUnderline} />}
          </Pressable>
          <Pressable onPress={() => setActiveTab('location')} style={styles.tabButton} accessibilityRole="tab" accessibilityLabel="Location" accessibilityState={{ selected: activeTab === 'location' }}>
            <TabLocationIcon size={27} color={activeTab === 'location' ? colors.navy : colors.sage} />
            {activeTab === 'location' && <View style={styles.activeUnderline} />}
          </Pressable>
          <Pressable onPress={() => setActiveTab('profile')} style={styles.tabButton} accessibilityRole="tab" accessibilityLabel="Profile and settings" accessibilityState={{ selected: activeTab === 'profile' }}>
            <TabProfileIcon size={27} active={activeTab === 'profile'} color={activeTab === 'profile' ? colors.navy : colors.sage} />
            {activeTab === 'profile' && <View style={styles.activeUnderline} />}
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
  shell: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9ED',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rolePill: {
    backgroundColor: '#E6EDE9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  rolePillText: { fontSize: 11, fontWeight: '700', color: colors.sage },
  switchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  switchBtnText: { fontSize: 12, fontWeight: '700', color: colors.navy },
  scroll: { flex: 1 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.background, paddingTop: 10, paddingBottom: 12, borderTopWidth: 1, borderTopColor: 'rgba(100, 125, 112, 0.14)' },
  tabButton: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 4, minHeight: 38 },
  activeUnderline: { width: 28, height: 2, borderRadius: 1, backgroundColor: colors.navy, marginTop: 5 },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: 14 },
  greeting: { paddingHorizontal: 4, paddingTop: 5, paddingBottom: 3, gap: 5 },
  greetingTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: '600' },
  greetingCaption: { color: colors.textPrimary, fontSize: 12.5 },
  locationTitle: { gap: 6, paddingHorizontal: 4 },
  locationAddress: { color: colors.textPrimary, fontSize: 12.5 },
  turnBanner: { backgroundColor: colors.sage, borderRadius: 24, paddingHorizontal: 17, paddingVertical: 13, gap: 7 },
  turnTitle: { color: colors.white, fontSize: 18, fontWeight: '700' },
  turnSub: { color: colors.white, fontSize: 12.5 },
  monitorCard: { backgroundColor: 'rgba(255,255,255,0.76)', borderWidth: 1, borderColor: '#DCE5EF', borderRadius: radii.md, padding: spacing.md, gap: 11 },
  monitorStats: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  monitorTime: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  monitorInfo: { color: colors.textSecondary, fontSize: 12.5, flex: 1 },
  monitorDestination: { color: colors.textSecondary, fontSize: 13, borderTopWidth: 1, borderTopColor: '#D9DEDC', paddingTop: 10 },
  endMonitoring: { alignSelf: 'center', borderWidth: 1, borderColor: colors.navy, backgroundColor: colors.background, borderRadius: radii.pill, paddingHorizontal: 28, paddingVertical: 10 },
  endMonitoringText: { color: colors.navy, fontWeight: '600', fontSize: 13 },
  previousLocation: { gap: 8, paddingHorizontal: 4 },
  previousHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: colors.textSecondary, textDecorationLine: 'underline', fontSize: 12 },
  previousDate: { color: colors.textPrimary, fontSize: 12 },
  previousMap: { borderRadius: 14, overflow: 'hidden', backgroundColor: '#E6E8E4' },
  alertBanner: {
    backgroundColor: colors.danger,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertBadge: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  alertTime: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
  alertMsg: { color: colors.white, fontSize: 13.5, lineHeight: 19, fontWeight: '600' },
  alertRetryInfo: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  alertActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  alertMapBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radii.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  alertMapBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  alertAckBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  alertAckBtnText: { color: colors.danger, fontWeight: '700', fontSize: 13 },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E1E6EB',
    gap: 12,
  },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  personName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  personStatus: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  liveChipText: { fontSize: 11.5, fontWeight: '700', color: colors.success },
  mapPreview: {
    height: 260,
    backgroundColor: '#F3F7FB',
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCE5EF',
  },
  coordsCaption: {
    fontSize: 11.5,
    color: colors.navy,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(23,75,138,0.06)',
  },
  quickActions: { flexDirection: 'row', gap: 10 },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.navySoft,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryActionText: { color: colors.navy, fontWeight: '700', fontSize: 13.5 },
  primaryAction: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryActionText: { color: colors.white, fontWeight: '700', fontSize: 13.5 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E1E6EB',
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 15.5, fontWeight: '700', color: colors.textPrimary },
  simLink: { fontSize: 12.5, fontWeight: '700', color: colors.danger },
  mutedText: { fontSize: 13, color: colors.textMuted },
  logItem: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    padding: 10,
    gap: 4,
  },
  logTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  logTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  logTime: { fontSize: 11.5, color: colors.textMuted },
  logBody: { fontSize: 12.5, color: colors.textSecondary, lineHeight: 17 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switchTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  switchSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#EEF1F4' },
  navActions: { flexDirection: 'row', gap: 10 },
  outlineBtn: {
    flex: 1,
    borderWidth: 1.2,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  outlineBtnText: { fontSize: 13.5, fontWeight: '700', color: colors.navy },
});
