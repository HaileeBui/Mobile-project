import React, {useEffect, useState} from 'react';
import MapView, { Callout, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';
import firebase from 'firebase';

import Boat from '../components/Boat';
import {firebaseService} from '../services';


const Map = () => {

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [ lastLatitude, setLastLatitude ] = useState(60.161822);
  const [ lastLongitude, setLastLongitude ] = useState(24.917335);
  const [ lastHeading, setLastHeading ] = useState(0);
  const [ lastSpeed, setLastSpeed ] = useState(0);
  const [ vessels, setVessels ] = useState([]);

  //firebaseService.getAllUsers();


  useEffect(() => {
    console.log('USE_EFFECT_CALLED')

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

    firebaseService.getAllUsers()
      .then( users => {
        console.log('USER ', users);
        setVessels(users);
    });

    //child_changed
    firebase.database().
      ref('/users').
      on('child_changed', snapshot => {

        const updateUsers = vessels.map( vessel => {

          if ( vessel.id === snapshot.key ){
            return {
              id: snapshot.key,
              latitude: snapshot.val().latitude,
              longitude: snapshot.val().longitude,
            };
          }
          return vessel;

        });
        setVessels(updateUsers);
      });

    //TODO child_add, child_removed

    return () => {

      firebaseService.detachAllFirebaseCallbacks();
      navigator.geolocation.clearWatch(watchID);

    };
  },[]);

  ////TODO collision alert
  // TODO BOAT image resize
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
        key={0}
        latitude={ lastLatitude }
        longitude={ lastLongitude }
        heading={ lastHeading }
        speed={ lastSpeed }
        isMayDay={false}
      />

      {vessels.map( (vessel, index) => (
        <Boat
          key={index}
          latitude={vessel.latitude}
          heading={0}
          speed={0}
          longitude={vessel.longitude}/>
      ))}
    </MapView>
    <Callout>
      <View style={styles.buttonContainer}>
          <Text style={styles.bubble}>Speed {lastSpeed}</Text>
      </View>
  </Callout>
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
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 50,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  calloutSearch: {
    borderColor: "transparent",
    marginLeft: 10,
    width: "90%",
    marginRight: 10,
    height: 40,
    borderWidth: 0.0
  }
});

export default Map
