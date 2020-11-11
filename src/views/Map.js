import React, { useEffect} from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

const Map = () => {

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;

  useEffect(() => {
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={
          {
            latitude: 60.161822,
            longitude: 24.917335,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001 * ASPECT_RATIO,
          }
        }
      >
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map
