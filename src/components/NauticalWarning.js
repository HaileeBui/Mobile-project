import React from 'react';
import { StyleSheet,View, Text, } from 'react-native';
import {Callout, Marker} from 'react-native-maps';

import nauticalWarningIcon from '../../assets/nauticalWarning.png'

const NauticalWarning = ({nauticalWarnings}) => {

  const centerOfImage = {x:0.5,y:0.5}

  return (
    nauticalWarnings.map( (nauticalWarning, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: nauticalWarning.latitude,
          longitude: nauticalWarning.longitude
        }}
        //image={nauticalWarningIcon}
        anchor={centerOfImage}
      >
        <Callout style={styles.plainView}>
          <View>
            <Text>English: {nauticalWarning.descriptionEN}</Text>
          </View>
        </Callout>
      </Marker>
    ))
  )
}

const styles = StyleSheet.create({
  plainView: {
    width: 60,
  },
});

export default NauticalWarning;

NauticalWarning.propTypes = {};

NauticalWarning.defaultProps = {};
