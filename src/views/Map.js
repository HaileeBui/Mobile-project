import React, { useEffect, useState } from 'react'
import { Text, Container, Thumbnail, Body, Right, Left, Icon, Card, CardItem } from 'native-base'
import Constants from 'expo-constants';

const apiURL = 'https://pfa.foreca.com';

const Map = () => {
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState({ current: {} });

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
    //getLocation();
    //getToken()
    getWeather();
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
    </Container>
  )
}

export default Map
