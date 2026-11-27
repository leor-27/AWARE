import React from 'react';
import {
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import type { Coordinates } from '../screens/blind/NavigationScreen';

interface OpenStreetMapProps {
  center: Coordinates;
  style?: StyleProp<ViewStyle>;
}

const WebIframe = 'iframe' as unknown as React.ComponentType<Record<string, unknown>>;

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ center, style }) => {
  const latDelta = 0.009;
  const lngDelta = 0.009;
  const embedUrl =
    `https://www.openstreetmap.org/export/embed.html?bbox=${center.longitude - lngDelta}%2C${center.latitude - latDelta}%2C${center.longitude + lngDelta}%2C${center.latitude + latDelta}` +
    `&layer=mapnik&marker=${center.latitude}%2C${center.longitude}`;

  return (
    <View style={[styles.container, style]}>
      {React.createElement(WebIframe, {
        title: 'OpenStreetMap location',
        src: embedUrl,
        loading: 'lazy',
        style: { width: '100%', height: '100%', border: 0 },
      })}
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="OpenStreetMap contributors and license"
        onPress={() => void Linking.openURL('https://www.openstreetmap.org/copyright')}
        style={styles.attribution}
      >
        <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E8ECE8',
  },
  attribution: {
    position: 'absolute',
    right: 5,
    bottom: 4,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  attributionText: {
    color: '#31536B',
    fontSize: 9,
  },
});
