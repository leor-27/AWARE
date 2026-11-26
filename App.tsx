import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
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
  const [stage, setStage] = useState<AppStage>('splash');
  const [role, setRole] = useState<UserRole | null>(null);
  const [permissionsDone, setPermissionsDone] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jeremy L. Cinco',
    email: 'jeremylcinco@gmail.com',
    phone: '(+63) 921-875-3137',
  });
  const [feedbackPrefs, setFeedbackPrefs] = useState<FeedbackPreferences>(
    defaultFeedbackPreferences
  );
  const [location, setLocation] = useState<Coordinates>({
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 8,
  });
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [recordings, setRecordings] =
    useState<VideoRecordingItem[]>(INITIAL_RECORDINGS);
  const [alerts, setAlerts] = useState<SosAlertEvent[]>([]);

  const handleAuthSuccess = (updates?: Partial<UserProfile>) => {
    if (updates) {
      setProfile((prev) => ({
        name: updates.name || prev.name,
        email: updates.email || prev.email,
        phone: updates.phone || prev.phone,
      }));
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
          onLoginSuccess={handleAuthSuccess}
          onGoToSignUp={() => setStage('signup')}
          onGoToForgotPassword={() => setStage('forgot')}
        />
      )}

      {stage === 'signup' && (
        <CreateAccountScreen
          feedbackPrefs={feedbackPrefs}
          onCreateSuccess={handleAuthSuccess}
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
          feedbackPrefs={feedbackPrefs}
          location={location}
          alerts={alerts}
          onAcknowledgeAlert={handleAcknowledgeAlert}
          onSimulateIncomingAlert={handleSimulateIncomingAlert}
          onReplayOnboarding={() => setStage('onboarding')}
          onSwitchRole={() => setStage('role')}
        />
      )}
    </SafeAreaProvider>
  );
}
