import React from 'react'
import Map from '../views/Map';
import Sos from '../views/Sos';
import Home from '../views/Home';
import Login from '../views/Login';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const Navigators = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#ffc13b',
            },
            headerTintColor: '#1e3d59',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#ffc13b',
            },
            headerTintColor: '#1e3d59',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Sos"
          component={Sos}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#ffc13b',
            },
            headerTintColor: '#1e3d59',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#ffc13b',
            },
            headerTintColor: '#1e3d59',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigators;


