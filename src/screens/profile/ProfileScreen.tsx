import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import {
  AudioSpeakerWaveIcon,
  ChevronRightIcon,
  GearIcon,
  LockIcon,
  MailIcon,
  PhoneOutlineIcon,
  VibrationPhoneIcon,
} from '../../components/AwareIcons';
import { SplashIllustration } from '../../components/AwareIllustrations';
import { OrganicBackground } from '../../components/OrganicBackground';
import { colors, radii, spacing } from '../../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../../utils/feedback';
import { UserProfile } from '../auth/LoginScreen';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  feedbackPrefs: FeedbackPreferences;
  onUpdatePrefs: (prefs: FeedbackPreferences) => void;
  onBack: () => void;
  onReplayOnboarding: () => void;
  onSwitchRole: () => void;
  onSignOut: () => void;
}

type EditModalKind = 'phone' | 'email' | 'password' | null;

const IntensitySlider: React.FC<{
  value: number;
  onChange: (nextValue: number) => void;
}> = ({ value, onChange }) => {
  const [trackWidth, setTrackWidth] = useState(220);

  const handleTrackPress = (locationX: number) => {
    if (trackWidth <= 0) return;
    const clamped = Math.max(0, Math.min(100, Math.round((locationX / trackWidth) * 100)));
    onChange(clamped);
  };

  return (
    <View style={styles.sliderRow}>
      <Pressable
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        onPress={(e) => handleTrackPress(e.nativeEvent.locationX)}
        style={styles.sliderTouchArea}
        accessibilityRole="adjustable"
        accessibilityLabel={`Intensity ${value}`}
      >
        <View style={styles.sliderTrack} />
        <View
          style={[
            styles.sliderThumb,
            { left: `${Math.max(0, Math.min(96, value))}%` },
          ]}
        />
      </Pressable>
      <Text style={styles.sliderValueText}>{value}</Text>
    </View>
  );
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  feedbackPrefs,
  onUpdatePrefs,
  onBack,
  onReplayOnboarding,
  onSwitchRole,
  onSignOut,
}) => {
  const [showSettingsView, setShowSettingsView] = useState(false);
  const [expandedSlider, setExpandedSlider] = useState<'vibration' | 'audio' | null>(
    'vibration'
  );
  const [editKind, setEditKind] = useState<EditModalKind>(null);
  const [draftValue, setDraftValue] = useState('');

  const openEdit = (kind: EditModalKind) => {
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    if (kind === 'phone') setDraftValue(profile.phone);
    else if (kind === 'email') setDraftValue(profile.email);
    else setDraftValue('');
    setEditKind(kind);
  };

  const saveEdit = () => {
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    if (editKind === 'phone' && draftValue.trim()) {
      onUpdateProfile({ ...profile, phone: draftValue.trim() });
    } else if (editKind === 'email' && draftValue.trim()) {
      onUpdateProfile({ ...profile, email: draftValue.trim() });
    } else if (editKind === 'password') {
      speakCue('Password updated.', feedbackPrefs);
    }
    setEditKind(null);
  };

  if (showSettingsView) {
    return (
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Settings Top Header: Back chevron + mini walking illustration */}
          <View style={styles.settingsHeaderRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
                setShowSettingsView(false);
              }}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Back to Profile"
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Polyline
                  points="15,6 9,12 15,18"
                  stroke={colors.textSecondary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>

            <SplashIllustration width={54} />
          </View>

          <View style={styles.sageDivider} />

          {/* Vibration Intensity */}
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setExpandedSlider((prev) =>
                prev === 'vibration' ? null : 'vibration'
              );
            }}
            style={styles.settingRow}
            accessibilityRole="button"
            accessibilityLabel="Vibration Intensity"
          >
            <VibrationPhoneIcon size={26} color={colors.navy} />
            <Text style={styles.settingRowTitle}>Vibration Intensity</Text>
            <ChevronRightIcon size={16} color={colors.textMuted} />
          </Pressable>

          {expandedSlider === 'vibration' && (
            <IntensitySlider
              value={feedbackPrefs.vibrationIntensity}
              onChange={(vibrationIntensity) => {
                triggerHaptic('warning', vibrationIntensity > 0);
                onUpdatePrefs({
                  ...feedbackPrefs,
                  vibrationIntensity,
                  hapticsEnabled: vibrationIntensity > 0,
                });
              }}
            />
          )}

          {/* Audio Intensity */}
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setExpandedSlider((prev) => (prev === 'audio' ? null : 'audio'));
            }}
            style={styles.settingRow}
            accessibilityRole="button"
            accessibilityLabel="Audio Intensity"
          >
            <AudioSpeakerWaveIcon size={26} color={colors.navy} />
            <Text style={styles.settingRowTitle}>Audio Intensity</Text>
            <ChevronRightIcon size={16} color={colors.textMuted} />
          </Pressable>

          {expandedSlider === 'audio' && (
            <IntensitySlider
              value={feedbackPrefs.audioIntensity}
              onChange={(audioIntensity) => {
                const updated = {
                  ...feedbackPrefs,
                  audioIntensity,
                  voiceEnabled: audioIntensity > 0,
                };
                onUpdatePrefs(updated);
                speakCue(`Audio intensity ${audioIntensity}`, updated);
              }}
            />
          )}

          {/* Email Row */}
          <Pressable
            onPress={() => openEdit('email')}
            style={styles.infoRow}
            accessibilityRole="button"
          >
            <MailIcon size={24} color={colors.navy} />
            <View style={styles.infoMiddle}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValueSmall}>{profile.email}</Text>
            </View>
            <ChevronRightIcon size={16} color={colors.textMuted} />
          </Pressable>

          <View style={styles.sageDivider} />

          {/* Clean secondary account utilities */}
          <View style={styles.accountActions}>
            <Pressable onPress={onSwitchRole} style={styles.subtleAction}>
              <Text style={styles.subtleActionText}>Switch Role</Text>
            </Pressable>
            <Pressable onPress={onReplayOnboarding} style={styles.subtleAction}>
              <Text style={styles.subtleActionText}>Replay Tour</Text>
            </Pressable>
            <Pressable onPress={onSignOut} style={styles.subtleAction}>
              <Text style={[styles.subtleActionText, { color: colors.danger }]}>
                Sign Out
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <EditFieldModal
          editKind={editKind}
          draftValue={draftValue}
          onChangeDraft={setDraftValue}
          onClose={() => setEditKind(null)}
          onSave={saveEdit}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <OrganicBackground variant="profile" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              onBack();
            }}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Polyline
                points="15,6 9,12 15,18"
                stroke={colors.textSecondary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>

          <Text style={styles.headerTitle}>Profile</Text>

          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setShowSettingsView(true);
            }}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Open intensity and account settings"
          >
            <GearIcon size={22} color={colors.navy} />
          </Pressable>
        </View>

        {/* Avatar & Name */}
        <View style={styles.avatarBlock}>
          <View style={styles.avatarCircle}>
            <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
              <Circle cx="28" cy="20" r="9.5" fill={colors.navy} />
              <Path
                d="M12 43C14 34 20 30.5 28 30.5C36 30.5 42 34 44 43C39.5 46 34 47.5 28 47.5C22 47.5 16.5 46 12 43Z"
                fill={colors.navy}
              />
            </Svg>
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
        </View>

        <View style={styles.sageDivider} />

        {/* Contact Info Rows */}
        <Pressable
          onPress={() => openEdit('phone')}
          accessibilityRole="button"
          accessibilityLabel={`Phone number ${profile.phone}`}
          style={styles.infoRow}
        >
          <PhoneOutlineIcon size={20} color={colors.navy} />
          <View style={styles.infoMiddle}>
            <Text style={styles.infoLabel}>Phone number</Text>
            <Text style={styles.infoValue}>{profile.phone}</Text>
          </View>
          <ChevronRightIcon size={16} color={colors.textMuted} />
        </Pressable>

        <Pressable
          onPress={() => openEdit('email')}
          accessibilityRole="button"
          accessibilityLabel={`Email ${profile.email}`}
          style={styles.infoRow}
        >
          <MailIcon size={20} color={colors.navy} />
          <View style={styles.infoMiddle}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValueSmall}>{profile.email}</Text>
          </View>
          <ChevronRightIcon size={16} color={colors.textMuted} />
        </Pressable>

        <View style={styles.sageDivider} />

        <Pressable
          onPress={() => openEdit('password')}
          accessibilityRole="button"
          accessibilityLabel="Change Password"
          style={styles.infoRow}
        >
          <LockIcon size={20} color={colors.navy} />
          <View style={styles.infoMiddle}>
            <Text style={styles.passwordText}>Change Password</Text>
          </View>
          <ChevronRightIcon size={16} color={colors.textMuted} />
        </Pressable>
      </ScrollView>

      <EditFieldModal
        editKind={editKind}
        draftValue={draftValue}
        onChangeDraft={setDraftValue}
        onClose={() => setEditKind(null)}
        onSave={saveEdit}
      />
    </View>
  );
};

const EditFieldModal: React.FC<{
  editKind: EditModalKind;
  draftValue: string;
  onChangeDraft: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}> = ({ editKind, draftValue, onChangeDraft, onClose, onSave }) => (
  <Modal
    visible={editKind !== null}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>
          {editKind === 'phone'
            ? 'Update Phone Number'
            : editKind === 'email'
            ? 'Update Email Address'
            : 'Change Password'}
        </Text>
        <TextInput
          value={draftValue}
          onChangeText={onChangeDraft}
          placeholder={
            editKind === 'password' ? 'Enter new password' : 'Enter value'
          }
          secureTextEntry={editKind === 'password'}
          autoCapitalize="none"
          style={styles.modalInput}
        />
        <View style={styles.modalBtnRow}>
          <Pressable onPress={onClose} style={styles.modalCancelBtn}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={onSave} style={styles.modalSaveBtn}>
            <Text style={styles.modalSaveText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  settingsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 22,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: colors.navy,
    backgroundColor: 'rgba(255,255,255,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  userName: {
    fontSize: 17.5,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  sageDivider: {
    height: 1,
    backgroundColor: colors.sage,
    opacity: 0.75,
    marginVertical: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 18,
  },
  settingRowTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 14,
  },
  sliderTouchArea: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrack: {
    height: 2,
    backgroundColor: colors.sage,
    borderRadius: 1,
  },
  sliderThumb: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.sage,
    top: 9.5,
    marginLeft: -4.5,
  },
  sliderValueText: {
    fontSize: 13.5,
    color: colors.textSecondary,
    width: 28,
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 18,
  },
  infoMiddle: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.sage,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16.5,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  infoValueSmall: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  passwordText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  subtleAction: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  subtleActionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.navy,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 28, 40, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1.2,
    borderColor: colors.sage,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1.2,
    borderColor: colors.navy,
    borderRadius: radii.pill,
    paddingVertical: 11,
    alignItems: 'center',
  },
  modalCancelText: {
    color: colors.navy,
    fontWeight: '600',
    fontSize: 13.5,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    paddingVertical: 11,
    alignItems: 'center',
  },
  modalSaveText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13.5,
  },
});
