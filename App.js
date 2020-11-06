import React, {useState, useEffect} from 'react';
import * as Expo from "expo";
import * as Font from 'expo-font';
import Navigators from './src/navigators/Navigators';
import Login from './src/views/Login'
import firebase from 'firebase'
import { Container } from 'native-base';
const App = () => {
  const [fontReady, setFontReady] = useState(false);
  /*const [isLoaded,setIsLoaded] = useState(true);
  const [isAuthenticationReady,setIsAuthenticationReady ] = useState(false);*/
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const checkLogIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    })
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    setFontReady(true);
  };
  useEffect(() => {
    loadFonts();
    checkLogIn();
  }, []);

  if (!fontReady) {
    return (
      <Expo.AppLoading />
    );
  }


  return (
   <Container>
     {isAuthenticated ? (<Navigators />) : (<Login />)}
     </Container>
     );
}

export default App;
