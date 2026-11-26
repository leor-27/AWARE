import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as SMS from 'expo-sms';
import {
  CheckCircleOutlineIcon,
  GuestUserIcon,
  MapPinOutlineIcon,
  MicOutlineIcon,
  PhoneOutlineIcon,
  RetryCycleIcon,
  SendPlaneOutlineIcon,
  ShieldCheckIcon,
  WarningTriangleIcon,
} from '../../components/AwareIcons';
import { colors, radii, spacing } from '../../theme/tokens';
import {
  FeedbackPreferences,
  speakCue,
  triggerHaptic,
} from '../../utils/feedback';
import {
  DEFAULT_HISTORY_SESSIONS,
  EmergencyHistoryFlow,
  SosHistorySession,
} from './EmergencyHistoryFlow';
import { EmergencyContact, EmergencyScreen } from './EmergencyScreen';
import { Coordinates } from './NavigationScreen';

export type SosViewState =
  | 'sos-home'
  | 'contacts'
  | 'contacting'
  | 'sending'
  | 'last-known'
  | 'retrying'
  | 'failed'
  | 'sent'
  | 'end-confirm'
  | 'ended'
  | 'history';

interface SosSessionFlowProps {
  initialView?: SosViewState;
  feedbackPrefs: FeedbackPreferences;
  location: Coordinates;
  contacts: EmergencyContact[];
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
  onDispatchSosAlert: (messageText: string) => void;
  onBackToNavigation: () => void;
}

export const SosSessionFlow: React.FC<SosSessionFlowProps> = ({
  initialView = 'sos-home',
  feedbackPrefs,
  location,
  contacts,
  onUpdateContacts,
  onDispatchSosAlert,
  onBackToNavigation,
}) => {
  const [view, setView] = useState<SosViewState>(initialView);
  const [returnBeforeEndConfirm, setReturnBeforeEndConfirm] =
    useState<SosViewState>('sending');
  const [sentCount, setSentCount] = useState(1);
  const [failedCount, setFailedCount] = useState(1);
  const [history, setHistory] = useState<SosHistorySession[]>(
    DEFAULT_HISTORY_SESSIONS
  );
  const [historyInitialSessionId, setHistoryInitialSessionId] = useState<
    string | null
  >(null);

  const firstContact = contacts[0]?.name ?? 'Josephine';
  const secondContact = contacts[1]?.name ?? 'Mark';

  const currentTime = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  // Auto-advance active SOS progression for realistic live feedback
  useEffect(() => {
    if (view === 'sending') {
      const timer = setTimeout(() => {
        if (contacts.length >= 2) {
          setView('retrying');
          triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
          speakCue(
            `Retrying 1 contact. Attempt 2 of 3 for ${secondContact}.`,
            feedbackPrefs
          );
        } else {
          setSentCount(contacts.length);
          setFailedCount(0);
          setView('sent');
          triggerHaptic('success', feedbackPrefs.hapticsEnabled);
          speakCue('SOS messages sent.', feedbackPrefs);
        }
      }, 2800);
      return () => clearTimeout(timer);
    }

    if (view === 'retrying') {
      const timer = setTimeout(() => {
        setSentCount(1);
        setFailedCount(1);
        setView('failed');
        triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
        speakCue(
          `1 message failed. ${secondContact} failed after 3 attempts.`,
          feedbackPrefs
        );
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [view, contacts.length, secondContact, feedbackPrefs]);

  const startSosCallSession = async () => {
    if (contacts.length === 0) {
      triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
      speakCue('No emergency contacts saved. Opening SOS setup.', feedbackPrefs);
      setView('contacts');
      return;
    }

    triggerHaptic('sos', feedbackPrefs.hapticsEnabled);
    speakCue(
      `SOS call in progress. Contacting ${firstContact}.`,
      feedbackPrefs
    );
    setView('contacting');

    const smsText = `AWARE SOS ALERT: Immediate help needed near Magsaysay Avenue, Naga City (${location.latitude.toFixed(
      5
    )}, ${location.longitude.toFixed(5)}).`;

    onDispatchSosAlert(smsText);

    if (Platform.OS !== 'web') {
      try {
        const available = await SMS.isAvailableAsync();
        if (available) {
          await SMS.sendSMSAsync(
            contacts.map((c) => c.phone),
            smsText
          );
        }
      } catch {
        // Continue in-app SOS state flow
      }
    }
  };

  const openEndConfirm = (fromView: SosViewState) => {
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    setReturnBeforeEndConfirm(fromView);
    setView('end-confirm');
    speakCue(
      'End this session? Messages already sent cannot be recalled.',
      feedbackPrefs
    );
  };

  const finalizeEndSession = () => {
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    const id = String(Date.now());
    const entry: SosHistorySession = {
      id,
      shortDate: `8 Oct 2026 • ${currentTime}`,
      fullDate: `8 October 2026 • ${currentTime}`,
      fullRange: `8 October 2026 • ${currentTime}`,
      capturedAt: `Captured at ${currentTime}`,
      locationLabel: 'Magsaysay Avenue, Naga City',
      summaryLine: `Ended • ${sentCount} sent, ${failedCount} failed`,
      sendingResults: [
        `${firstContact} — Sent, attempt 1`,
        'Delivery unconfirmed',
        failedCount > 0
          ? `${secondContact} — Failed, 3 attempts`
          : `${secondContact} — Sent, attempt 1`,
      ],
      attemptLog: [
        `${currentTime} — SOS session initiated`,
        `${currentTime} — ${firstContact} SMS sent`,
        `${currentTime} — Session ended`,
      ],
      recordingDurationSec: 300,
    };
    setHistory((prev) => [entry, ...prev]);
    setHistoryInitialSessionId(id);
    setView('ended');
    speakCue('Session ended. Recording saved on device.', feedbackPrefs);
  };

  if (view === 'contacts') {
    return (
      <EmergencyScreen
        feedbackPrefs={feedbackPrefs}
        contacts={contacts}
        onUpdateContacts={onUpdateContacts}
        onBackToSos={() => setView('sos-home')}
      />
    );
  }

  /* 1. EMERGENCY SOS HOME */
  if (view === 'sos-home') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <ShieldCheckIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Emergency SOS</Text>
        <Text style={styles.subheading}>Help is one action away.</Text>

        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <GuestUserIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Your trusted contacts</Text>
          </View>
          {contacts.length === 0 ? (
            <Text style={styles.cardLine}>No contacts saved yet.</Text>
          ) : (
            contacts.map((c) => (
              <Text key={c.id} style={styles.cardLine}>
                {c.name} • {c.relation}
              </Text>
            ))
          )}
        </View>

        <Pressable
          onPress={startSosCallSession}
          accessibilityRole="button"
          accessibilityLabel="Hold volume up and down together for 3 seconds to start an SOS call. Tap to start SOS session."
          style={({ pressed }) => [
            styles.blueCard,
            pressed && { opacity: 0.85 },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <PhoneOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Volume-button shortcut</Text>
          </View>
          <Text style={styles.cardLine}>
            Hold volume up and down together for 3 seconds to start an SOS call.
          </Text>
        </Pressable>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setView('contacts');
            }}
            style={styles.navyPillBtn}
          >
            <Text style={styles.navyPillText}>Emergency contacts</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setView('history');
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Emergency history</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('sos', feedbackPrefs.hapticsEnabled);
              speakCue(
                `SOS feedback active. ${contacts.length} trusted contacts configured.`,
                feedbackPrefs
              );
              startSosCallSession();
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>SOS feedback</Text>
          </Pressable>

          <Pressable
            onPress={onBackToNavigation}
            style={styles.subtleBackLink}
          >
            <Text style={styles.subtleBackText}>Back to Navigation</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 2. CONTACTING YOUR PEOPLE */
  if (view === 'contacting') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <ShieldCheckIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Contacting your people</Text>
        <Text style={styles.subheading}>SOS call in progress</Text>

        {contacts.map((c, idx) => (
          <View key={c.id} style={styles.blueCard}>
            <View style={styles.cardHeaderRow}>
              <GuestUserIcon size={20} color={colors.sage} />
              <Text style={styles.cardTitle}>
                {c.name} • {c.relation}
              </Text>
            </View>
            <Text style={styles.cardLine}>
              {idx === 0 ? 'Calling now...' : 'Next contact if unanswered'}
            </Text>
          </View>
        ))}

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setView('sending');
              speakCue(
                `Sending SOS to ${contacts.map((c) => c.name).join(' and ')}.`,
                feedbackPrefs
              );
            }}
            style={styles.navyPillBtn}
          >
            <Text style={styles.navyPillText}>View SOS message status</Text>
          </Pressable>

          <Pressable
            onPress={() => openEndConfirm('contacting')}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>End session</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setView('sos-home');
              speakCue('Alert cancelled.', feedbackPrefs);
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Cancel Alert</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 3. SENDING SOS */
  if (view === 'sending') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <SendPlaneOutlineIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Sending SOS</Text>
        <Text style={styles.subheading}>Emergency session active</Text>

        <Pressable
          onPress={() => setView('last-known')}
          style={styles.blueCard}
          accessibilityLabel="Location in your SMS. Tap to view last-known location fallback."
        >
          <View style={styles.cardHeaderRow}>
            <MapPinOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Location in your SMS</Text>
          </View>
          <Text style={styles.cardLine}>Magsaysay Avenue, Naga City</Text>
          <Text style={styles.cardLine}>Current location • {currentTime}</Text>
        </Pressable>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <GuestUserIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Recipient status</Text>
          </View>
          {contacts.map((c) => (
            <Text key={c.id} style={styles.cardLine}>
              {c.name} — Sending
            </Text>
          ))}
        </View>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <MicOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Recording active</Text>
          </View>
          <Text style={styles.cardLine}>
            Audio is saved locally while awaiting upload.
          </Text>
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() =>
              speakCue(
                `Sending SOS. Location Magsaysay Avenue, Naga City. ${contacts
                  .map((c) => `${c.name} sending`)
                  .join('. ')}.`,
                feedbackPrefs
              )
            }
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Repeat status</Text>
          </Pressable>

          <Pressable
            onPress={finalizeEndSession}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Stop pending messages</Text>
          </Pressable>

          <Pressable
            onPress={() => openEndConfirm('sending')}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillText}>End session</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 4. USING LAST-KNOWN LOCATION */
  if (view === 'last-known') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <MapPinOutlineIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Using last-known location</Text>
        <Text style={styles.subheading}>
          Current location could not be obtained.
        </Text>

        <Pressable onPress={() => setView('sending')} style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <MapPinOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Location in your SMS</Text>
          </View>
          <Text style={styles.cardLine}>Naga City • Captured at 9:05 AM</Text>
          <Text style={styles.cardLine}>This is an earlier location.</Text>
        </Pressable>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <SendPlaneOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Sending continues</Text>
          </View>
          {contacts.map((c) => (
            <Text key={c.id} style={styles.cardLine}>
              {c.name} — Sending
            </Text>
          ))}
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={finalizeEndSession}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Stop pending messages</Text>
          </Pressable>

          <Pressable
            onPress={() => openEndConfirm('last-known')}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillText}>End session</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 5. RETRYING 1 CONTACT */
  if (view === 'retrying') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <RetryCycleIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Retrying 1 contact</Text>
        <Text style={styles.subheading}>1 sent • 1 failed</Text>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <GuestUserIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>{firstContact} — Sent</Text>
          </View>
          <Text style={styles.cardLine}>Delivery unconfirmed</Text>
        </View>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <RetryCycleIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>{secondContact} — Retrying</Text>
          </View>
          <Text style={styles.cardLine}>
            Attempt 2 of 3 in 15 seconds.{'\n'}Only failed messages are retried.
          </Text>
        </View>

        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <MapPinOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Location sent</Text>
          </View>
          <Text style={styles.cardLine}>Magsaysay Avenue, Naga City</Text>
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() =>
              speakCue(
                `Retrying 1 contact. ${firstContact} sent. ${secondContact} retrying attempt 2 of 3.`,
                feedbackPrefs
              )
            }
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Repeat status</Text>
          </Pressable>

          <Pressable
            onPress={finalizeEndSession}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Stop pending messages</Text>
          </Pressable>

          <Pressable
            onPress={() => openEndConfirm('retrying')}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillText}>End session</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 6. 1 MESSAGE FAILED */
  if (view === 'failed') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <WarningTriangleIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>1 message failed</Text>
        <Text style={styles.subheading}>Automatic retries have finished.</Text>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <GuestUserIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>{firstContact} — Sent</Text>
          </View>
          <Text style={styles.cardLine}>Delivery unconfirmed</Text>
        </View>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <WarningTriangleIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>{secondContact} — Failed</Text>
          </View>
          <Text style={styles.cardLine}>
            3 attempts used. Check cellular service and SIM balance or plan.
          </Text>
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              triggerHaptic('success', feedbackPrefs.hapticsEnabled);
              setSentCount(contacts.length);
              setFailedCount(0);
              setView('sent');
              speakCue(
                `Retry succeeded. SOS messages sent to ${contacts.length} of ${contacts.length} contacts.`,
                feedbackPrefs
              );
            }}
            style={styles.navyPillBtn}
          >
            <Text style={styles.navyPillText}>Retry failed recipient</Text>
          </Pressable>

          <Pressable
            onPress={() => openEndConfirm('failed')}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillText}>End session</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 7. SOS MESSAGES SENT */
  if (view === 'sent') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <CheckCircleOutlineIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>SOS messages sent</Text>
        <Text style={styles.subheading}>
          Sent to {contacts.length} of {contacts.length} contacts.
        </Text>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <GuestUserIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Recipient status</Text>
          </View>
          {contacts.map((c, idx) => (
            <Text key={c.id} style={styles.cardLine}>
              {c.name} —{' '}
              {idx === 0 ? 'Delivery confirmed' : 'Delivery unconfirmed'}
            </Text>
          ))}
        </View>

        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <MapPinOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Location sent</Text>
          </View>
          <Text style={styles.cardLine}>Magsaysay Avenue, Naga City</Text>
          <Text style={styles.cardLine}>Current location • {currentTime}</Text>
        </View>

        <Text style={styles.noteText}>
          Sent does not confirm that someone has read your message.
        </Text>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() =>
              speakCue(
                `SOS messages sent to ${contacts.length} of ${contacts.length} contacts.`,
                feedbackPrefs
              )
            }
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Repeat status</Text>
          </Pressable>

          <Pressable
            onPress={finalizeEndSession}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Session details</Text>
          </Pressable>

          <Pressable
            onPress={() => openEndConfirm('sent')}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillText}>End session</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 8. END THIS SESSION? */
  if (view === 'end-confirm') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <ShieldCheckIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>End this session?</Text>
        <Text style={styles.subheading}>
          Messages already sent cannot be recalled.
        </Text>

        <View style={styles.redCard}>
          <View style={styles.cardHeaderRow}>
            <ShieldCheckIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>This will stop</Text>
          </View>
          <Text style={styles.cardLine}>
            Pending messages, retries, tracking and recording. History and
            recordings will be retained.
          </Text>
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setView(returnBeforeEndConfirm);
            }}
            style={styles.navyPillBtn}
          >
            <Text style={styles.navyPillText}>Keep session active</Text>
          </Pressable>

          <Pressable
            onPress={finalizeEndSession}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillText}>End session</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 9. SESSION ENDED */
  if (view === 'ended') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <CheckCircleOutlineIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Session ended</Text>
        <Text style={styles.subheading}>8 October 2026 • {currentTime}</Text>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <CheckCircleOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Final sending result</Text>
          </View>
          <Text style={styles.cardLine}>
            {sentCount} sent • {failedCount} failed
          </Text>
          <Text style={styles.cardLine}>Pending retries stopped.</Text>
        </View>

        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <MicOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Recording saved on device</Text>
          </View>
          <Text style={styles.cardLine}>
            Waiting for connection to upload.
          </Text>
        </View>

        <Text style={styles.noteText}>
          Ending a session does not confirm your safety.
        </Text>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              setHistoryInitialSessionId(history[0]?.id ?? null);
              setView('history');
            }}
            style={styles.navyPillBtn}
          >
            <Text style={styles.navyPillText}>View session details</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setHistoryInitialSessionId(null);
              setView('history');
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Emergency history</Text>
          </Pressable>

          <Pressable
            onPress={() => setView('sos-home')}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Back to Emergency SOS</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 10. EMERGENCY HISTORY + SESSION DETAILS + RECORDING + DELETION FLOW */
  return (
    <EmergencyHistoryFlow
      sessions={history}
      initialSessionId={historyInitialSessionId}
      feedbackPrefs={feedbackPrefs}
      onDeleteSession={(id) =>
        setHistory((prev) => prev.filter((item) => item.id !== id))
      }
      onClearHistory={() => setHistory([])}
      onBackToEmergencySos={() => {
        setHistoryInitialSessionId(null);
        setView('sos-home');
      }}
    />
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: 13,
  },
  topIconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DDE3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: -6,
    marginBottom: 2,
  },
  blueCard: {
    borderWidth: 1.8,
    borderColor: colors.navy,
    borderRadius: 22,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.45)',
    gap: 5,
  },
  sageCard: {
    borderWidth: 1.8,
    borderColor: colors.sage,
    borderRadius: 22,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.45)',
    gap: 5,
  },
  redCard: {
    borderWidth: 1.8,
    borderColor: '#B52A2A',
    borderRadius: 22,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.45)',
    gap: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  cardLine: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  actionsStack: {
    gap: 10,
    marginTop: 2,
  },
  navyPillBtn: {
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navyPillText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '600',
  },
  outlinePillBtn: {
    borderWidth: 1.4,
    borderColor: colors.sage,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  outlinePillText: {
    color: colors.navy,
    fontSize: 13.5,
    fontWeight: '600',
  },
  dangerPillBtn: {
    backgroundColor: '#B52A2A',
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerPillText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '600',
  },
  subtleBackLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  subtleBackText: {
    fontSize: 12.5,
    color: colors.sage,
    fontWeight: '600',
  },
});
