import React, { useState, useEffect } from 'react'
import { Button, Container, Text, Content, View, Icon } from 'native-base'
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import { Alert } from 'react-native';

const Sos = () => {
  const [location, setLocation] = useState({});
  const [error, setError] = useState(null);

  const callSOS = () => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${+358415033581}';
    } else {
      phoneNumber = 'telprompt:${+358415033581}';
    }

    Linking.openURL(phoneNumber);
  };

  const sendLocation = async (loc) => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    firebase.database().ref('/sos/' + firebase.auth().currentUser.uid).set({
      user: firebase.auth().currentUser.uid,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      created: Date().toLocaleString(),
      active: true,
      cancelTime: Date().toLocaleString(),
      rescued: false,
    });
    alert();
  }

  const alert = () => {
    Alert.alert(
      'Location sent',
      'Keep calm and wait for rescue',
      [
        { text: 'Cancel request', onPress: () => updateRescueData('cancel'), style: 'cancel' },
        { text: 'Rescued', onPress: () => updateRescueData('rescued') }
      ],
      { cancelable: false }
    );
  };

  const updateRescueData = (key) => {
    if (key == 'cancel') {
      firebase.database().ref('/sos/' + firebase.auth().currentUser.uid).update({
        active: false,
        cancelTime: Date().toLocaleString()
      })
    } else if (key == 'rescued') {
      firebase.database().ref('/sos/' + firebase.auth().currentUser.uid).update({
        active: false,
        rescued: true,
        cancelTime: Date().toLocaleString()
      })
    }
  }

  /*let text = 'Loading location'
  if (error) {
    text = error;
  } else if (location) {
    text = JSON.stringify(location);
  }
*/
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission was denied');
      }

      firebase.database().ref('/sos/' + firebase.auth().currentUser.uid)
        .on('value', (snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val())
            snapshot.val().active ? alert() : null
          }
        })
    })();
  }, []);


  return (
    <Container>
      <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ padding: 10, alignSelf: 'center' }}>
          <Button rounded
            style={{ marginBottom: 20, backgroundColor: '#ff6e40', flex: 1 }}
            onPress={() => callSOS()}
          >
            <Text style={{ fontSize: 30, color: '#1e3d59' }}>Emergency call</Text>
          </Button>

          <Button rounded
            style={{ backgroundColor: '#ff6e40', flex: 1 }}
            onPress={() => sendLocation(location)}
          >
            <Text style={{ fontSize: 30, color: '#1e3d59' }}>Send location</Text>
          </Button>
        </View>
      </Content>
    </Container>
  )
}

export default Sos
