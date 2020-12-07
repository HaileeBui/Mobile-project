import React from 'react';
import { StyleSheet } from 'react-native';
import { Marker } from "react-native-maps";
import beaconLight from '../../assets/beacon.png';

const LightBeacon = ({lightBeacons}) => {

  const centerOfImage = {x:0.5,y:0.5}

  return (
    lightBeacons && lightBeacons.map( (lightBeacon, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: lightBeacon.latitude,
            longitude: lightBeacon.longitude
          }}
          //image={beaconLight}
          anchor={centerOfImage}
        />
      ))
  );
};

const styles = StyleSheet.create({});

export default LightBeacon;

LightBeacon.propTypes = {};

LightBeacon.defaultProps = {};
