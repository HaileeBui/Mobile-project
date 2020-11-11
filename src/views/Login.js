import React, { useEffect } from 'react';
import { Container, Content, Button, Text, View } from 'native-base';
import * as firebase from 'firebase';
import apiKeys from '../firebase/config';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
if (!firebase.apps.length) {
  firebase.initializeApp(apiKeys.firebaseConfig);
}

const Login = () => {

  const onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken);
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            console.log('user signin')
            if (result.additionalUserInfo.isNewUser) {
              firebase.database().ref('/users/' + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  created: Date.now()
                })
                .then((snapshot) => {

                });
            } else {
              firebase.database().ref('/users/' + result.user.uid).update({
                last_logged_in: Date.now()
              })
            }
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const loginWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '745534255877-2g2aq8r8okhmgtl2ur1gtbnhifi8s2i2.apps.googleusercontent.com',
        iosClientId: '745534255877-45ocmpoteegl2cbts697k71kuhddo4lb.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  const loginWithFb = async () => {
    await Facebook.initializeAsync({ appId: '885252565340527' });

    const { type, token } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile'] })

    switch (type) {
      case 'success': {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase.auth().signInWithCredential(credential);  // Sign in with Facebook credential

        // Do something with Facebook profile data
        // OR you have subscribed to auth state change, authStateChange handler will process the profile data
        return Promise.resolve({ type: 'success' });
      }
      case 'cancel': {
        return Promise.reject({ type: 'cancel' });
      }
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user => {
      if (user != null) {
        console.log(user)
      }
    }))
  }, []);
  return (
    <Container>
      <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ padding: 10, alignSelf: 'center' }}>

          <Button rounded
            style={{ marginBottom: 20, backgroundColor: '#ff6e40', flex: 1 }}
            onPress={() => loginWithFb()}
          >
            <Text style={{ fontSize: 30, color: '#1e3d59' }}>Login with Facebook</Text>
          </Button>
          <Button rounded
            style={{ backgroundColor: '#ff6e40', flex: 1 }}
            onPress={() => loginWithGoogle()}
          >
            <Text style={{ fontSize: 30, color: '#1e3d59' }}>Login with Google</Text>
          </Button>
        </View>
      </Content>
    </Container>
  )
}

export default Login
