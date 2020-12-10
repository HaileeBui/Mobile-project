import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Marker } from "react-native-maps";
import digiTrafficVesselIcon from './../../assets/digiVessel.png'

const DigiTrafficVessels = ({digiTrafficVessels}) => {

  const centerOfImage = {x:0.5,y:0.5}

  return (
    digiTrafficVessels && digiTrafficVessels.map ( ( digiTrafficVessel, index )  => (
    <Marker
      //title={digiTrafficVessel.mmsi}
      key={index}
      coordinate={{
        latitude: digiTrafficVessel.latitude,
        longitude: digiTrafficVessel.longitude,
      }}
      rotation={ digiTrafficVessel.heading }
      //image={digiTrafficVesselIcon}
      anchor={centerOfImage}
    />
    ))
  );
}

const styles = StyleSheet.create({

});

export default DigiTrafficVessels

DigiTrafficVessels.propTypes = {

};

DigiTrafficVessels.defaultProps = {
};
