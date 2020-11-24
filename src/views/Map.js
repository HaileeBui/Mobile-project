import React, { useEffect, useState } from 'react'
import { Text, Container, Thumbnail, Body, Right, Left, Icon, Card, CardItem, View } from 'native-base'
import Constants from 'expo-constants';
import MapView, { Callout, Circle, PROVIDER_GOOGLE, } from 'react-native-maps';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';
import firebase from 'firebase';
import { DOMParser } from 'xmldom'
import Boat from '../components/Boat';
import { digiTrafficService, firebaseService } from '../services';
import { Distance } from '../utilities';

const apiURL = 'https://pfa.foreca.com';

const Map = () => {
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState({ current: {} });
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const METER_TO_KILOMETER_CONSTANT = 3.6;
  const METER_TO_KNOT_CONSTANT = 1.9438445;

  const [lastLatitude, setLastLatitude] = useState(60.161822);
  const [lastLongitude, setLastLongitude] = useState(24.917335);
  const [lastHeading, setLastHeading] = useState(0);
  const [lastSpeed, setLastSpeed] = useState(0);
  const [vessels, setVessels] = useState([]);
  const [isCollisionDetected, setIsCollisionDetected] = useState(false);
  const [alertRadius, setAlertRadius] = useState(0.900); // In Kilometers

  const loadVessels = () => {

    firebaseService.getAllVessels()
      .then(vessels => {
        setVessels(vessels);
        const proximityAlert = vessels.some(vessel => Distance.isDistanceLessThen(vessel, lastLatitude, lastLongitude, alertRadius));
        setIsCollisionDetected(proximityAlert);
      });
  }

  /*const getToken = () => {
    const data = { user: 'ngoc-bui', password: 'yySqoYelUSsKuPHoaP' }
    fetch(apiURL + '/authorize/token?user=' + data.user + '&password=' + data.password)
      .then(async response => {
        const result = await response.json();
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (result && result.message) || response.statusText;
          return Promise.reject(error);
        }
        setToken(result.access_token);
        console.log('result', result.access_token);
      })
      .catch(error => {
        console.error('fetching token error', error);
      });
  };*/

  /* const getLocation = () => {
     navigator.geolocation.getCurrentPosition(
       position => {
         let loc = JSON.stringify(position);
         console.log('location', position);
         setLocation(loc);
         console.log('location 38,', location);
       },
       error => Alert.alert(error.message),
       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
     );
   }*/

  const getWeather = async () => {
    //const data = { user: 'ngoc-bui', password: 'yySqoYelUSsKuPHoaP' }
    try {
      const tokenObject = await fetch(apiURL + '/authorize/token?user=' +
        Constants.manifest.extra.user + '&password=' +
        Constants.manifest.extra.password);
      const newToken = await tokenObject.json();
      navigator.geolocation.getCurrentPosition(
        position => {
          try {
            fetch(apiURL + '/api/v1/current/' + position.coords.longitude + ',' + position.coords.latitude + '?token=' + newToken.access_token)
              .then(response => response.json()
                .then(
                  result =>
                    setWeather(result),
                  error => console.log(error)
                ))
          } catch (e) {
            console.log('fetch weather error', e);
          }
        })
    } catch (error) {
      console.error('fetching token error', error);
    }
  }

  useEffect(() => {
    getWeather();
    loadVessels();

    let watchID = navigator.geolocation.watchPosition(

      //successCallback
      ({ coords }) => {

        setLastLatitude(coords.latitude);
        setLastLongitude(coords.longitude);
        setLastHeading(coords.heading);
        setLastSpeed(coords.speed);

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
  }, [])
  return (
    <Container>
      {Object.keys(weather.current).length > 0 &&
        <Card>
          <CardItem style={{ backgroundColor: '#f5f0e1' }}>
            <Left>
              <Icon name='md-thermometer' />
              <Body>
                <Left></Left>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Temperature: {weather.current.temperature}°C</Text>
                <Text>Feels like: {weather.current.feelsLikeTemp}°C</Text>
              </Body>
            </Left>
            <Body>
              <Left>
                <Icon name='md-information-circle-outline' />
              </Left>
              <Right>
                <Text style={{ fontSize: 18 }}>{weather.current.symbolPhrase}</Text>
              </Right>
            </Body>
          </CardItem>
          <CardItem style={{ backgroundColor: '#f5f0e1' }}>
            <Left>
              <Left />
              <Body>
                <Icon name='md-water' />
                <Text>{weather.current.relHumidity}%</Text>
              </Body>
            </Left>
            <Body>
              <Body>
                <Icon name='md-speedometer' />
                <Text>{weather.current.windSpeed} m/s, {weather.current.windDirString}</Text>

              </Body>
            </Body>
            <Right>
              <Body>
                <Icon name='md-eye' style={{ color: 'black' }} />
                <Text>{weather.current.visibility}</Text>

              </Body>
              <Right />
            </Right>
          </CardItem>
        </Card>
      }
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: lastLatitude,
            longitude: lastLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          showsUserLocation={true}
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
        </MapView>
      </View>
        <View style={{
          width: '100%',
          height: 30,
          flexDirection:'row',
          backgroundColor: '#1e3d59',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0
        }}>
          <Text style={{color:'#ffc13b'}}>{(lastSpeed * METER_TO_KILOMETER_CONSTANT).toFixed(3)} Km/h - </Text>
          <Text style={{color:'#ffc13b'}}>{(lastSpeed * METER_TO_KNOT_CONSTANT).toFixed(3)} Knots</Text>
        </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f0e1'
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
