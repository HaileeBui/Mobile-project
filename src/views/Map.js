import React, {useEffect, useState} from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

const Map = () => {

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [ lastLatitude, setLastLatitude ] = useState(null);
  const [ lastLongitude, setLastLongitude ] = useState(null);
  const [ lastHeading, setLastHeading ] = useState(null);
  const [ lastSpeed, setLastSpeed ] = useState(null);

  useEffect(() => {

    let watchID = navigator.geolocation.watchPosition(
      //successCallback
      ({coords}) => {
        setLastLatitude ( coords.latitude );
        setLastLongitude ( coords.longitude );
        setLastHeading ( coords.heading );
        setLastSpeed ( coords.speed );
      },
      //errorCallBack
      (error) => {
        console.log("Error: " + error.message);
      },
      //options:
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        distanceFilter: 50,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchID);
    };
  });

  return (
  <View style={styles.container}>
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={{
        latitude: ( lastLatitude ) || 60.161822,
        longitude: (lastLongitude ) || 24.917335,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }}
      showsUserLocation={true}
      followUserLocation={true}
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
