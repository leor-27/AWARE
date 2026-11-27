import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CheckCircleOutlineIcon,
  ClockOutlineIcon,
  CloudDownIcon,
  GuestUserIcon,
  MapPinOutlineIcon,
  MicOutlineIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '../../components/AwareIcons';
import { colors, radii, spacing } from '../../theme/tokens';
import {
  FeedbackPreferences,
  speakCue,
  triggerHaptic,
} from '../../utils/feedback';

export interface SosHistorySession {
  id: string;
  shortDate: string;
  fullDate: string;
  fullRange: string;
  capturedAt: string;
  locationLabel: string;
  summaryLine: string;
  sendingResults: string[];
  attemptLog: string[];
  recordingDurationSec: number;
}

export const DEFAULT_HISTORY_SESSIONS: SosHistorySession[] = [
  {
    id: 'hs-1',
    shortDate: '8 Oct 2026 • 9:17 AM',
    fullDate: '8 October 2026 • 9:17 AM',
    fullRange: '8 October 2026 • 9:17–9:22 AM',
    capturedAt: 'Captured at 9:17 AM',
    locationLabel: 'Magsaysay Avenue, Naga City',
    summaryLine: 'Ended • 1 sent, 1 failed',
    sendingResults: [
      'Josephine — Sent, attempt 1',
      'Delivery unconfirmed',
      'Mark — Failed, 3 attempts',
    ],
    attemptLog: [
      '9:17 AM — SOS initiated via volume-button shortcut',
      '9:17 AM — Josephine SMS sent (Attempt 1)',
      '9:18 AM — Mark SMS failed (Attempt 1–3)',
      '9:22 AM — Session ended by user',
    ],
    recordingDurationSec: 300,
  },
  {
    id: 'hs-2',
    shortDate: '7 Oct 2026 • 4:30 PM',
    fullDate: '7 October 2026 • 4:30 PM',
    fullRange: '7 October 2026 • 4:30–4:35 PM',
    capturedAt: 'Captured at 9:17 AM',
    locationLabel: 'Last-known location • Naga City',
    summaryLine: 'Ended • 2 sent',
    sendingResults: [
      'Josephine — Sent, attempt 1',
      'Mark — Sent, attempt 1',
    ],
    attemptLog: [
      '4:30 PM — SOS initiated using last-known location',
      '4:30 PM — Josephine SMS sent (Attempt 1)',
      '4:30 PM — Mark SMS sent (Attempt 1)',
      '4:35 PM — Session ended by user',
    ],
    recordingDurationSec: 300,
  },
];

type HistorySubView =
  | 'list'
  | 'details'
  | 'attempt-log'
  | 'clear-confirm'
  | 'upload-status'
  | 'recording'
  | 'delete-confirm'
  | 'deletion-pending'
  | 'deletion-status';

interface EmergencyHistoryFlowProps {
  sessions: SosHistorySession[];
  initialSessionId?: string | null;
  feedbackPrefs: FeedbackPreferences;
  onDeleteSession: (id: string) => void;
  onClearHistory: () => void;
  onBackToEmergencySos: () => void;
}

export const EmergencyHistoryFlow: React.FC<EmergencyHistoryFlowProps> = ({
  sessions,
  initialSessionId = null,
  feedbackPrefs,
  onDeleteSession,
  onClearHistory,
  onBackToEmergencySos,
}) => {
  const [subView, setSubView] = useState<HistorySubView>(
    initialSessionId ? 'details' : 'list'
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSessionId ?? sessions[0]?.id ?? null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const selectedSession =
    sessions.find((s) => s.id === selectedId) ?? sessions[0] ?? null;

  useEffect(() => {
    if (subView !== 'recording' || !isPlaying || !selectedSession) return;
    const timer = setInterval(() => {
      setElapsedSec((prev) => {
        if (prev + 1 >= selectedSession.recordingDurationSec) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [subView, isPlaying, selectedSession]);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  /* 1. DELETION STATUS */
  if (subView === 'deletion-status') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <TrashIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Deletion status</Text>
        <Text style={styles.subheading}>Checked just now</Text>

        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <CloudDownIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Cloud deletion still pending</Text>
          </View>
          <Text style={styles.cardLine}>
            Local data has been removed. Cloud deletion will resume when a
            connection is available.
          </Text>
        </View>

        <Pressable
          onPress={() => {
            triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            setSubView('deletion-pending');
          }}
          style={styles.outlinePillBtn}
        >
          <Text style={styles.outlinePillText}>Back to deletion status</Text>
        </Pressable>
      </ScrollView>
    );
  }

  /* 2. DELETION PENDING */
  if (subView === 'deletion-pending') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <TrashIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Deletion pending</Text>
        <Text style={styles.subheading}>
          Cloud deletion is waiting for a connection.
        </Text>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <TrashIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Local data removed</Text>
          </View>
          <Text style={styles.cardLine}>
            The session and recordings were removed from this device.
          </Text>
        </View>

        <View style={styles.redCard}>
          <View style={styles.cardHeaderRow}>
            <CloudDownIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Cloud deletion pending</Text>
          </View>
          <Text style={styles.cardLine}>
            Cloud copies may remain until deletion is confirmed. Uploads for
            this session are stopped.
          </Text>
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setSubView('deletion-status');
              speakCue(
                'Deletion status checked. Cloud deletion still pending.',
                feedbackPrefs
              );
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Check deletion status</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setSubView('list');
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Back to history</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 3. DELETE THIS SESSION? */
  if (subView === 'delete-confirm' && selectedSession) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <MicOutlineIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Delete this session?</Text>
        <Text style={styles.subheading}>{selectedSession.fullDate}</Text>

        <View style={styles.redCard}>
          <View style={styles.cardHeaderRow}>
            <TrashIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>This deletes everything</Text>
          </View>
          <Text style={styles.cardLine}>
            Session history, recipient results, location data, and all
            associated local and cloud recordings. This cannot be undone.
          </Text>
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setSubView('details');
            }}
            style={styles.navyPillBtn}
          >
            <Text style={styles.navyPillText}>Keep session</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
              onDeleteSession(selectedSession.id);
              setSubView('deletion-pending');
              speakCue(
                'Local data removed. Cloud deletion pending.',
                feedbackPrefs
              );
            }}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillText}>Delete everything</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (subView === 'clear-confirm') {
    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topIconTile}><ClockOutlineIcon size={22} color={colors.sage} /></View>
        <Text style={styles.heading}>Clear emergency history?</Text>
        <Text style={styles.subheading}>This removes every saved session.</Text>
        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}><MicOutlineIcon size={20} color={colors.sage} /><Text style={styles.cardTitle}>History and recordings</Text></View>
          <Text style={styles.cardLine}>All session details and associated recordings will be removed. This cannot be undone.</Text>
        </View>
        <View style={styles.actionsStack}>
          <Pressable onPress={() => { triggerHaptic('tap', feedbackPrefs.hapticsEnabled); setSubView('list'); }} style={styles.navyPillBtn}><Text style={styles.navyPillText}>Keep history</Text></Pressable>
          <Pressable onPress={() => { triggerHaptic('warning', feedbackPrefs.hapticsEnabled); onClearHistory(); setSubView('list'); speakCue('Emergency history cleared.', feedbackPrefs); }} style={styles.outlinePillBtn}><Text style={styles.outlinePillText}>Clear all history</Text></Pressable>
        </View>
      </ScrollView>
    );
  }

  if (subView === 'attempt-log' && selectedSession) {
    const attemptRows: string[] = [
      selectedSession.sendingResults[0] ?? 'Emergency contact',
      selectedSession.sendingResults[selectedSession.sendingResults.length - 1] ?? 'No attempts recorded',
    ];
    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topIconTile}><ClockOutlineIcon size={22} color={colors.sage} /></View>
        <Text style={styles.heading}>Sending attempts</Text>
        <Text style={styles.subheading}>{selectedSession.fullDate}</Text>
        {attemptRows.map((result, i) => (
          <View key={`${result}-${i}`} style={styles.blueCard}>
            <View style={styles.cardHeaderRow}><GuestUserIcon size={20} color={colors.sage} /><Text style={styles.cardTitle}>{result.split(' — ')[0]}</Text></View>
            <Text style={styles.cardLine}>{i === 0 ? 'Attempt 1 • Sent at 9:17 AM' : 'Attempts 1–3 • Failed'}</Text>
            <Text style={styles.cardLine}>{i === 0 ? 'Delivery unconfirmed' : 'Cellular service unavailable'}</Text>
          </View>
        ))}
        <Pressable onPress={() => setSubView('details')} style={styles.outlinePillBtn}><Text style={styles.outlinePillText}>Back to session details</Text></Pressable>
      </ScrollView>
    );
  }

  if (subView === 'upload-status' && selectedSession) {
    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topIconTile}><CloudDownIcon size={22} color={colors.sage} /></View>
        <Text style={styles.heading}>Recording upload</Text>
        <Text style={styles.subheading}>Your recording stays on this device.</Text>
        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}><CloudDownIcon size={20} color={colors.sage} /><Text style={styles.cardTitle}>Waiting for connection</Text></View>
          <Text style={styles.cardLine}>{formatDuration(selectedSession.recordingDurationSec)} recording • Upload pending</Text>
        </View>
        <Pressable onPress={() => setSubView('recording')} style={styles.outlinePillBtn}><Text style={styles.outlinePillText}>Back to recording</Text></Pressable>
      </ScrollView>
    );
  }

  /* 4. EMERGENCY RECORDING PLAYER */
  if (subView === 'recording' && selectedSession) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <MicOutlineIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Emergency recording</Text>
        <Text style={styles.subheading}>{selectedSession.fullDate}</Text>

        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <MicOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Available on this device</Text>
          </View>
          <Text style={styles.cardLine}>
            Upload pending •{' '}
            {formatDuration(selectedSession.recordingDurationSec)} duration
          </Text>
        </View>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <ShieldCheckIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>
              {formatDuration(elapsedSec)} /{' '}
              {formatDuration(selectedSession.recordingDurationSec)}
            </Text>
          </View>
          <Text style={styles.cardLine}>
            {isPlaying ? 'Recording playing' : 'Recording paused'}
          </Text>
          <Pressable
            onPress={() => {
              const next = !isPlaying;
              setIsPlaying(next);
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              speakCue(
                next ? 'Recording playing.' : 'Recording paused.',
                feedbackPrefs
              );
            }}
            style={[styles.navyPillBtn, { marginTop: 8 }]}
          >
            <Text style={styles.navyPillText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setSubView('upload-status');
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Upload status</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setIsPlaying(false);
              setSubView('details');
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Back to session details</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 5. SESSION DETAILS */
  if (subView === 'details' && selectedSession) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <ClockOutlineIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Session details</Text>
        <Text style={styles.subheading}>{selectedSession.fullRange}</Text>

        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <MapPinOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Location used</Text>
          </View>
          <Text style={styles.cardLine}>{selectedSession.locationLabel}</Text>
          <Text style={styles.cardLine}>{selectedSession.capturedAt}</Text>
        </View>

        <View style={styles.blueCard}>
          <View style={styles.cardHeaderRow}>
            <CheckCircleOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>Sending results</Text>
          </View>
          {selectedSession.sendingResults.map((line, i) => (
            <Text key={i} style={styles.cardLine}>
              {line}
            </Text>
          ))}
        </View>

        <Pressable
          onPress={() => {
            triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            setSubView('attempt-log');
          }}
          style={styles.outlinePillBtn}
        >
          <Text style={styles.outlinePillText}>View attempt log</Text>
        </Pressable>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}>
            <MicOutlineIcon size={20} color={colors.sage} />
            <Text style={styles.cardTitle}>
              Recording • {formatDuration(selectedSession.recordingDurationSec)}
            </Text>
          </View>
          <Text style={styles.cardLine}>On device • Upload pending</Text>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setElapsedSec(0);
              setIsPlaying(false);
              setSubView('recording');
            }}
            style={[styles.outlinePillBtn, { marginTop: 6 }]}
          >
            <Text style={styles.outlinePillText}>Play recording</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
            setSubView('delete-confirm');
          }}
          style={styles.dangerPillBtn}
        >
          <Text style={styles.dangerPillText}>
            Delete session & recordings
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            setSubView('list');
          }}
          style={styles.outlinePillBtn}
        >
          <Text style={styles.outlinePillText}>Back to history</Text>
        </Pressable>
      </ScrollView>
    );
  }

  /* 6. EMERGENCY HISTORY LIST */
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topIconTile}>
        <ClockOutlineIcon size={22} color={colors.sage} />
      </View>

      <Text style={styles.heading}>Emergency history</Text>
      <Text style={styles.subheading}>{sessions.length ? 'Newest sessions first' : 'No saved sessions'}</Text>

      {sessions.length === 0 ? (
        <View style={styles.sageCard}>
          <View style={styles.cardHeaderRow}><ShieldCheckIcon size={20} color={colors.sage} /><Text style={styles.cardTitle}>A fresh start</Text></View>
          <Text style={styles.cardLine}>
            Future emergency sessions will appear here.
          </Text>
          <Pressable onPress={onBackToEmergencySos} style={[styles.outlinePillBtn, { marginTop: 6 }]}><Text style={styles.outlinePillText}>Back to Emergency SOS</Text></Pressable>
        </View>
      ) : (
        sessions.map((item, idx) => (
          <View key={item.id} style={styles.sageCard}>
            <View style={styles.cardHeaderRow}>
              <ShieldCheckIcon size={20} color={colors.sage} />
              <Text style={styles.cardTitle}>{item.shortDate}</Text>
            </View>
            <Text style={styles.cardLine}>{item.locationLabel}</Text>
            <Text style={styles.cardLine}>{item.summaryLine}</Text>

            <Pressable
              onPress={() => {
                triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
                setSelectedId(item.id);
                setSubView('details');
              }}
              style={[styles.outlinePillBtn, { marginTop: 6 }]}
            >
              <Text style={styles.outlinePillText}>
                {idx === 0 ? 'View session' : 'View earlier session'}
              </Text>
            </Pressable>
          </View>
        ))
      )}

      <View style={styles.actionsStack}>
        {sessions.length > 0 && (
          <Pressable
            onPress={() => {
              triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
              setSubView('clear-confirm');
            }}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillText}>Clear emergency history</Text>
          </Pressable>
        )}

        {sessions.length > 0 && (
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              onBackToEmergencySos();
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillText}>Back to Emergency SOS</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
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
    gap: 5,
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
});
