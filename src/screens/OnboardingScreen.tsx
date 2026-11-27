import React, { ComponentRef, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  AudioVibrationIcon,
  EmergencyPhoneIcon,
  NavigationPinIcon,
  SmartVisionIcon,
} from '../components/AwareIllustrations';
import { OrganicBackground } from '../components/OrganicBackground';
import { colors, spacing } from '../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../utils/feedback';

interface OnboardingSlide {
  id: string;
  title: string;
  leadBold: string;
  description: string;
  renderIcon: () => React.ReactNode;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'smart-vision',
    title: 'Smart Vision',
    leadBold: 'Smart Vision',
    description:
      ' uses the device’s camera to detect selected objects, estimate their distance, and help users stay aware of their surroundings.',
    renderIcon: () => <SmartVisionIcon size={126} color={colors.sage} />,
  },
  {
    id: 'emergency-comm',
    title: 'Emergency\nCommunication',
    leadBold: 'Emergency Communication',
    description:
      ' lets users activate SOS and send an SMS containing their location in text form to saved emergency contacts, and automatically retries if sending fails.',
    renderIcon: () => <EmergencyPhoneIcon size={122} color={colors.sage} />,
  },
  {
    id: 'navigation-mapping',
    title: 'Navigation and\nMapping',
    leadBold: 'Navigation and Mapping',
    description:
      ' monitors user movement to offer reliable location tracking, route guidance, and overall spatial awareness.',
    renderIcon: () => <NavigationPinIcon size={126} color={colors.sage} />,
  },
  {
    id: 'audio-vibration',
    title: 'Audio and Vibration\nFeedback',
    leadBold: 'Audio and Vibration Feedback',
    description:
      ' serves as the device’s output mechanism for object and obstacle detection, distance estimation, navigation and mapping, and emergency assistance that translates environmental data into clear audio and vibration alerts, ensuring safe and independent navigation.',
    renderIcon: () => <AudioVibrationIcon size={126} color={colors.sage} />,
  },
];

interface OnboardingScreenProps {
  feedbackPrefs: FeedbackPreferences;
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  feedbackPrefs,
  onComplete,
}) => {
  const { width } = useWindowDimensions();
  const clampedWidth = Math.min(width, 390);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPage = (index: number) => {
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    if (index >= SLIDES.length) {
      onComplete();
      return;
    }
    scrollRef.current?.scrollTo({ x: index * clampedWidth, animated: true });
    setActiveIndex(index);
    const slide = SLIDES[index];
    speakCue(`${slide.leadBold}${slide.description}`, feedbackPrefs);
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(e.nativeEvent.contentOffset.x / clampedWidth);
    if (nextIndex !== activeIndex && nextIndex >= 0 && nextIndex < SLIDES.length) {
      setActiveIndex(nextIndex);
      triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    }
  };

  return (
    <View style={styles.root}>
      <OrganicBackground variant="onboarding" />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.frame, { width: clampedWidth }]}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            scrollEventThrottle={16}
            style={styles.pager}
          >
            {SLIDES.map((slide) => (
              <View key={slide.id} style={[styles.slide, { width: clampedWidth }]}>
                <View style={styles.headerBlock}>
                  <Text style={styles.eyebrow}>AWARE Features</Text>
                  <Text style={styles.title}>{slide.title}</Text>
                </View>

                <View style={styles.iconContainer}>{slide.renderIcon()}</View>

                <Text style={styles.description}>
                  <Text style={styles.descriptionBold}>{slide.leadBold}</Text>
                  {slide.description}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.dotsRow} accessibilityLabel={`Step ${activeIndex + 1} of ${SLIDES.length}`}>
              {SLIDES.map((slide, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <Pressable
                    key={slide.id}
                    onPress={() => goToPage(idx)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to feature ${idx + 1}: ${slide.leadBold}`}
                    style={[styles.dot, isActive && styles.dotActive]}
                  />
                );
              })}
            </View>

            <View style={styles.fabRow}>
              <Pressable
                onPress={() => goToPage(activeIndex + 1)}
                accessibilityRole="button"
                accessibilityLabel={
                  activeIndex === SLIDES.length - 1
                    ? 'Continue to role selection'
                    : 'Next feature'
                }
                style={({ pressed }) => [
                  styles.nextFab,
                  pressed && styles.nextFabPressed,
                ]}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M5 12H19M13 6L19 12L13 18"
                    stroke={colors.white}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    justifyContent: 'space-between',
  },
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    justifyContent: 'flex-start',
  },
  headerBlock: {
    marginTop: spacing.lg,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sage,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 33,
    lineHeight: 40,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  iconContainer: {
    height: 205,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  descriptionBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#C5CDC8',
  },
  dotActive: {
    backgroundColor: colors.navy,
  },
  fabRow: {
    alignItems: 'flex-end',
  },
  nextFab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.navyDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
  nextFabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
});
