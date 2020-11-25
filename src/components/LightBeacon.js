import React from 'react';
import { StyleSheet } from 'react-native';
import { Marker } from "react-native-maps";
import beaconLight from '../assets/beacon.png';

const LightBeacon = ({lightBeacons}) => {

  return (
    lightBeacons.map( (lightBeacon, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: lightBeacon.latitude,
            longitude: lightBeacon.longitude
          }}
          image={beaconLight}
        />
      ))
  );
};

const styles = StyleSheet.create({});

export default LightBeacon;

LightBeacon.propTypes = {};

LightBeacon.defaultProps = {};
