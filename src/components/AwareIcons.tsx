import React from 'react';
import Svg, {
  Circle,
  Line,
  Path,
  Polyline,
  Rect,
} from 'react-native-svg';
import { colors } from '../theme/tokens';

interface IconProps {
  color?: string;
  size?: number;
}

export const BackArrowIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M11 6L5 12L11 18"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MailIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 18,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="14" rx="2.5" stroke={color} strokeWidth={1.8} />
    <Path d="M4 7L12 13L20 7" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 18,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="9.5" rx="2.5" stroke={color} strokeWidth={1.8} />
    <Path d="M8 11V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V11" stroke={color} strokeWidth={1.8} />
    <Circle cx="12" cy="15.5" r="1.3" fill={color} />
  </Svg>
);

export const PadlockLargeIcon: React.FC<IconProps> = ({
  color = '#1B2D4E',
  size = 86,
}) => (
  <Svg width={size} height={size} viewBox="0 0 86 86" fill="none">
    <Path
      d="M27 39V30C27 21.2 34.2 14 43 14C51.8 14 59 21.2 59 30V39"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
    />
    <Rect x="16" y="39" width="54" height="33" rx="10" stroke={color} strokeWidth={4} />
    <Circle cx="43" cy="55.5" r="5.5" stroke={color} strokeWidth={3.5} />
  </Svg>
);

export const EyeIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 18,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12C4.5 7.5 8 5.5 12 5.5C16 5.5 19.5 7.5 22 12C19.5 16.5 16 18.5 12 18.5C8 18.5 4.5 16.5 2 12Z"
      stroke={color}
      strokeWidth={1.8}
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
  </Svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 18,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12C5.2 8.2 8.3 6.2 12 6.2C15.7 6.2 18.8 8.2 21 12"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M9.5 14.5C10.2 15.1 11 15.5 12 15.5C13.9 15.5 15.5 13.9 15.5 12C15.5 11 15.1 10.2 14.5 9.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Line x1="4" y1="4" x2="20" y2="20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const GoogleLogoIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.6 12.23C21.6 11.49 21.53 10.78 21.41 10.1H12V14.13H17.39C17.16 15.39 16.43 16.46 15.35 17.18V19.79H18.64C20.57 18.02 21.6 15.37 21.6 12.23Z"
      fill="#4285F4"
    />
    <Path
      d="M12 22C14.7 22 16.96 21.11 18.64 19.79L15.35 17.18C14.44 17.79 13.31 18.16 12 18.16C9.42 18.16 7.23 16.42 6.45 14.08H3.06V16.77C4.73 20.09 8.11 22 12 22Z"
      fill="#34A853"
    />
    <Path
      d="M6.45 14.08C6.25 13.47 6.13 12.82 6.13 12.15C6.13 11.48 6.25 10.83 6.45 10.22V7.53H3.06C2.37 8.91 1.98 10.48 1.98 12.15C1.98 13.82 2.37 15.39 3.06 16.77L6.45 14.08Z"
      fill="#FBBC05"
    />
    <Path
      d="M12 6.14C13.47 6.14 14.79 6.65 15.83 7.64L18.71 4.76C16.95 3.12 14.7 2.15 12 2.15C8.11 2.15 4.73 4.06 3.06 7.38L6.45 10.07C7.23 7.73 9.42 6.14 12 6.14Z"
      fill="#EA4335"
    />
  </Svg>
);

export const GuestUserIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 22,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8.2" r="3.6" stroke={color} strokeWidth={1.8} />
    <Path
      d="M5 19.5C5.6 16.3 8.4 14.5 12 14.5C15.6 14.5 18.4 16.3 19 19.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

export const PhoneOutlineIcon: React.FC<IconProps> = ({
  color = colors.navy,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.6 3.8H9.8L11.2 7.8L9.2 9.2C10.1 11.1 11.7 12.7 13.6 13.6L15 11.6L19 13V16.2C19 17.5 17.9 18.6 16.6 18.6C10.5 18.6 5.4 13.5 5.4 7.4C5.4 6.1 6 3.8 6.6 3.8Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  </Svg>
);

export const GearIcon: React.FC<IconProps> = ({
  color = colors.navy,
  size = 22,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth={1.9} />
    <Path
      d="M12 3.2V5.3M12 18.7V20.8M4.9 6.2L6.5 7.7M17.5 16.3L19.1 17.8M3.2 12H5.3M18.7 12H20.8M4.9 17.8L6.5 16.3M17.5 7.7L19.1 6.2"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
    />
  </Svg>
);

export const CloudCheckIcon: React.FC<IconProps> = ({
  color = colors.navy,
  size = 28,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M8.5 21H20C22.8 21 25 18.9 25 16.2C25 13.7 23.1 11.7 20.7 11.4C20 7.7 16.8 5 13 5C8.9 5 5.6 8.2 5.4 12.2C3.5 12.8 2.2 14.6 2.2 16.7C2.2 19.1 4.2 21 6.7 21H8.5Z"
      stroke={color}
      strokeWidth={2.2}
      strokeLinejoin="round"
    />
    <Polyline
      points="10,15 12.8,17.5 18,12"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PlayBoxIcon: React.FC<IconProps> = ({
  color = colors.navy,
  size = 26,
}) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
    <Rect x="2.5" y="3.5" width="21" height="19" rx="5.5" stroke={color} strokeWidth={2.3} />
    <Path d="M10.5 9.2L17 13L10.5 16.8V9.2Z" fill={color} />
  </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  color = colors.navy,
  size = 18,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="9,6 15,12 9,18"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PowerIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 28,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M9.5 6.8C6.7 8.4 5 11.3 5 14.6C5 19.5 9 23.5 14 23.5C19 23.5 23 19.5 23 14.6C23 11.3 21.3 8.4 18.5 6.8"
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
    />
    <Line x1="14" y1="3.5" x2="14" y2="13.5" stroke={color} strokeWidth={2.8} strokeLinecap="round" />
  </Svg>
);

/* --- Permission Icons (1 of 4 to 4 of 4) --- */

export const CameraPermissionIcon: React.FC<{ size?: number }> = ({ size = 104 }) => (
  <Svg width={size} height={size} viewBox="0 0 104 104" fill="none">
    <Path
      d="M14 34C14 29.6 17.6 26 22 26H31.5L37 18.5C38.2 16.9 40 16 42 16H60C62 16 63.8 16.9 65 18.5L70.5 26H80C84.4 26 88 29.6 88 34V74C88 78.4 84.4 82 80 82H22C17.6 82 14 78.4 14 74V34Z"
      stroke={colors.sage}
      strokeWidth={5.5}
      strokeLinejoin="round"
    />
    <Circle cx="51" cy="54" r="15.5" stroke={colors.sage} strokeWidth={5.5} />
    <Circle cx="75" cy="38" r="3.6" stroke={colors.sage} strokeWidth={4} />
    {/* Blue checkmark badge */}
    <Circle cx="82" cy="80" r="14" fill={colors.navy} />
    <Polyline
      points="75.5,80.5 80,85 89,75"
      stroke={colors.white}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MicPermissionIcon: React.FC<{ size?: number }> = ({ size = 104 }) => (
  <Svg width={size} height={size} viewBox="0 0 104 104" fill="none">
    <Rect x="36" y="14" width="28" height="45" rx="14" stroke={colors.sage} strokeWidth={6} />
    <Path
      d="M24 46C24 60.4 35.6 72 50 72C64.4 72 76 60.4 76 46"
      stroke={colors.sage}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <Line x1="50" y1="72" x2="50" y2="88" stroke={colors.sage} strokeWidth={6} strokeLinecap="round" />
    <Circle cx="65" cy="76" r="14" fill={colors.navy} />
    <Polyline
      points="58.5,76.5 63,81 72,71"
      stroke={colors.white}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LocationPermissionIcon: React.FC<{ size?: number }> = ({ size = 104 }) => (
  <Svg width={size} height={size} viewBox="0 0 104 104" fill="none">
    <Path
      d="M52 16C39 16 28.5 26.5 28.5 39.5C28.5 54.5 47 71 52 71C57 71 75.5 54.5 75.5 39.5C75.5 26.5 65 16 52 16Z"
      stroke={colors.sage}
      strokeWidth={5.5}
      strokeLinejoin="round"
    />
    <Circle cx="52" cy="39" r="6" stroke={colors.sage} strokeWidth={4.5} />
    <Path
      d="M34 62C24.5 65 19 69.5 19 74.5C19 82.5 33.8 88 52 88C70.2 88 85 82.5 85 74.5C85 69.5 79.5 65 70 62"
      stroke={colors.sage}
      strokeWidth={5.5}
      strokeLinecap="round"
    />
    <Circle cx="70" cy="78" r="14" fill={colors.navy} />
    <Polyline
      points="63.5,78.5 68,83 77,73"
      stroke={colors.white}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SosShortcutPermissionIcon: React.FC<{ size?: number }> = ({ size = 104 }) => (
  <Svg width={size} height={size} viewBox="0 0 104 104" fill="none">
    {/* Volume press arrows */}
    <Path d="M16 39H30M26 35L30 39L26 43" stroke={colors.sage} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 59H30M26 55L30 59L26 63" stroke={colors.sage} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Phone outline */}
    <Rect x="37" y="16" width="44" height="72" rx="10" stroke={colors.sage} strokeWidth={5.2} />
    <Line x1="51" y1="24" x2="67" y2="24" stroke={colors.sage} strokeWidth={3.2} strokeLinecap="round" />
    <Line x1="53" y1="79" x2="65" y2="79" stroke={colors.sage} strokeWidth={3.2} strokeLinecap="round" />
    {/* Side volume buttons */}
    <Line x1="34" y1="36" x2="34" y2="43" stroke={colors.sage} strokeWidth={4} strokeLinecap="round" />
    <Line x1="34" y1="54" x2="34" y2="61" stroke={colors.sage} strokeWidth={4} strokeLinecap="round" />
    {/* Blue phone badge */}
    <Circle cx="79" cy="75" r="15" fill={colors.navy} />
    <Path
      d="M73 68H76.5L78 72L76 73.5C77 75.5 78.5 77 80.5 78L82 76L86 77.5V81C86 82.2 85 83 83.8 83C77.5 83 72 77.5 72 71.2C72 69.8 72.4 68 73 68Z"
      fill={colors.white}
    />
  </Svg>
);

/* --- Bottom Tab Bar Icons --- */

export const TabCameraIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 26,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M3.5 9C3.5 7.6 4.6 6.5 6 6.5H8.8L10.6 4.2C11 3.7 11.6 3.5 12.2 3.5H15.8C16.4 3.5 17 3.7 17.4 4.2L19.2 6.5H22C23.4 6.5 24.5 7.6 24.5 9V21C24.5 22.4 23.4 23.5 22 23.5H6C4.6 23.5 3.5 22.4 3.5 21V9Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Circle cx="14" cy="15" r="4.5" stroke={color} strokeWidth={2} />
    <Circle cx="20.5" cy="10" r="1.1" fill={color} />
  </Svg>
);

export const TabVideoIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 26,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Rect x="3.5" y="7" width="15" height="14" rx="3" stroke={color} strokeWidth={2} />
    <Path
      d="M18.5 11.5L24.5 8V20L18.5 16.5V11.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </Svg>
);

export const TabLocationIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 26,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 4C10.1 4 7 7.1 7 11C7 15.8 14 21 14 21C14 21 21 15.8 21 11C21 7.1 17.9 4 14 4Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Circle cx="14" cy="10.8" r="2.3" stroke={color} strokeWidth={1.8} />
    <Path
      d="M8.5 19.5C5.8 20.3 4.5 21.5 4.5 22.8C4.5 24.8 8.7 26 14 26C19.3 26 23.5 24.8 23.5 22.8C23.5 21.5 22.2 20.3 19.5 19.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

export const TabProfileIcon: React.FC<IconProps & { active?: boolean }> = ({
  color = colors.sage,
  size = 26,
  active = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="10.5" stroke={color} strokeWidth={active ? 2.2 : 1.8} />
    <Circle cx="14" cy="11.2" r="3.4" stroke={color} strokeWidth={1.8} />
    <Path
      d="M8.2 21.2C9.2 18.6 11.4 17.3 14 17.3C16.6 17.3 18.8 18.6 19.8 21.2"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

/* --- Audio & Vibration Feedback Circle Icons --- */

export const CarFrontIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 100,
}) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Car cabin & body */}
    <Path
      d="M27 22C28.5 18 32 16 36 16H64C68 16 71.5 18 73 22L80 43V69C80 71.5 78 73 75.5 73H73V80C73 82.8 70.8 85 68 85H64C61.2 85 59 82.8 59 80V73H41V80C41 82.8 38.8 85 36 85H32C29.2 85 27 82.8 27 80V73H24.5C22 73 20 71.5 20 69V43L27 22Z"
      fill={color}
    />
    {/* Windshield cutout */}
    <Path
      d="M33.5 25.5L28.5 41H71.5L66.5 25.5C65.8 23.6 64 22.5 62 22.5H38C36 22.5 34.2 23.6 33.5 25.5Z"
      fill={colors.sage}
    />
    {/* Headlights */}
    <Circle cx="32.5" cy="56" r="5" fill={colors.sage} />
    <Circle cx="67.5" cy="56" r="5" fill={colors.sage} />
  </Svg>
);

export const AlertExclamationCircleIcon: React.FC<IconProps> = ({
  size = 96,
}) => (
  <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
    <Circle cx="48" cy="48" r="42" fill="#F2F3F2" />
    <Rect x="43.5" y="23" width="9" height="33" rx="2" fill={colors.sage} />
    <Rect x="43.5" y="64" width="9" height="9" rx="1.5" fill={colors.sage} />
  </Svg>
);

export const PersonBustIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 100,
}) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Circle cx="50" cy="30" r="15.5" fill={color} />
    <Path
      d="M19 80C19 62 32 52 50 52C68 52 81 62 81 80V83H19V80Z"
      fill={color}
    />
  </Svg>
);

export const HangingSignIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 104,
}) => (
  <Svg width={size} height={size} viewBox="0 0 104 104" fill="none">
    {/* L-shaped pole */}
    <Path
      d="M21 20H77C81.4 20 85 23.6 85 28V81"
      stroke={color}
      strokeWidth={7.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Hanger stems */}
    <Line x1="36" y1="20" x2="36" y2="33" stroke={color} strokeWidth={6} />
    <Line x1="59" y1="20" x2="59" y2="33" stroke={color} strokeWidth={6} />
    {/* Signboard */}
    <Rect
      x="20"
      y="33"
      width="54"
      height="28"
      rx="9"
      stroke={color}
      strokeWidth={7}
    />
    {/* Three dots inside sign */}
    <Circle cx="35" cy="47" r="3.4" fill={color} />
    <Circle cx="47" cy="47" r="3.4" fill={color} />
    <Circle cx="59" cy="47" r="3.4" fill={color} />
  </Svg>
);

export const EmergencySirenIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 100,
}) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Rays */}
    <Line x1="50" y1="12" x2="50" y2="21" stroke={color} strokeWidth={6.5} strokeLinecap="square" />
    <Line x1="25" y1="23" x2="31" y2="29" stroke={color} strokeWidth={6.5} strokeLinecap="square" />
    <Line x1="75" y1="23" x2="69" y2="29" stroke={color} strokeWidth={6.5} strokeLinecap="square" />
    {/* Dome */}
    <Path
      d="M29 73V52C29 40.4 38.4 31 50 31C61.6 31 71 40.4 71 52V73H29Z"
      fill={color}
    />
    {/* Highlight arc */}
    <Path
      d="M38 52C38 45.4 43.4 40 50 40"
      stroke={colors.sage}
      strokeWidth={4.5}
      strokeLinecap="round"
    />
    {/* Base bar */}
    <Rect x="22" y="73" width="56" height="8.5" rx="2" fill={color} />
  </Svg>
);

export const NavPaperArrowIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 100,
}) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Path
      d="M84 18L16 47L45 56L54 85L84 18Z"
      fill={color}
      stroke={color}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </Svg>
);

export const PersonPinIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 104,
}) => (
  <Svg width={size} height={size} viewBox="0 0 104 104" fill="none">
    <Path
      d="M52 14C34.3 14 20 28.3 20 46C20 67.5 52 92 52 92C52 92 84 67.5 84 46C84 28.3 69.7 14 52 14Z"
      stroke={color}
      strokeWidth={8.5}
      strokeLinejoin="round"
    />
    <Circle cx="52" cy="39" r="9.5" fill={color} />
    <Path
      d="M32 64C35 55 42.5 51.5 52 51.5C61.5 51.5 69 55 72 64L52 80L32 64Z"
      fill={color}
    />
  </Svg>
);

export const AmbulanceIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="8" cy="4" r="1" fill={color} />
    <Circle cx="12" cy="4" r="1" fill={color} />
    <Circle cx="16" cy="4" r="1" fill={color} />
    <Path
      d="M6 9L7.5 6.5H16.5L18 9L19.5 11.5V17.5H18V19.5H15.5V17.5H8.5V19.5H6V17.5H4.5V11.5L6 9Z"
      fill={color}
    />
    <Rect x="7" y="8" width="10" height="3.2" rx="0.8" fill={colors.background} />
    <Circle cx="7.5" cy="14" r="1.1" fill={colors.background} />
    <Circle cx="16.5" cy="14" r="1.1" fill={colors.background} />
  </Svg>
);

export const PoliceCarIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9.5" y="4.5" width="5" height="2" rx="0.8" fill={color} />
    <Path
      d="M5.5 10.5L7.5 7H16.5L18.5 10.5L20 12.5V17.5H18.5V19.5H16V17.5H8V19.5H5.5V17.5H4V12.5L5.5 10.5Z"
      fill={color}
    />
    <Path d="M7.8 8.5L6.8 11H17.2L16.2 8.5H7.8Z" fill={colors.background} />
    <Rect x="5.5" y="13.5" width="3" height="1.5" rx="0.5" fill={colors.background} />
    <Rect x="15.5" y="13.5" width="3" height="1.5" rx="0.5" fill={colors.background} />
  </Svg>
);

export const VibrationPhoneIcon: React.FC<IconProps> = ({
  color = colors.navy,
  size = 28,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Rect x="8.5" y="4.5" width="11" height="19" rx="2.2" stroke={color} strokeWidth={2.2} />
    <Polyline
      points="4.5,7 2.8,9.5 4.5,12 2.8,14.5 4.5,17 2.8,19.5 4.5,21.5"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="23.5,7 25.2,9.5 23.5,12 25.2,14.5 23.5,17 25.2,19.5 23.5,21.5"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const AudioSpeakerWaveIcon: React.FC<IconProps> = ({
  color = colors.navy,
  size = 28,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4.5 10.5H8.5L14.5 5.5V22.5L8.5 17.5H4.5C3.9 17.5 3.5 17.1 3.5 16.5V11.5C3.5 10.9 3.9 10.5 4.5 10.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Path
      d="M18.2 10.2C19.6 11.4 20.3 12.7 20.3 14C20.3 15.3 19.6 16.6 18.2 17.8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M21.2 7.5C23.4 9.3 24.5 11.5 24.5 14C24.5 16.5 23.4 18.7 21.2 20.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 22,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3L4.5 6.2V11.5C4.5 16.2 7.7 20.4 12 21.8C16.3 20.4 19.5 16.2 19.5 11.5V6.2L12 3Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Polyline
      points="9,12 11.2,14.2 15.5,9.8"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TrashIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 22,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4.5 7H19.5M9.5 7V4.8C9.5 4.4 9.9 4 10.3 4H13.7C14.1 4 14.5 4.4 14.5 4.8V7M6.5 7L7.4 19C7.5 19.8 8.1 20.4 8.9 20.4H15.1C15.9 20.4 16.5 19.8 16.6 19L17.5 7"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="10.2" y1="10.8" x2="10.5" y2="16.8" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    <Line x1="13.8" y1="10.8" x2="13.5" y2="16.8" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

export const SlidersIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="4" y1="8" x2="11" y2="8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx="14" cy="8" r="2.2" stroke={color} strokeWidth={1.8} />
    <Line x1="17" y1="8" x2="20" y2="8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1="4" y1="16" x2="7" y2="16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx="10" cy="16" r="2.2" stroke={color} strokeWidth={1.8} />
    <Line x1="13" y1="16" x2="20" y2="16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const SendPlaneOutlineIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 3L3 10.5L10.5 13.5L13.5 21L21 3Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

export const MicOutlineIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="3" width="6" height="10.5" rx="3" stroke={color} strokeWidth={1.8} />
    <Path
      d="M5.5 11.5C5.5 15.1 8.4 18 12 18C15.6 18 18.5 15.1 18.5 11.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Line x1="12" y1="18" x2="12" y2="21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const RetryCycleIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 8C17.6 5.6 15 4 12 4C7.6 4 4 7.6 4 12"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
    />
    <Polyline points="16.5,8.5 19.5,8.5 19.5,5.5" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M5 16C6.4 18.4 9 20 12 20C16.4 20 20 16.4 20 12"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
    />
    <Polyline points="7.5,15.5 4.5,15.5 4.5,18.5" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const WarningTriangleIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.5L21 19.5H3L12 3.5Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Line x1="12" y1="9.5" x2="12" y2="14" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    <Circle cx="12" cy="16.8" r="1" fill={color} />
  </Svg>
);

export const CheckCircleOutlineIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
    <Polyline
      points="8.2,12.2 10.8,14.8 15.8,9.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MapPinOutlineIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.5C8.7 3.5 6 6.2 6 9.5C6 14 12 20.5 12 20.5C12 20.5 18 14 18 9.5C18 6.2 15.3 3.5 12 3.5Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="9.5" r="2.2" stroke={color} strokeWidth={1.8} />
  </Svg>
);

export const ClockOutlineIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={1.8} />
    <Polyline
      points="12,7.5 12,12 15.2,13.8"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CloudDownIcon: React.FC<IconProps> = ({
  color = colors.sage,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 18.5H17.5C19.7 18.5 21.5 16.8 21.5 14.6C21.5 12.6 20 11 18 10.7C17.4 7.7 14.8 5.5 11.7 5.5C8.3 5.5 5.6 8.1 5.4 11.4C3.8 11.9 2.7 13.4 2.7 15.1C2.7 17 4.3 18.5 6.3 18.5H7Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Line x1="12" y1="11.2" x2="12" y2="16.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Polyline
      points="9.8,14.5 12,16.8 14.2,14.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BellIcon: React.FC<IconProps> = ({
  color = colors.navy,
  size = 22,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.5 16.5V10.5C6.5 7.4 9 5 12 5C15 5 17.5 7.4 17.5 10.5V16.5L19.5 18.5H4.5L6.5 16.5Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <Path d="M10 18.8C10.4 19.9 11.1 20.5 12 20.5C12.9 20.5 13.6 19.9 14 18.8" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

export const TurnRightIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 22,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 19V11C6 9.3 7.3 8 9 8H18"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <Polyline
      points="14,4.5 18,8 14,11.5"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const FootstepsIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.5 6.5C8.9 6.5 9.8 8 9.6 10.2C9.4 11.8 8.3 12.8 7.1 12.6C6 12.4 5.5 11.1 5.7 9.4C5.9 7.6 6.6 6.5 7.5 6.5Z"
      stroke={color}
      strokeWidth={1.6}
    />
    <Path
      d="M15.5 10.5C16.9 10.5 17.8 12 17.6 14.2C17.4 15.8 16.3 16.8 15.1 16.6C14 16.4 13.5 15.1 13.7 13.4C13.9 11.6 14.6 10.5 15.5 10.5Z"
      stroke={color}
      strokeWidth={1.6}
    />
  </Svg>
);

export const FlagIcon: React.FC<IconProps> = ({
  color = colors.white,
  size = 16,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="6" y1="4" x2="6" y2="20" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M6 5H17L15 9L17 13H6V5Z" fill={color} />
  </Svg>
);
