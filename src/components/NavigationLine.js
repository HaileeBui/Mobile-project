import React from 'react';
import {StyleSheet} from 'react-native';
import {Polyline} from "react-native-maps";

const NavigationLine = ({navigationLines, isDarkMode}) => {
  return (
    navigationLines.map( (navigationLine, index) => (
      <Polyline
        key={index}
        coordinates={navigationLine.coordinates}
        strokeColor={isDarkMode ? '#ffc13b' :'#000'}
        strokeWidth={1}
      />
    ))
  )
};

const styles = StyleSheet.create({});

export default NavigationLine;

NavigationLine.prototypes = {};

NavigationLine.defaultProps = {};
