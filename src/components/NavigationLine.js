import React from 'react';
import {StyleSheet} from 'react-native';
import {Polyline} from "react-native-maps";

const NavigationLine = ({navigationLines}) => {
  return (
    navigationLines.map( (navigationLine, index) => (
      <Polyline
        key={index}
        coordinates={navigationLine.coordinates}
        strokeColor='#FFF'
        strokeWidth={50}
      />
    ))
  )
};

const styles = StyleSheet.create({});

export default NavigationLine;

NavigationLine.prototypes = {};

NavigationLine.defaultProps = {};
