import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

export const NagaSatelliteMap: React.FC<{ showRoute?: boolean }> = ({
  showRoute = false,
}) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 360 560" preserveAspectRatio="xMidYMid slice">
      {/* Satellite terrain base */}
      <Rect x="0" y="0" width="360" height="560" fill="#465347" />
      <Path d="M0 0 H175 L130 220 L0 260 Z" fill="#3B483D" />
      <Path d="M180 40 L360 0 V240 L210 210 Z" fill="#525E4E" />
      <Path d="M90 250 L290 230 L360 560 H0 Z" fill="#4C544B" />
      {/* Naga River winding curve */}
      <Path
        d="M-10 245 Q85 215 125 130 T195 -10"
        stroke="#273D47"
        strokeWidth="16"
        fill="none"
      />
      {/* Road network */}
      <GStrokeRoads />
      {showRoute && (
        <Path
          d="M140 198 L175 235 L215 275 L190 325"
          stroke="#4A90E2"
          strokeWidth="5"
          strokeDasharray="8 6"
          fill="none"
        />
      )}
    </Svg>

    {/* Landmarks matching Naga City map screenshots */}
    <View style={[styles.pinLabelWrap, { top: 28, left: 165 }]}>
      <View style={[styles.poiDot, { backgroundColor: '#EA8C2E' }]} />
      <Text style={styles.mapLabel}>Magayon Coffee{'\n'}San Felipe Naga</Text>
    </View>

    <View style={[styles.pinLabelWrap, { top: 82, left: 135 }]}>
      <Text style={[styles.mapLabel, { color: '#B7F0B1' }]}>
        Eternal Gardens{'\n'}Memorial Park - Naga
      </Text>
      <View style={[styles.poiDot, { backgroundColor: '#6C849A' }]} />
    </View>

    <View style={[styles.pinLabelWrap, { top: 142, left: 32 }]}>
      <View style={[styles.poiDot, { backgroundColor: '#D94B43' }]} />
      <Text style={styles.mapLabel}>Sideboard Cafe</Text>
    </View>

    {/* Red Current Location Pin */}
    <View style={{ position: 'absolute', top: 174, left: 122 }}>
      <Svg width={28} height={34} viewBox="0 0 28 34">
        <Path
          d="M14 2C7.9 2 3 6.9 3 13C3 21.2 14 32 14 32C14 32 25 21.2 25 13C25 6.9 20.1 2 14 2Z"
          fill="#D93829"
        />
        <Circle cx="14" cy="13" r="4.5" fill="#7D1911" />
      </Svg>
    </View>
    <Text style={[styles.mapLabel, { position: 'absolute', top: 196, left: 152 }]}>
      THE COFFEE TABLE
    </Text>

    <View style={[styles.pinLabelWrap, { top: 230, left: 30 }]}>
      <Text style={styles.mapLabel}>NHCP Museo ni{'\n'}Jesse Robredo</Text>
      <View style={[styles.poiDot, { backgroundColor: '#8E44AD' }]} />
    </View>

    <View style={[styles.pinLabelWrap, { top: 256, left: 168 }]}>
      <View style={[styles.poiDot, { backgroundColor: '#E84393' }]} />
      <Text style={styles.mapLabel}>Villa Caceres Hotel</Text>
    </View>

    <View style={[styles.pinLabelWrap, { top: 302, left: 148 }]}>
      <View style={[styles.poiDot, { backgroundColor: '#5B768A' }]} />
      <Text style={styles.mapLabel}>Naga City Hall</Text>
    </View>

    <View style={[styles.pinLabelWrap, { top: 372, left: 56 }]}>
      <Text style={styles.mapLabel}>Bicol Medical Center</Text>
      <View style={[styles.poiDot, { backgroundColor: '#D93829' }]}>
        <Text style={styles.poiText}>H</Text>
      </View>
    </View>
  </View>
);

const GStrokeRoads = () => (
  <>
    <Line x1="20" y1="120" x2="350" y2="175" stroke="#858E83" strokeWidth="3.5" />
    <Line x1="10" y1="215" x2="345" y2="275" stroke="#9AA397" strokeWidth="4.5" />
    <Line x1="145" y1="20" x2="195" y2="540" stroke="#9AA397" strokeWidth="4" />
    <Line x1="245" y1="40" x2="295" y2="520" stroke="#7B8479" strokeWidth="3" />
    <Line x1="35" y1="315" x2="335" y2="395" stroke="#858E83" strokeWidth="3.5" />
    <Line x1="65" y1="160" x2="95" y2="460" stroke="#7B8479" strokeWidth="2.5" />
  </>
);

export const NagaLightStreetMap: React.FC<{ height?: number }> = ({
  height = 195,
}) => (
  <View style={[styles.lightMapWrap, { height }]}>
    <Svg width="100%" height="100%" viewBox="0 0 320 195" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <RadialGradient id="livePulse" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF2E2E" stopOpacity={0.45} />
          <Stop offset="100%" stopColor="#FF2E2E" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="195" fill="#F1F2EE" />
      {/* Green park blocks */}
      <Path d="M45 18 L115 8 L108 65 L35 60 Z" fill="#C4DBA8" />
      <Path d="M180 65 L245 55 L252 135 L188 145 Z" fill="#C4DBA8" />
      <Path d="M85 110 L145 100 L155 170 L78 165 Z" fill="#CBE0B1" />
      {/* Grey building footprints */}
      <Rect x="128" y="22" width="36" height="22" fill="#D5D8D3" />
      <Rect x="255" y="18" width="44" height="32" fill="#D5D8D3" />
      <Rect x="22" y="75" width="48" height="26" fill="#D5D8D3" />
      <Rect x="210" y="150" width="52" height="24" fill="#D5D8D3" />
      {/* River */}
      <Path
        d="M-10 115 Q55 115 95 165 T165 210"
        stroke="#B4D4EE"
        strokeWidth="16"
        fill="none"
      />
      {/* White roads */}
      <Line x1="0" y1="70" x2="320" y2="35" stroke="#FFFFFF" strokeWidth="5" />
      <Line x1="168" y1="0" x2="180" y2="195" stroke="#FFFFFF" strokeWidth="6" />
      <Line x1="0" y1="150" x2="320" y2="120" stroke="#FFFFFF" strokeWidth="4.5" />
      <Line x1="70" y1="0" x2="115" y2="195" stroke="#FFFFFF" strokeWidth="4" />
      <Line x1="255" y1="0" x2="235" y2="195" stroke="#FFFFFF" strokeWidth="4" />
      {/* Live red location marker */}
      <Circle cx="242" cy="76" r="22" fill="url(#livePulse)" />
      <Circle cx="242" cy="76" r="5.5" fill="#FF1E1E" />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  pinLabelWrap: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  poiDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  poiText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  mapLabel: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  lightMapWrap: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E6E2',
  },
});
