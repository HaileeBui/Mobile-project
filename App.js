import React, {useState, useEffect} from 'react';
import * as Expo from "expo";
import * as Font from 'expo-font';
import Navigators from './src/navigators/Navigators';
import Home from './src/views/Home'

const App = () => {
  const [fontReady, setFontReady] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    setFontReady(true);
  };
  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontReady) {
    return (
      <Expo.AppLoading />
    );
  }
  return (
    <Navigators></Navigators>
  );
}

export default App;
