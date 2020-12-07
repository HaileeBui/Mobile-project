import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Marker } from "react-native-maps";

import userNeedRescue from '../../assets/needRescue.png'
import otherUserIcon from '../../assets/otheruser.png'

const OtherUsers = ({vessels}) => {

  const centerOfImage = {x:0.5,y:0.5}

  return (
    vessels && vessels.map( (vessel, index) => (
      <Marker
        //title={vessel.id}
        key={vessel.id}
        coordinate={{
          latitude: vessel.latitude,
          longitude: vessel.longitude,
        }}
        rotation={ vessel.heading }
        image={ vessel.hasMayDay ? userNeedRescue : otherUserIcon}
        anchor={centerOfImage}
    />
    ))

  )
}

const styles = StyleSheet.create({

});

export default OtherUsers

OtherUsers.propTypes = {

};

OtherUsers.defaultProps = {
  hasMayDay: false,

};
