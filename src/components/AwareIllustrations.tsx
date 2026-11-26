import React from 'react';
import Svg, {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
} from 'react-native-svg';
import { colors } from '../theme/tokens';

interface IconProps {
  color?: string;
  size?: number;
}

const MapPin: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <G transform={`translate(${x}, ${y}) scale(${scale})`}>
    <Path
      d="M0 -14 C-5 -14 -8.5 -10.5 -8.5 -6 C-8.5 -0.8 0 7 0 7 C0 7 8.5 -0.8 8.5 -6 C8.5 -10.5 5 -14 0 -14 Z"
      fill={colors.navy}
    />
    <Circle cx="0" cy="-6.2" r="2.7" fill={colors.white} />
  </G>
);

/**
 * Splash hero artwork: person in trench coat & flat cap using a white cane
 * over concentric spatial radar rings and scattered location pins.
 */
export const SplashIllustration: React.FC<{ width?: number }> = ({ width = 290 }) => {
  const height = (width * 210) / 290;
  return (
    <Svg width={width} height={height} viewBox="0 0 290 210">
      {/* Concentric ground radar ripples */}
      <G opacity={0.35} stroke={colors.navy} fill="none" strokeWidth={0.9}>
        <Ellipse cx="186" cy="148" rx="18" ry="6.5" />
        <Ellipse cx="186" cy="148" rx="33" ry="12" />
        <Ellipse cx="186" cy="148" rx="50" ry="18.5" />
        <Ellipse cx="186" cy="148" rx="68" ry="25" />
        <Ellipse cx="186" cy="148" rx="88" ry="32" />
        <Ellipse cx="145" cy="150" rx="115" ry="37" strokeDasharray="160 30 90 25" />
        <Ellipse cx="145" cy="151" rx="134" ry="43" strokeDasharray="120 45 140 35" />
      </G>

      {/* Scattered radar location pins */}
      <MapPin x={65} y={114} scale={0.55} />
      <MapPin x={98} y={113} scale={0.52} />
      <MapPin x={98} y={128} scale={0.58} />
      <MapPin x={42} y={144} scale={0.85} />
      <MapPin x={79} y={153} scale={0.78} />
      <MapPin x={92} y={175} scale={0.9} />
      <MapPin x={153} y={156} scale={0.82} />
      <MapPin x={175} y={142} scale={0.48} />
      <MapPin x={200} y={122} scale={0.48} />
      <MapPin x={221} y={117} scale={0.5} />
      <MapPin x={216} y={136} scale={0.62} />
      <MapPin x={234} y={149} scale={0.82} />
      <MapPin x={221} y={165} scale={0.85} />
      <MapPin x={196} y={185} scale={0.95} />

      {/* Walking person with flat cap, trench coat, and white cane */}
      <G fill={colors.navy}>
        {/* Head & flat cap */}
        <Path d="M135 20 C140 16 150 17 156 22 L162 24 C162 26 158 27 153 26.5 C154 31 151 35 146 36 C141 36 137 33 136 28 C134 26 133 22 135 20 Z" />
        {/* Coat torso, arm & flowing trench coat hem */}
        <Path d="M136 37 C142 35 151 36 155 43 L161 62 L167 76 C169 80 165 84 161 82 L154 74 L151 112 C143 114 134 114 123 111 L127 78 L126 52 C127 44 131 39 136 37 Z" />
        {/* Back leg & shoe */}
        <Path d="M128 111 L120 138 C119 142 121 146 125 147 L128 148 L130 144 C127 141 128 136 131 128 L139 112 Z" />
        {/* Front leg & shoe */}
        <Path d="M141 111 L155 136 C158 140 165 141 169 140 C172 139 172 136 168 134 L161 131 L150 109 Z" />
        {/* Cane handle loop */}
        <Path
          d="M159 80 C155 80 153 84 156 87"
          fill="none"
          stroke={colors.navy}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </G>
      {/* White cane shaft */}
      <Line
        x1="163"
        y1="82"
        x2="195"
        y2="147"
        stroke={colors.navy}
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <Circle cx="195.5" cy="147.5" r="2.3" fill={colors.navy} />
    </Svg>
  );
};

/**
 * Geometric stylized "AWARE" wordmark matching the splash screen typography.
 */
export const AwareWordmark: React.FC<{ width?: number; color?: string }> = ({
  width = 176,
  color = colors.navy,
}) => {
  const height = (width * 42) / 210;
  return (
    <Svg width={width} height={height} viewBox="0 0 210 42">
      {/* A (chevron Λ) */}
      <Polygon points="4,37 16,5 22,5 34,37 27.5,37 19,14 10.5,37" fill={color} />
      {/* W */}
      <Polygon
        points="37,5 43.5,5 50.5,27 57,9 62.5,9 69,27 76,5 82.5,5 72,37 66.5,37 59.8,18.5 53,37 47.5,37"
        fill={color}
      />
      {/* A (chevron Λ) */}
      <Polygon points="84,37 96,5 102,5 114,37 107.5,37 99,14 90.5,37" fill={color} />
      {/* R */}
      <Path
        d="M121 5 H139 C146.5 5 151 9.2 151 15.5 C151 20.5 148 24.2 142.8 25.5 L152 37 H144 L135.8 26.2 H127.5 V37 H121 V5 Z M127.5 10.6 V20.8 H138.2 C142.2 20.8 144.4 18.8 144.4 15.7 C144.4 12.6 142.2 10.6 138.2 10.6 H127.5 Z"
        fill={color}
      />
      {/* Stylized E with extended mid bar */}
      <Rect x="160" y="5" width="6.5" height="32" fill={color} />
      <Rect x="160" y="5" width="25" height="5.6" fill={color} />
      <Rect x="160" y="18" width="28" height="5.6" fill={color} />
      <Rect x="160" y="31.4" width="25" height="5.6" fill={color} />
    </Svg>
  );
};

export const SmartVisionIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 128,
}) => (
  <Svg width={size} height={size} viewBox="0 0 128 128" fill="none">
    <Path
      d="M20 40 C20 34.5 24.5 30 30 30 H40.5 L47 21 C48.5 19 50.8 18 53.3 18 H74.7 C77.2 18 79.5 19 81 21 L87.5 30 H98 C103.5 30 108 34.5 108 40 V95 C108 100.5 103.5 105 98 105 H30 C24.5 105 20 100.5 20 95 V40 Z"
      stroke={color}
      strokeWidth={7.5}
      strokeLinejoin="round"
    />
    <Circle cx="64" cy="67" r="20" stroke={color} strokeWidth={7.5} />
    <Circle cx="92" cy="46" r="5" stroke={color} strokeWidth={5.5} />
  </Svg>
);

export const EmergencyPhoneIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 128,
}) => (
  <Svg width={size} height={size} viewBox="0 0 128 128" fill="none">
    <Path
      d="M27 24 H52 V46 L42 54 C46.5 64.5 55.5 73.5 66 78 L74 68 H96 V93 C96 95.5 94 97 91 97 C55 97 25 67 25 31 C25 27 25.5 24 27 24 Z"
      fill={color}
      stroke={color}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </Svg>
);

export const NavigationPinIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 128,
}) => (
  <Svg width={size} height={size} viewBox="0 0 128 128" fill="none">
    {/* Base shadow ring */}
    <Path
      d="M44 76 C33 79 27 84 27 90 C27 99 43.5 106 64 106 C84.5 106 101 99 101 90 C101 84 95 79 84 76 L71 91 C67.2 95.4 60.8 95.4 57 91 L44 76 Z"
      fill={color}
    />
    {/* Pin body */}
    <Path
      d="M64 18 C46.3 18 32 32.3 32 50 C32 69 57.5 89 64 89 C70.5 89 96 69 96 50 C96 32.3 81.7 18 64 18 Z M64 62 C55.7 62 49 55.3 49 47 C49 38.7 55.7 32 64 32 C72.3 32 79 38.7 79 47 C79 55.3 72.3 62 64 62 Z"
      fill={color}
    />
  </Svg>
);

export const AudioVibrationIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 128,
}) => (
  <Svg width={size} height={size} viewBox="0 0 128 128" fill="none">
    {/* Speaker outline */}
    <Path
      d="M22 50 H39 L63 30 V96 L39 76 H22 C19.8 76 18 74.2 18 72 V54 C18 51.8 19.8 50 22 50 Z"
      stroke={color}
      strokeWidth={7.5}
      strokeLinejoin="round"
    />
    {/* Zig-zag vibration wave */}
    <Polyline
      points="100,26 83,42 100,56 83,70 100,84 83,98 100,108"
      stroke={color}
      strokeWidth={8}
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </Svg>
);

export const BlindRoleIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 64,
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="30" cy="13" r="5" fill={color} />
    <Path
      d="M26 22 C29 20 33 21 35 25 L41 36"
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
    />
    <Path
      d="M29 24 L26 39 L20 53"
      stroke={color}
      strokeWidth={5.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M29 36 L35 44 L36 53"
      stroke={color}
      strokeWidth={5.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cane */}
    <Line
      x1="41"
      y1="36"
      x2="51"
      y2="54"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  </Svg>
);

export const TrustedRoleIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 64,
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="29" cy="22" r="9.5" stroke={color} strokeWidth={3.6} />
    <Path
      d="M13 48 C13 40.5 20 36 29 36 C33.5 36 37.5 37.2 40.5 39.2"
      stroke={color}
      strokeWidth={3.6}
      strokeLinecap="round"
    />
    {/* Plus badge */}
    <Line x1="47" y1="40" x2="47" y2="52" stroke={color} strokeWidth={3.6} strokeLinecap="round" />
    <Line x1="41" y1="46" x2="53" y2="46" stroke={color} strokeWidth={3.6} strokeLinecap="round" />
  </Svg>
);
