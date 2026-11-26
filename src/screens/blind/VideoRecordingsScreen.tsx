import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import {
  BackArrowIcon,
  ChevronRightIcon,
  CloudCheckIcon,
  PlayBoxIcon,
} from '../../components/AwareIcons';
import { OrganicBackground } from '../../components/OrganicBackground';
import { colors, radii, spacing } from '../../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../../utils/feedback';

export interface VideoRecordingItem {
  id: string;
  date: string;
  timeRange: string;
  important: boolean;
  durationSec: number;
}

interface VideoRecordingsScreenProps {
  recordings: VideoRecordingItem[];
  feedbackPrefs: FeedbackPreferences;
  onToggleImportant: (id: string) => void;
}

export const VideoRecordingsScreen: React.FC<VideoRecordingsScreenProps> = ({
  recordings,
  feedbackPrefs,
  onToggleImportant,
}) => {
  const [filter, setFilter] = useState<'all' | 'important'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const selectedRecording = recordings.find((r) => r.id === selectedId) ?? null;

  useEffect(() => {
    if (!isPlaying || !selectedRecording) return;
    const timer = setInterval(() => {
      setElapsedSec((prev) => {
        if (prev + 1 >= selectedRecording.durationSec) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, selectedRecording]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (selectedRecording) {
    return (
      <View style={styles.detailsRoot}>
        <OrganicBackground variant="details" />

        <View style={styles.detailsContent}>
          <Pressable
            onPress={() => {
              setIsPlaying(false);
              setElapsedSec(0);
              setSelectedId(null);
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            }}
            accessibilityRole="button"
            accessibilityLabel="Back to Video Recordings"
            style={styles.backFab}
          >
            <BackArrowIcon size={20} color={colors.white} />
          </Pressable>

          <Text style={styles.detailsTitle}>Recording Details</Text>
          <Text style={styles.detailsTimestamp}>
            {selectedRecording.date} {selectedRecording.timeRange}
          </Text>

          {/* Deep blue radial gradient video player card */}
          <Pressable
            onPress={() => {
              const next = !isPlaying;
              setIsPlaying(next);
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              speakCue(
                next ? 'Playing safety recording.' : 'Recording paused.',
                feedbackPrefs
              );
            }}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause recording' : 'Play recording'}
            style={styles.playerBox}
          >
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 300 300"
              style={StyleSheet.absoluteFill}
            >
              <Defs>
                <RadialGradient id="playerGlow" cx="50%" cy="52%" r="60%">
                  <Stop offset="0%" stopColor="#5D7470" />
                  <Stop offset="48%" stopColor="#2D557E" />
                  <Stop offset="100%" stopColor="#174B8A" />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="300" height="300" rx="22" fill="url(#playerGlow)" />
            </Svg>

            <View style={styles.playCircle}>
              {isPlaying ? (
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Rect x="6" y="5" width="4" height="14" rx="1" fill={colors.white} />
                  <Rect x="14" y="5" width="4" height="14" rx="1" fill={colors.white} />
                </Svg>
              ) : (
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Polygon
                    points="8,5 19,12 8,19"
                    stroke={colors.white}
                    strokeWidth={2.2}
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </View>

            {isPlaying && (
              <View style={styles.playbackBadge}>
                <Text style={styles.playbackBadgeText}>
                  {formatTime(elapsedSec)} / {formatTime(selectedRecording.durationSec)}
                </Text>
              </View>
            )}
          </Pressable>

          <View style={styles.detailsFooterRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
                onToggleImportant(selectedRecording.id);
              }}
              style={[
                styles.importantToggleBtn,
                selectedRecording.important && styles.importantToggleBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.importantToggleText,
                  selectedRecording.important && styles.importantToggleTextActive,
                ]}
              >
                {selectedRecording.important
                  ? 'Marked as Important'
                  : 'Mark as Important'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const filtered =
    filter === 'important'
      ? recordings.filter((item) => item.important)
      : recordings;

  return (
    <View style={styles.root}>
      <View style={styles.headerBlock}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Video Recordings</Text>
            <Text style={styles.subtitle}>Recent camera recordings</Text>
          </View>
          <CloudCheckIcon size={30} color={colors.navy} />
        </View>

        <View style={styles.filterRow}>
          <Pressable
            onPress={() => {
              setFilter('all');
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === 'all' }}
            style={[
              styles.filterPill,
              filter === 'all'
                ? styles.filterPillActive
                : styles.filterPillInactive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all'
                  ? styles.filterTextActive
                  : styles.filterTextInactive,
              ]}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setFilter('important');
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === 'important' }}
            style={[
              styles.filterPill,
              filter === 'important'
                ? styles.filterPillActive
                : styles.filterPillInactive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'important'
                  ? styles.filterTextActive
                  : styles.filterTextInactive,
              ]}
            >
              Important
            </Text>
          </Pressable>
        </View>

        <View style={styles.countRow}>
          <Text style={styles.countLabel}>Today</Text>
          <Text style={styles.countLabel}>{filtered.length} recordings</Text>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((rec) => (
          <Pressable
            key={rec.id}
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setSelectedId(rec.id);
              setElapsedSec(0);
              setIsPlaying(false);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Recording on ${rec.date} from ${rec.timeRange}${
              rec.important ? ', Important' : ''
            }`}
            style={({ pressed }) => [
              styles.recordingCard,
              pressed && styles.recordingCardPressed,
            ]}
          >
            <PlayBoxIcon size={28} color={colors.navy} />

            <View style={styles.cardMiddle}>
              <View style={styles.dateRow}>
                <Text style={styles.dateText}>{rec.date}</Text>
                {rec.important && (
                  <View style={styles.importantBadge}>
                    <Text style={styles.importantBadgeText}>Important</Text>
                  </View>
                )}
              </View>
              <Text style={styles.timeText}>{rec.timeRange}</Text>
            </View>

            <ChevronRightIcon size={20} color={colors.navy} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterPill: {
    flex: 1,
    height: 38,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: colors.navy,
  },
  filterPillInactive: {
    backgroundColor: '#D4DAD6',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
  filterTextInactive: {
    color: '#8E9792',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  countLabel: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
    paddingBottom: spacing.xl,
    gap: 11,
  },
  recordingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.6,
    borderColor: colors.sage,
    borderRadius: 34,
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: 'rgba(255,255,255,0.42)',
    gap: 14,
  },
  recordingCardPressed: {
    opacity: 0.85,
  },
  cardMiddle: {
    flex: 1,
    gap: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  importantBadge: {
    backgroundColor: '#8E9C93',
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  importantBadgeText: {
    color: colors.white,
    fontSize: 11.5,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12.5,
    color: '#808883',
  },
  /* Details screen */
  detailsRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailsContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backFab: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  detailsTimestamp: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 22,
  },
  playerBox: {
    width: '100%',
    aspectRatio: 0.98,
    maxHeight: 330,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  playbackBadge: {
    position: 'absolute',
    bottom: 14,
    backgroundColor: 'rgba(16, 26, 40, 0.72)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  playbackBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsFooterRow: {
    marginTop: 18,
    alignItems: 'center',
  },
  importantToggleBtn: {
    borderWidth: 1.3,
    borderColor: colors.navy,
    borderRadius: radii.pill,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  importantToggleBtnActive: {
    backgroundColor: colors.navy,
  },
  importantToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  importantToggleTextActive: {
    color: colors.white,
  },
});
