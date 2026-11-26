import React, { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { AwareWordmark } from '../../components/AwareIllustrations';
import { colors, radii, spacing } from '../../theme/tokens';
import {
  FeedbackPreferences,
  speakCue,
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
  feedbackPrefs: FeedbackPreferences;
  location: Coordinates;
  alerts: SosAlertEvent[];
  onAcknowledgeAlert: (id: string) => void;
  onSimulateIncomingAlert: () => void;
  onReplayOnboarding: () => void;
  onSwitchRole: () => void;
}

export const TrustedDashboardScreen: React.FC<TrustedDashboardScreenProps> = ({
  feedbackPrefs,
  location,
  alerts,
  onAcknowledgeAlert,
  onSimulateIncomingAlert,
  onReplayOnboarding,
  onSwitchRole,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 460);
  const [arrivalNotify, setArrivalNotify] = useState(true);
  const [sosAutoRetryNotify, setSosAutoRetryNotify] = useState(true);
  const [checkInSent, setCheckInSent] = useState(false);

  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  const handleOpenMap = () => {
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    const url = `https://maps.google.com/?q=${location.latitude.toFixed(
      5
    )},${location.longitude.toFixed(5)}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleSendCheckIn = () => {
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    setCheckInSent(true);
    speakCue('Check-in notification sent to Elena.', feedbackPrefs);
    setTimeout(() => setCheckInSent(false), 3000);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.shell, { width: clampedWidth }]}>
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
          <View style={styles.heroCard}>
            <View style={styles.personRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>EV</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.personName}>Elena Vance</Text>
                <Text style={styles.personStatus}>
                  Navigating to Oak St. Transit Stop · 84% Battery
                </Text>
              </View>
              <View style={styles.liveChip}>
                <View style={styles.liveDot} />
                <Text style={styles.liveChipText}>Live</Text>
              </View>
            </View>

            <View style={styles.mapPreview}>
              <Svg width="100%" height={128} viewBox="0 0 320 128">
                <Line x1="0" y1="64" x2="320" y2="64" stroke="#DCE5EF" strokeWidth="6" />
                <Line x1="160" y1="0" x2="160" y2="128" stroke="#DCE5EF" strokeWidth="6" />
                <Path
                  d="M78 96 Q140 72 160 64 T244 36"
                  stroke={colors.navy}
                  strokeWidth="3"
                  strokeDasharray="6 5"
                  fill="none"
                />
                <Circle cx="160" cy="64" r="18" fill="rgba(23,75,138,0.16)" />
                <Circle cx="160" cy="64" r="7" fill={colors.navy} />
                <Circle cx="244" cy="36" r="6" fill={colors.sage} />
              </Svg>
              <Text style={styles.coordsCaption}>
                {location.latitude.toFixed(5)}°, {location.longitude.toFixed(5)}° · Market St Corridor
              </Text>
            </View>

            <View style={styles.quickActions}>
              <Pressable onPress={handleOpenMap} style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>Track on Map</Text>
              </Pressable>
              <Pressable onPress={handleSendCheckIn} style={styles.primaryAction}>
                <Text style={styles.primaryActionText}>
                  {checkInSent ? 'Check-in Sent' : 'Send Check-in'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Emergency Communication Log */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Trusted Circle Activity</Text>
              <Pressable
                onPress={() => {
                  triggerHaptic('sos', feedbackPrefs.hapticsEnabled);
                  onSimulateIncomingAlert();
                }}
              >
                <Text style={styles.simLink}>Simulate SOS</Text>
              </Pressable>
            </View>

            {alerts.length === 0 ? (
              <Text style={styles.mutedText}>
                No recent SOS alerts. All navigation sessions are normal.
              </Text>
            ) : (
              alerts.map((item) => (
                <View key={item.id} style={styles.logItem}>
                  <View style={styles.logTopRow}>
                    <Text style={styles.logTitle}>
                      {item.acknowledged ? 'Acknowledged SOS' : 'Active SOS Alert'}
                    </Text>
                    <Text style={styles.logTime}>{item.timestamp}</Text>
                  </View>
                  <Text style={styles.logBody}>{item.message}</Text>
                </View>
              ))
            )}
          </View>

          {/* Notification Preferences */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Support Preferences</Text>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Route Arrival Alerts</Text>
                <Text style={styles.switchSub}>
                  Notify when Elena reaches saved destinations.
                </Text>
              </View>
              <Switch
                value={arrivalNotify}
                onValueChange={setArrivalNotify}
                trackColor={{ false: '#CBD2CE', true: colors.navy }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>SOS SMS Retry Receipts</Text>
                <Text style={styles.switchSub}>
                  Show delivery retry status if cellular signal drops.
                </Text>
              </View>
              <Switch
                value={sosAutoRetryNotify}
                onValueChange={setSosAutoRetryNotify}
                trackColor={{ false: '#CBD2CE', true: colors.navy }}
              />
            </View>
          </View>

          <View style={styles.navActions}>
            <Pressable onPress={onReplayOnboarding} style={styles.outlineBtn}>
              <Text style={styles.outlineBtnText}>Replay Feature Tour</Text>
            </Pressable>
            <Pressable onPress={onSwitchRole} style={styles.outlineBtn}>
              <Text style={styles.outlineBtnText}>Switch Role</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: 14 },
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
