import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CreateAccountScreen } from './src/screens/auth/CreateAccountScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { LoginScreen, UserProfile } from './src/screens/auth/LoginScreen';
import { BlindShell } from './src/screens/blind/BlindShell';
import { EmergencyContact } from './src/screens/blind/EmergencyScreen';
import { Coordinates } from './src/screens/blind/NavigationScreen';
import { VideoRecordingItem } from './src/screens/blind/VideoRecordingsScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { PermissionFlowScreen } from './src/screens/permissions/PermissionFlowScreen';
import {
  RoleSelectionScreen,
  UserRole,
} from './src/screens/RoleSelectionScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import {
  SosAlertEvent,
  TrustedDashboardScreen,
} from './src/screens/trusted/TrustedDashboardScreen';
import {
  defaultFeedbackPreferences,
  FeedbackPreferences,
} from './src/utils/feedback';

type AppStage =
  | 'splash'
  | 'onboarding'
  | 'role'
  | 'login'
  | 'signup'
  | 'forgot'
  | 'permissions'
  | 'app';

interface StoredAccount {
  role: UserRole;
  email: string;
  password: string;
  profile: UserProfile;
}

const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'c1',
    name: 'Josephine',
    relation: 'Sister',
    phone: '09123456789',
    enabled: true,
  },
  {
    id: 'c2',
    name: 'Mark',
    relation: 'Father',
    phone: '09098765432',
    enabled: true,
  },
];

const INITIAL_RECORDINGS: VideoRecordingItem[] = [
  { id: 'r1', date: '10/08/2026', timeRange: '10:45 PM - 10:50 PM', important: true, durationSec: 300 },
  { id: 'r2', date: '10/08/2026', timeRange: '10:40 PM - 10:45 PM', important: true, durationSec: 300 },
  { id: 'r3', date: '10/08/2026', timeRange: '10:35 PM - 10:40 PM', important: true, durationSec: 300 },
  { id: 'r4', date: '10/08/2026', timeRange: '10:30 PM - 10:35 PM', important: true, durationSec: 300 },
  { id: 'r5', date: '10/08/2026', timeRange: '10:25 PM - 10:30 PM', important: true, durationSec: 300 },
  { id: 'r6', date: '10/08/2026', timeRange: '10:20 PM - 10:25 PM', important: false, durationSec: 300 },
  { id: 'r7', date: '10/08/2026', timeRange: '10:15 PM - 10:30 PM', important: false, durationSec: 900 },
  { id: 'r8', date: '10/08/2026', timeRange: '10:05 PM - 10:15 PM', important: false, durationSec: 600 },
  { id: 'r9', date: '10/08/2026', timeRange: '09:55 PM - 10:05 PM', important: false, durationSec: 600 },
];

export default function App() {
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const showDesktopPhoneFrame = Platform.OS === 'web' && viewportWidth > 600;
  const appWidth = showDesktopPhoneFrame ? 370 : Math.min(viewportWidth, 370);
  const fixedPreviewHeight = showDesktopPhoneFrame && viewportHeight >= 917;
  const [stage, setStage] = useState<AppStage>('splash');
  const [role, setRole] = useState<UserRole | null>(null);
  const [permissionsDone, setPermissionsDone] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jeremy L. Cinco',
    email: 'jeremylcinco@gmail.com',
    phone: '(+63) 921-875-3137',
  });
  const [trustedProfile, setTrustedProfile] = useState<UserProfile>({
    name: 'Josephine DL. Santos',
    email: 'josephinedlsantos@gmail.com',
    phone: '09123456789',
  });
  const [accounts, setAccounts] = useState<StoredAccount[]>([
    {
      role: 'blind',
      email: 'jeremylcinco@gmail.com',
      password: 'jeremy',
      profile: { name: 'Jeremy L. Cinco', email: 'jeremylcinco@gmail.com', phone: '(+63) 921-875-3137' },
    },
    {
      role: 'trusted',
      email: 'josephinedlsantos@gmail.com',
      password: 'josephine',
      profile: { name: 'Josephine DL. Santos', email: 'josephinedlsantos@gmail.com', phone: '09123456789' },
    },
  ]);
  const [feedbackPrefs, setFeedbackPrefs] = useState<FeedbackPreferences>(
    defaultFeedbackPreferences
  );
  const [location, setLocation] = useState<Coordinates>({
    latitude: 13.6244,
    longitude: 123.1864,
    accuracy: 8,
  });
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [hasDemoSosData, setHasDemoSosData] = useState(false);
  const [hasDemoTrustedConnection, setHasDemoTrustedConnection] = useState(false);
  const [recordings, setRecordings] =
    useState<VideoRecordingItem[]>(INITIAL_RECORDINGS);
  const [alerts, setAlerts] = useState<SosAlertEvent[]>([]);

  const handleAuthSuccess = (updates?: Partial<UserProfile>) => {
    const email = updates?.email?.trim().toLowerCase() ?? '';
    const isJeremyDemo = role === 'blind' && email === 'jeremylcinco@gmail.com';
    const isJosephineDemo = role === 'trusted' && email === 'josephinedlsantos@gmail.com';
    setContacts(isJeremyDemo ? INITIAL_CONTACTS : []);
    setHasDemoSosData(isJeremyDemo);
    setHasDemoTrustedConnection(isJosephineDemo);
    if (!isJosephineDemo) setAlerts([]);
    if (updates) {
      const update = (prev: UserProfile): UserProfile => ({
        name: updates.name ?? prev.name,
        email: updates.email ?? prev.email,
        phone: updates.phone ?? prev.phone,
      });
      if (role === 'trusted') setTrustedProfile(update);
      else setProfile(update);
    }
    setStage(permissionsDone ? 'app' : 'permissions');
  };

  const handleSaveRecording = (isImportant: boolean) => {
    const now = new Date();
    const endLabel = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const start = new Date(now.getTime() - 5 * 60 * 1000);
    const startLabel = start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setRecordings((prev) => [
      {
        id: String(Date.now()),
        date: '10/08/2026',
        timeRange: `${startLabel} - ${endLabel}`,
        important: isImportant,
        durationSec: 300,
      },
      ...prev,
    ]);
  };

  const handleToggleImportantRecording = (id: string) => {
    setRecordings((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, important: !rec.important } : rec
      )
    );
  };

  const handleDispatchSos = (messageText: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setAlerts((prev) => [
      {
        id: String(Date.now()),
        timestamp: time,
        message: messageText,
        acknowledged: false,
        deliveryAttempts: 2,
      },
      ...prev,
    ]);
  };

  const handleSimulateIncomingAlert = () => {
    handleDispatchSos(
      `AWARE SOS ALERT: ${profile.name} needs assistance near ${location.latitude.toFixed(
        5
      )}, ${location.longitude.toFixed(5)}.`
    );
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  return (
    <SafeAreaProvider>
      <View
        style={[
          styles.previewStage,
          showDesktopPhoneFrame && styles.desktopPreviewStage,
        ]}
      >
        <View
          style={[
            styles.mobileFrame,
            { width: appWidth },
            showDesktopPhoneFrame && styles.desktopFrameClip,
            showDesktopPhoneFrame &&
              fixedPreviewHeight && {
                height: 917,
                flex: 0,
              },
          ]}
        >
        {showDesktopPhoneFrame && <View style={styles.phoneTopInset} />}
        <StatusBar style="dark" />

      {stage === 'splash' && (
        <SplashScreen onFinish={() => setStage('onboarding')} />
      )}

      {stage === 'onboarding' && (
        <OnboardingScreen
          feedbackPrefs={feedbackPrefs}
          onComplete={() => setStage('role')}
        />
      )}

      {stage === 'role' && (
        <RoleSelectionScreen
          initialRole={role}
          feedbackPrefs={feedbackPrefs}
          onGetStarted={(chosenRole) => {
            setRole(chosenRole);
            setStage('login');
          }}
        />
      )}

      {stage === 'login' && (
        <LoginScreen
          feedbackPrefs={feedbackPrefs}
          role={role ?? 'blind'}
          accounts={accounts}
          onLoginSuccess={handleAuthSuccess}
          onGoToSignUp={() => setStage('signup')}
          onGoToForgotPassword={() => setStage('forgot')}
        />
      )}

      {stage === 'signup' && (
        <CreateAccountScreen
          feedbackPrefs={feedbackPrefs}
          onCreateSuccess={(updates, password) => {
            if (password && updates.email && updates.name && role) {
              const newAccount: StoredAccount = {
                role,
                email: updates.email.toLowerCase(),
                password,
                profile: {
                  name: updates.name,
                  email: updates.email.toLowerCase(),
                  phone: updates.phone ?? '',
                },
              };
              setAccounts((prev) => [
                ...prev.filter((item) => !(item.role === role && item.email === newAccount.email)),
                newAccount,
              ]);
              setContacts([]);
              setHasDemoSosData(false);
              setHasDemoTrustedConnection(false);
              if (role === 'trusted') setTrustedProfile(newAccount.profile);
              else setProfile(newAccount.profile);
              setStage(permissionsDone ? 'app' : 'permissions');
              return;
            }
            handleAuthSuccess(updates);
          }}
          onGoToSignIn={() => setStage('login')}
        />
      )}

      {stage === 'forgot' && (
        <ForgotPasswordScreen
          feedbackPrefs={feedbackPrefs}
          onBack={() => setStage('login')}
        />
      )}

      {stage === 'permissions' && (
        <PermissionFlowScreen
          feedbackPrefs={feedbackPrefs}
          role={role ?? 'blind'}
          onComplete={() => {
            setPermissionsDone(true);
            setStage('app');
          }}
        />
      )}

      {stage === 'app' && role !== 'trusted' && (
        <BlindShell
          profile={profile}
          onUpdateProfile={setProfile}
          feedbackPrefs={feedbackPrefs}
          onUpdatePrefs={setFeedbackPrefs}
          location={location}
          onLocationUpdate={setLocation}
          contacts={contacts}
          hasDemoSosData={hasDemoSosData}
          onUpdateContacts={setContacts}
          onDispatchSosAlert={handleDispatchSos}
          recordings={recordings}
          onSaveRecording={handleSaveRecording}
          onToggleImportantRecording={handleToggleImportantRecording}
          onReplayOnboarding={() => setStage('onboarding')}
          onSwitchRole={() => setStage('role')}
          onSignOut={() => setStage('login')}
        />
      )}

      {stage === 'app' && role === 'trusted' && (
        <TrustedDashboardScreen
          profile={trustedProfile}
          hasDemoConnection={hasDemoTrustedConnection}
          onUpdateProfile={setTrustedProfile}
          feedbackPrefs={feedbackPrefs}
          onUpdatePrefs={setFeedbackPrefs}
          recordings={recordings}
          onToggleImportantRecording={handleToggleImportantRecording}
          onSignOut={() => setStage('login')}
          location={location}
          alerts={alerts}
          onAcknowledgeAlert={handleAcknowledgeAlert}
          onSimulateIncomingAlert={handleSimulateIncomingAlert}
          onReplayOnboarding={() => setStage('onboarding')}
          onSwitchRole={() => setStage('role')}
        />
      )}
        {showDesktopPhoneFrame && (
          <View pointerEvents="none" style={styles.phoneFrameOverlay}>
            <View style={styles.phoneCamera} />
            <View style={styles.phoneHomeIndicator} />
          </View>
        )}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  previewStage: { flex: 1, width: '100%' },
  desktopPreviewStage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  mobileFrame: {
    flex: 1,
    alignSelf: 'center',
    maxWidth: 370,
    backgroundColor: '#F4F4F2',
    position: 'relative',
  },
  desktopFrameClip: { overflow: 'hidden', borderRadius: 40 },
  phoneTopInset: { height: 14, flexShrink: 0 },
  phoneFrameOverlay: {
    ...StyleSheet.absoluteFill,
    borderWidth: 7,
    borderColor: '#171717',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  phoneCamera: {
    position: 'absolute',
    top: 12,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#080808',
  },
  phoneHomeIndicator: {
    position: 'absolute',
    bottom: 10,
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#171717',
  },
});
