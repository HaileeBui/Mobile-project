import React, {useEffect, useState} from 'react';
import MapView, { PROVIDER_GOOGLE} from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Boat from '../components/Boat';

const Map = () => {

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [ lastLatitude, setLastLatitude ] = useState(60.161822);
  const [ lastLongitude, setLastLongitude ] = useState(24.917335);
  const [ lastHeading, setLastHeading ] = useState(0);
  const [ lastSpeed, setLastSpeed ] = useState(0);

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
        distanceFilter: 1,
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
        latitude:  lastLatitude ,
        longitude: lastLongitude ,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }}
      showsUserLocation={true}
      followUserLocation={true}
    >
      <Boat
        latitude={ lastLatitude }
        longitude={ lastLongitude }
        heading={ lastHeading }
        speed={ lastSpeed }
        isMayDay={true}
      />
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
