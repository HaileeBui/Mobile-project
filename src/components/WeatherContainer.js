import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Body, Card, CardItem, Icon, Left, Right, Text} from 'native-base';

const WeatherContainer = ({weather}) => {

  return (
    Object.keys(weather.current).length > 0 &&
    <Card>
      <CardItem style={{backgroundColor: '#f5f0e1'}}>
        <Left>
          <Icon name='md-thermometer'/>
          <Body>
            <Left/>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}>Temperature: {weather.current.temperature}°C</Text>
            <Text>Feels like: {weather.current.feelsLikeTemp}°C</Text>
          </Body>
        </Left>
        <Body>
          <Left>
            <Icon name='md-information-circle-outline'/>
          </Left>
          <Right>
            <Text style={{fontSize: 18}}>{weather.current.symbolPhrase}</Text>
          </Right>
        </Body>
      </CardItem>
      <CardItem style={{backgroundColor: '#f5f0e1'}}>
        <Left>
          <Left/>
          <Body>
            <Icon name='md-water'/>
            <Text>{weather.current.relHumidity}%</Text>
          </Body>
        </Left>
        <Body>
          <Body>
            <Icon name='md-speedometer'/>
            <Text>{weather.current.windSpeed} m/s, {weather.current.windDirString}</Text>

          </Body>
        </Body>
        <Right>
          <Body>
            <Icon name='md-eye' style={{color: 'black'}}/>
            <Text>{weather.current.visibility}</Text>

          </Body>
          <Right/>
        </Right>
      </CardItem>
    </Card>

  );
};

const styles = StyleSheet.create({});

export default WeatherContainer;

WeatherContainer.propTypes = {};

WeatherContainer.defaultProps = {};
