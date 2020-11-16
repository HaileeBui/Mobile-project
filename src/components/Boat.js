import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Marker } from "react-native-maps";

import userBoatImage from '../assets/boat.png'
import userNeedRescue from '../assets/needRescue.png'

//TODO fix boat png
const Boat = ({ latitude, longitude, heading, speed, isMayDay}) => {

  const centerOfImage = {x:0.5,y:0.5}
  const boatImage = isMayDay ? userNeedRescue : userBoatImage;

  return (
    <Marker
      //title={'User'}
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      rotation={ heading }
      image={boatImage}
      anchor={centerOfImage}
    />
  )
}

const styles = StyleSheet.create({

});

export default Boat

Boat.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  heading: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  isMayDay: PropTypes.bool,
};

Boat.defaultProps = {
  isMayDay: false
};
