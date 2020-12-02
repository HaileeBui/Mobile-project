import React, {useEffect, useState, useLayoutEffect } from 'react';
import MapView, { Circle, PROVIDER_GOOGLE, } from 'react-native-maps';
import Constants from 'expo-constants';
import { Text, Container, View, Icon } from 'native-base';
import firebase from 'firebase';
import { StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { Boat, WeatherContainer, LightBeacon, NavigationLine, NauticalWarning } from '../components';
import { digiTrafficService, firebaseService } from '../services';
import { Distance } from '../utilities';
import { mapStyles } from '../styles';
import { finnshTransportService } from '../services/finnishTransportService';
const apiURL = 'https://pfa.foreca.com';

const Map = ({ navigation }) => {

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.019;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const METER_TO_KILOMETER_CONSTANT = 3.6;
  const METER_TO_KNOT_CONSTANT = 1.9438445;

  const [weather, setWeather] = useState({ current: {} });
  const [lastLatitude, setLastLatitude] = useState(60.161822);
  const [lastLongitude, setLastLongitude] = useState(24.917335);
  const [lastHeading, setLastHeading] = useState(0);
  const [lastSpeed, setLastSpeed] = useState(0);
  const [vessels, setVessels] = useState([]);
  const [isCollisionDetected, setIsCollisionDetected] = useState(false);
  const [alertRadius, setAlertRadius] = useState(0.900); // In Kilometers
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [lightBeacons, setLightBeacons] = useState([])
  const [navigationLines, setNavigationLines] = useState([]);
  const [digiTrafficWarnings, setDigiTraficWarnings] = useState([]);
  const [vesselsInProximity, setVesselsInProximity] = useState([]);

  firebaseService.detachAllFirebaseCallbacks();

  //child_changed
  firebase.database().ref('/vessels').on('child_changed', snapshot => {
    if (!(snapshot.val().userId === firebase.auth().currentUser.uid)) {

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

      setVessels(updateVessels);

      const proximityAlert = Distance.isDistanceLessThen(updateVessel,
        lastLatitude, lastLongitude, alertRadius);

      setIsCollisionDetected(proximityAlert);
    }
  });

/*  firebaseService.subscribeToVessels(vessels)
  .then(newVessels => {
    console.log('newVessels', newVessels);
    setVessels(newVessels);
  });*/


  const loadVessels =  async () => {
    await firebaseService.getAllVessels().then(vesselsFromFirebase => {
      console.log('loadVessels Vessels', vesselsFromFirebase)
      setVessels(vesselsFromFirebase);

      const vesselsInProximity = vesselsFromFirebase.filter(vessel => Distance.isDistanceLessThen(vessel, lastLatitude,
        lastLongitude, alertRadius) );

      setVesselsInProximity(vesselsInProximity);
      /*const proximityAlert = vesselsFromFirebase.some(
        vessel => Distance.isDistanceLessThen(vessel, lastLatitude,
          lastLongitude, alertRadius));*/
      //    []
      if ( vesselsInProximity.length > 0 ){
        console.log('Hello', vesselsInProximity.length );
        setIsCollisionDetected(true);
      }

    });
  };

  const toggleSwitch = () => setIsDarkModeEnabled(
    previousState => !previousState);

  const getWeather = async () => {
    try {
      const tokenObject = await fetch(apiURL + '/authorize/token?user=' +
        Constants.manifest.extra.user + '&password=' +
        Constants.manifest.extra.password);
      const newToken = await tokenObject.json();
      navigator.geolocation.getCurrentPosition(
        position => {
          try {
            fetch(
              apiURL + '/api/v1/current/' + position.coords.longitude + ',' +
              position.coords.latitude + '?token=' + newToken.access_token).
              then(response => response.json().then(
                result =>
                  setWeather(result),
                error => console.log(error),
              ));
          } catch (e) {
            console.log('fetch weather error', e);
          }
        });
    } catch (error) {
      console.error('fetching token error', error);
    }
  };

  const updateNavigationLines =  async (latestLatitude, latestLongitude) => {
    finnshTransportService.updateNavigationLines(latestLongitude,latestLatitude)
      .then( navigationLines => {
        if ( navigationLines ){
          setNavigationLines(navigationLines);
        }
    })
  }

  const updateLightBeacons =  async (latestLatitude, latestLongitude) => {
    finnshTransportService.updateLightBeacons(latestLongitude,latestLatitude)
    .then( lightBeacons => {
      if ( lightBeacons ){
        setLightBeacons(lightBeacons);
      }
    })
  }

  const fetchDigiTrafficWarnings = async () => {
    digiTrafficService.fetchNauticalWarnings()
    .then( digiTrafficWarnings => {
      console.log('fetchDigiTrafficWarnings', digiTrafficWarnings)
      if ( digiTrafficWarnings.length > 0 ) {
        setDigiTraficWarnings(digiTrafficWarnings);
      }
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor='#ffc13b'
          style={{ margin: 10, padding: 5}}
          onPress={() => { toggleSwitch() }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ marginRight: 5, marginTop: 2, fontSize: 20 }}>Mode</Text>
            <Icon name='md-contrast' />
          </View>
        </TouchableHighlight>
      )
    });
  }, [navigation], toggleSwitch);

  const subscribeToLocationChange = () => {

    return navigator.geolocation.watchPosition(
      //successCallback
      ({ coords }) => {
        setLastLatitude(coords.latitude);
        setLastLongitude(coords.longitude);
        setLastHeading(coords.heading);
        setLastSpeed(coords.speed);

        firebaseService.updateVessel(coords.latitude, coords.longitude,
          coords.heading, coords.speed);

        updateNavigationLines(coords.latitude, coords.longitude);
        updateLightBeacons(coords.latitude, coords.longitude);
      },
      //errorCallBack
      (error) => {
        console.log('Error: ' + error.message);
      },
      //options:
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        distanceFilter: 1,
      },
    );
  };

  useEffect(() => {
    //fetch weather API every 3sec
    /*setInterval(() => {
      getWeather();
      //console.log('weather updated');
    }, 30000);
    */
    getWeather();

    //fetchDigiTrafficWarnings();

    loadVessels();

    let watchId = subscribeToLocationChange();

    return () => {

      firebaseService.detachAllFirebaseCallbacks();
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  //   <WeatherContainer weather={weather} />

  return (
    <Container>
      <WeatherContainer weather={weather} />

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: lastLatitude,
            longitude: lastLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          showsUserLocation={true}
          customMapStyle={(isDarkModeEnabled ? mapStyles.darkMode : [])}
        >
          <Boat
            key={0}
            latitude={lastLatitude}
            longitude={lastLongitude}
            heading={lastHeading}
            //speed={ lastSpeed }
            hasMayDay={false}
            isInDanger={isCollisionDetected}
            isThisUser={true}
          />

          {vessels.map((vessel, index) => (
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

          <LightBeacon
            lightBeacons={lightBeacons}
          />

          <NavigationLine
            navigationLines={navigationLines}
            isDarkMode={isDarkModeEnabled}
          />

          <NauticalWarning
            nauticalWarnings={digiTrafficWarnings}
          />

{/*          {isCollisionDetected && <Circle
            center={{
              latitude: lastLatitude,
              longitude: lastLongitude,
            }}
            //enter={alertZone.center}
            radius={alertRadius * 1000}
            fillColor={'rgba(255, 0, 0, 0.2)'}
            strokeColor="rgba(0,0,0,0.5)"
          />}*/}

        </MapView>
        <View style={styles.speedContainer}>
          <Text style={styles.bubble}>
            {(lastSpeed * METER_TO_KILOMETER_CONSTANT).toFixed(3)} Km/h
          </Text>
          <Text style={styles.bubble}>
            {(lastSpeed * METER_TO_KNOT_CONSTANT).toFixed(3)} Knots
          </Text>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f0e1',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  speedContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    backgroundColor: 'transparent',
  },
  switchContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    backgroundColor: 'transparent',
  },
  bubble: {
    backgroundColor: '#ffc13b',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    color: '#1e3d59',
    fontSize: 20, fontWeight: 'bold',
  },
});

export default Map;
