import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Marker } from "react-native-maps";

import userBoatImage from '../../assets/user.png'

const User = ({ latitude, longitude, heading, speed, hasMayDay, isThisUser, title}) => {

  const centerOfImage = {x:0.5,y:0.5}

  return (
    <Marker
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      rotation={ heading }
      image={userBoatImage}
      anchor={centerOfImage}
    />
  )
}

const styles = StyleSheet.create({

});

export default User

User.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  heading: PropTypes.number.isRequired,
  speed: PropTypes.number,
  hasMayDay: PropTypes.bool,
  isInDanger: PropTypes.bool,
  isThisUser: PropTypes.bool,
};

User.defaultProps = {
  hasMayDay: false,
  isInDanger: false,
  isThisUser: false,
};
