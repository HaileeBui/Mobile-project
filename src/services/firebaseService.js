import firebase from 'firebase';
import { LogBox } from 'react-native';

const listenToUserValuesChange = () => {

  firebase
  .database()
  .ref('/users')
  .on('value', snapshot => {
    console.log('A change has been observed', snapshot.val());
  }, error => {
    console.log('ERROR ' + JSON.stringify(error));
  });
}

const getAllUsers = async () => {

  let users = [];
  await firebase
  .database()
  .ref('/users')
  .once('value')
    .then( ( snapshot ) => {
    //console.log('Initial user data', snapshot.val());
    //console.log('ALL_USERS ', JSON.stringify(snapshot));
    let entries = [];
      snapshot.forEach ( user => {
        console.log('Initial user data key ', user.key);
        console.log('Initial user data', user.val());

        //console.log('longitude ' + user.val().longitude);
        //console.log('latitude ' + user.val().latitude);
        entries.push( {
          id: user.key,
          latitude  :  user.val().latitude ,
          longitude : user.val().longitude ,
        });
      })
    users = entries;
    //console.log(users[0].longitude)

  })
  return users;
}

const listenToChangesInRegion = async() => {
  firebase
    .database()
    .ref('/users')
    .orderByChild('latitude')
    .startAt(60.1581)
    .endAt(60.1590)
    .on('child_changed', snapshot => {
      console.log('A Location change has been observed', snapshot.val());
  })
}// startLatitude, endLatitude, startLongitude, endLongitude
const listenToLocationChange = async () => {
  let updatedLocation = []
  const users = await firebase.database().
    ref('/users').
    orderByChild('latitude').
    startAt(60.1581).
    endAt(60.1590).
    on('child_changed', snapshot => {
      console.log('A Location change has been observed', snapshot.val());
      let data = [];
      data.push(snapshot.val());
      //console.log('UPDATE ' + JSON.stringify(data[0]));
      updatedLocation = data;
      //console.log('UPDATE AFTER ' + updatedLocation.length);
      console.log('UPDATE AFTER ' + JSON.stringify(updatedLocation[0]));
      return updatedLocation;

    });
  console.log('BEFORE RETURN ' + JSON.stringify(updatedLocation[0]));
  console.log('BEFORE RETURN users' , users);
  //return updatedLocation
  return users
}

const detachAllFirebaseCallbacks = () =>{
  console.log("Detaching all firebase call backs")
  firebase.database()
    .ref('/users')
    .off()
}

export const firebaseService = {
  getAllUsers,
  listenToUserValuesChange,
  listenToLocationChange,
  listenToChangesInRegion,
  detachAllFirebaseCallbacks,
}



//import _ from 'lodash';

LogBox.ignoreLogs (['Setting a timer']);
const _console = { ...console };
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
