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
import MapView, { Marker, UrlTile } from 'react-native-maps';
import type { Coordinates } from '../screens/blind/NavigationScreen';

interface OpenStreetMapProps {
  center: Coordinates;
  style?: StyleProp<ViewStyle>;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ center, style }) => {
  const lat = center.latitude;
  const lng = center.longitude;
  const latDelta = 0.009;
  const lngDelta = 0.009;

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={StyleSheet.absoluteFill}
        mapType="none"
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        }}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          tileSize={256}
          zIndex={-1}
        />
        <Marker coordinate={{ latitude: lat, longitude: lng }} pinColor="#1F5A94" />
      </MapView>
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
