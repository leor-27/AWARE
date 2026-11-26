import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AwareWordmark, SplashIllustration } from '../components/AwareIllustrations';
import { colors, spacing } from '../theme/tokens';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onFinish, 2400);
    return () => clearTimeout(timer);
  }, [onFinish, opacity, translateY]);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.pressable}
        onPress={onFinish}
        accessibilityRole="button"
        accessibilityLabel="AWARE. Safer Navigation, Supporting Every Step. Tap to continue."
      >
        <Animated.View
          style={[
            styles.content,
            { opacity, transform: [{ translateY }] },
          ]}
        >
          <SplashIllustration width={280} />
          <View style={styles.logoSpacing}>
            <AwareWordmark width={174} color={colors.navy} />
          </View>
          <Text style={styles.tagline}>
            “Safer Navigation, Supporting Every Step.”
          </Text>
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
  logoSpacing: {
    marginTop: 18,
    marginBottom: 22,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
