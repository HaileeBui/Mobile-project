import React, {useEffect, useState} from 'react';
import MapView, {Callout, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';
import firebase from 'firebase';

import Boat from '../components/Boat';
import {digiTrafficService, firebaseService} from '../services';
import {Distance} from '../utilities';


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
  const [ isCollisionDetected, setIsCollisionDetected ] = useState(false);
  const [ alertRadius , setAlertRadius ] = useState(70); // In meters

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
        console.log("VESSELS ", vessels );

        console.log('UPDATE SNAPSHOT' + JSON.stringify(snapshot.val()));
        const updateUser = {
          id: snapshot.key,
          latitude: snapshot.val().latitude,
          longitude: snapshot.val().longitude,
        };
        console.log("UPDATE_USER ", updateUser );
        const updateUsers = vessels.map( vessel => {
          //Check distance b/w user boat and other boat,
          //If distance is less then 700 meters,
          //Set isCollisionDetected to true
          setIsCollisionDetected(
            Distance.isDistanceLessThen(vessel, lastLatitude, lastLongitude, alertRadius)
          );
          console.log('VESSEL_ID', vessel.id);
          if ( vessel.id === snapshot.key ){
            return updateUser;
          }
          return vessel;

        });
        console.log("UPDATE_USERs ", updateUsers );
        console.log('isCollisionDetected', isCollisionDetected);

        setVessels(updateUsers);
      });

    //TODO child_add, child_removed

    //Fetch vessels from digiTraffic
    digiTrafficService.fetchLatest()
    .then( otherVessels => {
      console.log("DIGI_TRAFFIC_VESSELS_FIRST", otherVessels.features[0]);
      console.log("DIGI_TRAFFIC_VESSELS_LENGTH", otherVessels.features.length);
    } );

    return () => {

      firebaseService.detachAllFirebaseCallbacks();
      navigator.geolocation.clearWatch(watchID);

    };
  },[]);

  // TODO collision alert
  // TODO BOAT image resize
  // TODO make alert circle a separate component
  // TODO plot digiTraffic vessels
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
      //followUserLocation={true}
    >
      { isCollisionDetected && <Circle
        center={{
          latitude: (lastLatitude ) || 60.161822,
          longitude: (lastLongitude ) || 24.917335,
        }}
        //enter={alertZone.center}
        radius={alertRadius}
        fillColor={'rgba(255, 0, 0, 0.2)'}
        strokeColor="rgba(0,0,0,0.5)"
        zIndex={2}
        strokeWidth={2}
      /> }

      <Boat
        key={0}
        latitude={ lastLatitude }
        longitude={ lastLongitude }
        heading={ lastHeading }
        speed={ lastSpeed }
        //isMayDay={false}
        isInDanger={ isCollisionDetected }
        isThisUser={true}
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
