import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

interface OrganicBackgroundProps {
  variant:
    | 'onboarding'
    | 'role-neutral'
    | 'role-active'
    | 'profile'
    | 'details';
}

/**
 * Soft blurred organic background blobs matching the AWARE onboarding,
 * role selection, profile, and recording details screens.
 */
export const OrganicBackground: React.FC<OrganicBackgroundProps> = ({ variant }) => {
  const isNeutral = variant === 'role-neutral';
  const primaryColor = isNeutral ? '#9AA59F' : '#6A8BB3';
  const secondaryColor = isNeutral ? '#AEB7B2' : '#85A1C3';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="blobTopLeft" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0%"
              stopColor={primaryColor}
              stopOpacity={variant === 'onboarding' ? 0.42 : 0.34}
            />
            <Stop offset="65%" stopColor={secondaryColor} stopOpacity={0.14} />
            <Stop offset="100%" stopColor={secondaryColor} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="blobRight" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0%"
              stopColor={primaryColor}
              stopOpacity={variant === 'onboarding' ? 0.56 : 0.36}
            />
            <Stop offset="65%" stopColor={secondaryColor} stopOpacity={0.18} />
            <Stop offset="100%" stopColor={secondaryColor} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="blobBottomLeft" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0%"
              stopColor={primaryColor}
              stopOpacity={variant === 'onboarding' ? 0.52 : 0.38}
            />
            <Stop offset="65%" stopColor={secondaryColor} stopOpacity={0.16} />
            <Stop offset="100%" stopColor={secondaryColor} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {variant === 'onboarding' && (
          <>
            <Ellipse cx="65" cy="95" rx="180" ry="175" fill="url(#blobTopLeft)" />
            <Ellipse cx="345" cy="305" rx="175" ry="285" fill="url(#blobRight)" />
            <Ellipse cx="90" cy="755" rx="220" ry="210" fill="url(#blobBottomLeft)" />
          </>
        )}

        {(variant === 'role-neutral' || variant === 'role-active') && (
          <>
            <Ellipse cx="335" cy="110" rx="155" ry="165" fill="url(#blobRight)" />
            <Ellipse cx="95" cy="295" rx="190" ry="160" fill="url(#blobTopLeft)" />
            <Ellipse cx="315" cy="545" rx="195" ry="175" fill="url(#blobRight)" />
            <Ellipse cx="85" cy="745" rx="175" ry="190" fill="url(#blobBottomLeft)" />
          </>
        )}

        {variant === 'profile' && (
          <>
            <Ellipse cx="45" cy="215" rx="145" ry="175" fill="url(#blobTopLeft)" />
            <Ellipse cx="340" cy="240" rx="135" ry="155" fill="url(#blobRight)" />
          </>
        )}

        {variant === 'details' && (
          <>
            <Ellipse cx="285" cy="145" rx="160" ry="110" fill="url(#blobRight)" />
            <Ellipse cx="75" cy="720" rx="170" ry="165" fill="url(#blobBottomLeft)" />
            <Ellipse cx="325" cy="690" rx="140" ry="170" fill="url(#blobRight)" />
          </>
        )}
      </Svg>
    </View>
  );
};
