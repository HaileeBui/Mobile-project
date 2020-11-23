import React, {useEffect, useState} from 'react';
import MapView, { Callout, Circle, PROVIDER_GOOGLE, } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';
import firebase from 'firebase';
import { DOMParser } from 'xmldom'

import Boat from '../components/Boat';
import { digiTrafficService, firebaseService } from '../services';
import { Distance } from '../utilities';


const Map = () => {

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const METER_TO_KILOMETER_CONSTANT = 3.6;
  const METER_TO_KNOT_CONSTANT = 1.9438445;

  const [ lastLatitude, setLastLatitude ] = useState(60.161822);
  const [ lastLongitude, setLastLongitude ] = useState(24.917335);
  const [ lastHeading, setLastHeading ] = useState(0);
  const [ lastSpeed, setLastSpeed ] = useState(0);
  const [ vessels, setVessels ] = useState([]);
  const [ isCollisionDetected, setIsCollisionDetected ] = useState(false);
  const [ alertRadius , setAlertRadius ] = useState(0.900); // In Kilometers

  const loadVessels = () => {

    firebaseService.getAllVessels()
    .then( vessels => {
      setVessels(vessels);
      const proximityAlert = vessels.some( vessel => Distance.isDistanceLessThen( vessel, lastLatitude, lastLongitude, alertRadius));
      setIsCollisionDetected ( proximityAlert );
    });
  }


  useEffect(() => {

    loadVessels();

    let watchID = navigator.geolocation.watchPosition(

      //successCallback
      ({coords}) => {

        setLastLatitude ( coords.latitude );
        setLastLongitude ( coords.longitude );
        setLastHeading ( coords.heading );
        setLastSpeed ( coords.speed );

        firebaseService.updateVessel(coords.latitude, coords.longitude, coords.heading, coords.speed)
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

    //child_changed
    firebase.database()
    .ref('/vessels')
    .on('child_changed', snapshot => {

        if ( !(snapshot.val().userId === firebase.auth().currentUser.uid) ){
          const updateVessel = {
            id: snapshot.key,
            latitude: snapshot.val().latitude,
            longitude: snapshot.val().longitude,
            heading: snapshot.val().heading,
            speed: snapshot.val().speed,
            hasMayDay: snapshot.val().hasMayDay,
          };

          const updateVessels = vessels.map(vessel => {

            if (vessel.id === snapshot.val().userId) {
              return updateVessel;
            }

            return vessel;
          });

          const proximityAlert = Distance.isDistanceLessThen(updateVessel,
            lastLatitude, lastLongitude, alertRadius);

          if (proximityAlert) {
            setIsCollisionDetected(proximityAlert);
          }

          setVessels(updateVessels);
        }
      });

    //TODO child_add, child_removed

    return () => {

      firebaseService.detachAllFirebaseCallbacks();
      navigator.geolocation.clearWatch(watchID);
    };
  },[]);

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
    >
      <Boat
        key={0}
        latitude={ lastLatitude }
        longitude={ lastLongitude }
        heading={ lastHeading }
        //speed={ lastSpeed }
        hasMayDay={false}
        isInDanger={ isCollisionDetected }
        isThisUser={true}
      />

      {vessels.map( (vessel, index) => (
        <Boat
          key={vessel.id}
          latitude={vessel.latitude}
          heading={vessel.heading}
          longitude={vessel.longitude}
          speed={vessel.speed}
          hasMayDay={vessel.hasMayDay}
          title={vessel.id}
        />
      ))}

      {/*{ isCollisionDetected && <Circle
        center={{
          latitude: lastLatitude ,
          longitude: lastLongitude ,
        }}
        //enter={alertZone.center}
        radius={alertRadius * 1000}
        fillColor={'rgba(255, 0, 0, 0.2)'}
        strokeColor="rgba(0,0,0,0.5)"
      /> }*/}
    </MapView>

    <View style={styles.speedContainer}>
      <Text style={styles.bubble}>
        {lastSpeed * METER_TO_KILOMETER_CONSTANT } Km/h,
      </Text>
      <Text style={styles.bubble}>
        {lastSpeed * METER_TO_KNOT_CONSTANT} Knots
      </Text>
    </View>

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
  speedContainer: {
    flexDirection: 'column',
    marginVertical: 20,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 18,
    paddingVertical: 2,
    borderRadius: 0,
    color: 'green',
    fontSize: 12,
  },
});

export default Map
