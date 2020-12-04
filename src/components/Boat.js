import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Marker } from "react-native-maps";

import userBoatImage from '../../assets/user.png'
import userNeedRescue from '../../assets/needRescue.png'
import otherUserIcon from '../../assets/otheruser.png'

//TODO fix boat png
const Boat = ({ latitude, longitude, heading, speed, hasMayDay: hasMayDay, isThisUser, title}) => {

  const centerOfImage = {x:0.5,y:0.5}
  const boatImage = hasMayDay ? userNeedRescue : (isThisUser ? userBoatImage : otherUserIcon);

  return (
    <Marker
      //title={title}
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
  speed: PropTypes.number,
  hasMayDay: PropTypes.bool,
  isInDanger: PropTypes.bool,
  isThisUser: PropTypes.bool,
};

Boat.defaultProps = {
  hasMayDay: false,
  isInDanger: false,
  isThisUser: false,
};
