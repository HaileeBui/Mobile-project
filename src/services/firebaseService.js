import firebase from 'firebase';
import { LogBox } from 'react-native';

const getAllVessels = async () => {

  let vessels = [];
  await firebase
  .database()
  .ref('/vessels')
  .once('value')
    .then( ( snapshot ) => {
    //console.log('snapshot getAllVessels', snapshot);
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

const subscribeToVessels = async (vessels) => {

  let newVessels = [];
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

      newVessels = updateVessels;
    }
  });

  return newVessels;
}

const detachAllFirebaseCallbacksForVessels = () => {
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
    //console.log('Vessel location uploaded');
  })
}

export const firebaseService = {
  getAllVessels,
  detachAllFirebaseCallbacksForVessels,
  updateVessel,
  subscribeToVessels,
}

LogBox.ignoreLogs (['Setting a timer']);
const _console = { ...console };
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
