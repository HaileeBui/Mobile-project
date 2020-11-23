import firebase from 'firebase';
import { LogBox } from 'react-native';

const getAllVessels = async () => {

  let vessels = [];
  await firebase
  .database()
  .ref('/vessels')
  .once('value')
    .then( ( snapshot ) => {

    let entries = [];
      snapshot.forEach ( vessel => {

        if ( !(vessel.val().userId === firebase.auth().currentUser.uid) ) {
          entries.push( {
            id: vessel.key,
            latitude  :  vessel.val().latitude ,
            longitude : vessel.val().longitude ,
            heading: vessel.val().heading,
            speed: vessel.val().speed,
            hasMayDay: vessel.val().hasMayDay,
          });
        }
      })

    vessels = entries;
  })

  return vessels;
}

// takes lat and long,
// order and filter
const listenToChangesInRegion = async() => {
  firebase
    .database()
    .ref('/vessels')
    .orderByChild('latitude')
    .startAt(60.1581)
    .endAt(60.1590)
    .on('child_changed', snapshot => {
      console.log('A Location change has been observed', snapshot.val());
  })
}

const detachAllFirebaseCallbacks = () => {
  firebase.database()
    .ref('/vessels')
    .off()
}

const updateVessel = (latitude, longitude, heading, speed) => {
  //let newVesselKey = firebase.database().ref('vessels').child(firebase.auth().currentUser.uid).push().key;
  firebase.database().ref('/vessels/' + firebase.auth().currentUser.uid).update({
    userId: firebase.auth().currentUser.uid,
    latitude: latitude,
    longitude: longitude,
    heading: heading,
    speed: speed,
  }).then(r => {
    console.log('Vessel location uploaded');
  })
}

export const firebaseService = {
  getAllVessels,
  listenToChangesInRegion,
  detachAllFirebaseCallbacks,
  updateVessel,
}

LogBox.ignoreLogs (['Setting a timer']);
const _console = { ...console };
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
