import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TabCameraIcon,
  TabLocationIcon,
  TabProfileIcon,
  TabVideoIcon,
} from '../../components/AwareIcons';
import { colors } from '../../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../../utils/feedback';
import { UserProfile } from '../auth/LoginScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { EmergencyContact } from './EmergencyScreen';
import { Coordinates, NavigationScreen } from './NavigationScreen';
import { SmartVisionScreen } from './SmartVisionScreen';
import {
  VideoRecordingItem,
  VideoRecordingsScreen,
} from './VideoRecordingsScreen';

type MainTab = 'vision' | 'recordings' | 'location' | 'profile';

interface BlindShellProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  feedbackPrefs: FeedbackPreferences;
  onUpdatePrefs: (prefs: FeedbackPreferences) => void;
  location: Coordinates;
  onLocationUpdate: (coords: Coordinates) => void;
  contacts: EmergencyContact[];
  hasDemoSosData: boolean;
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
  onDispatchSosAlert: (messageText: string) => void;
  recordings: VideoRecordingItem[];
  onSaveRecording: (isImportant: boolean) => void;
  onToggleImportantRecording: (id: string) => void;
  onReplayOnboarding: () => void;
  onSwitchRole: () => void;
  onSignOut: () => void;
}

export const BlindShell: React.FC<BlindShellProps> = ({
  profile,
  onUpdateProfile,
  feedbackPrefs,
  onUpdatePrefs,
  location,
  onLocationUpdate,
  contacts,
  hasDemoSosData,
  onUpdateContacts,
  onDispatchSosAlert,
  recordings,
  onSaveRecording,
  onToggleImportantRecording,
  onReplayOnboarding,
  onSwitchRole,
  onSignOut,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 370);
  const [activeTab, setActiveTab] = useState<MainTab>('vision');
  const [prevTab, setPrevTab] = useState<MainTab>('vision');
  const [startEmergencySos, setStartEmergencySos] = useState(false);

  const openEmergencyPreparation = () => {
    setStartEmergencySos(true);
    setActiveTab('location');
  };

  const selectTab = (tab: MainTab, spokenLabel: string) => {
    if (tab !== activeTab) {
      setPrevTab(activeTab);
    }
    setActiveTab(tab);
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    speakCue(spokenLabel, feedbackPrefs);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.shell, { width: clampedWidth }]}>
        <View style={styles.body}>
          <View
            style={{
              flex: 1,
              display: activeTab === 'vision' ? 'flex' : 'none',
            }}
          >
            <SmartVisionScreen
              feedbackPrefs={feedbackPrefs}
              isVisible={activeTab === 'vision'}
              onSaveRecording={onSaveRecording}
              onStartEmergencySos={openEmergencyPreparation}
            />
          </View>
          {activeTab === 'recordings' && (
            <VideoRecordingsScreen
              recordings={recordings}
              feedbackPrefs={feedbackPrefs}
              onToggleImportant={onToggleImportantRecording}
            />
          )}
          {activeTab === 'location' && (
            <NavigationScreen
              feedbackPrefs={feedbackPrefs}
              location={location}
              onLocationUpdate={onLocationUpdate}
              contacts={contacts}
              hasDemoSosData={hasDemoSosData}
              onUpdateContacts={onUpdateContacts}
              onDispatchSosAlert={onDispatchSosAlert}
              startEmergencySos={startEmergencySos}
              onEmergencySosStarted={() => setStartEmergencySos(false)}
              onReturnToSmartVision={() => setActiveTab('vision')}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileScreen
              profile={profile}
              onUpdateProfile={onUpdateProfile}
              feedbackPrefs={feedbackPrefs}
              onUpdatePrefs={onUpdatePrefs}
              showVibrationToggle
              onBack={() => setActiveTab(prevTab === 'profile' ? 'vision' : prevTab)}
              onReplayOnboarding={onReplayOnboarding}
              onSwitchRole={onSwitchRole}
              onSignOut={onSignOut}
            />
          )}
        </View>

        {/* 4-Icon Bottom Tab Bar matching AWARE screenshots */}
        <View style={styles.tabBar}>
          <Pressable
            onPress={() => selectTab('vision', 'Smart Vision')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'vision' }}
            accessibilityLabel="Smart Vision"
            style={styles.tabButton}
          >
            <TabCameraIcon
              size={27}
              color={activeTab === 'vision' ? colors.navy : colors.sage}
            />
            {activeTab === 'vision' && <View style={styles.activeUnderline} />}
          </Pressable>

          <Pressable
            onPress={() => selectTab('recordings', 'Video Recordings')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'recordings' }}
            accessibilityLabel="Video Recordings"
            style={styles.tabButton}
          >
            <TabVideoIcon
              size={27}
              color={activeTab === 'recordings' ? colors.navy : colors.sage}
            />
            {activeTab === 'recordings' && <View style={styles.activeUnderline} />}
          </Pressable>

          <Pressable
            onPress={() => selectTab('location', 'Navigation and SOS')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'location' }}
            accessibilityLabel="Navigation and Emergency SOS"
            style={styles.tabButton}
          >
            <TabLocationIcon
              size={27}
              color={activeTab === 'location' ? colors.navy : colors.sage}
            />
            {activeTab === 'location' && <View style={styles.activeUnderline} />}
          </Pressable>

          <Pressable
            onPress={() => selectTab('profile', 'Profile')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'profile' }}
            accessibilityLabel="Profile"
            style={styles.tabButton}
          >
            <TabProfileIcon
              size={27}
              active={activeTab === 'profile'}
              color={activeTab === 'profile' ? colors.navy : colors.sage}
            />
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
  shell: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 125, 112, 0.14)',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 38,
  },
  activeUnderline: {
    width: 28,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.navy,
    marginTop: 5,
  },
});
