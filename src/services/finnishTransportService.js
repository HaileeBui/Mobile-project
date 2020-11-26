import {DOMParser} from 'xmldom';

let bottomLeftLongitude = 24.755115;
let bottomLeftLatitude = 60.107362;
let topRightLongitude = 25.068056;
let topRightLatitude = 60.204050;

const LATITUDE_DELTA_FOR_LINES_AND_BEACONS = 0.06
const LONGITUDE_DELTA_FOR_LINES_AND_BEACONS = 0.16

const fetchLightBeacons = async () => {

  return fetch('https://julkinen.vayla.fi/inspirepalvelu/avoin/wms?request=getmap&LAYERS=loistot&WIDTH=1400&HEIGHT=1400&FORMAT=application/vnd.google-earth.kml+xml&bbox='+bottomLeftLongitude+','+bottomLeftLatitude+','+topRightLongitude+','+topRightLatitude+'&srs=CRS:84').
    then(response => response.text()).
    then(string => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(string, 'text/xml');
      const numberOfPlaceMarks = xmlDoc.getElementsByTagName('Placemark').length;
      const lightCoordinates = [];
      for (let index = 0; index < numberOfPlaceMarks; index++) {

        let coordinateAsString = xmlDoc.getElementsByTagName(
          'Placemark')[index].getElementsByTagName(
          'Point')[0].getElementsByTagName(
          'coordinates')[0].childNodes[0].nodeValue.split(',');

        let coordinates = {
          longitude:  +coordinateAsString[0],
          latitude: +coordinateAsString[1],
        };

        lightCoordinates.push(coordinates);
      }
      return lightCoordinates;
    })
    .catch(error => {
      console.log(error.message);
    });
};

const fetchNavigationLines = async () => {

  return fetch( 'https://julkinen.vayla.fi/inspirepalvelu/avoin/wms?request=getmap&LAYERS=navigointilinjat&WIDTH=1400&HEIGHT=1400&FORMAT=application/vnd.google-earth.kml+xml&bbox='+bottomLeftLongitude+','+bottomLeftLatitude+','+topRightLongitude+','+topRightLatitude+'&srs=CRS:84' )
  .then(response => response.text())
  .then(string => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(string, 'text/xml');
      const numberOfMultiGeometry = xmlDoc.getElementsByTagName('MultiGeometry').length;

      const navigationLine = [];
      for (let index = 0; index < numberOfMultiGeometry; index++) {

        let coordinateAsString = xmlDoc.getElementsByTagName(
          'MultiGeometry')[index].getElementsByTagName(
          'LineString')[0].getElementsByTagName(
          'coordinates')[0].childNodes[0].nodeValue.split(/[ ,]+/);

        let coordinates = [];
        let innerIndex = 0;
        while (innerIndex < coordinateAsString.length ) {
          coordinates.push({
            longitude:  +coordinateAsString[innerIndex],
            latitude: +coordinateAsString[innerIndex+1],
          });
          innerIndex += 2
        }
        navigationLine.push({
          coordinates: coordinates
        });
      }
      return navigationLine;
    }).
    catch(error => {
      console.log(error.message); //undefined is not a constructor (evaluating 'new window.DOMParser()')
    });
};

const updateLightBeacons = async (userLongitude, userLatitude) => {

  setURI(userLongitude, userLatitude);
  return fetchLightBeacons();
}

const updateNavigationLines = async (userLongitude, userLatitude) => {

  setURI(userLongitude, userLatitude);
  return fetchNavigationLines();
}

const setURI = (userLongitude, userLatitude) => {

  if (
    (userLatitude  >= topRightLatitude - (LATITUDE_DELTA_FOR_LINES_AND_BEACONS / 2 )) ||
    (userLongitude >= topRightLongitude - (LONGITUDE_DELTA_FOR_LINES_AND_BEACONS / 2 )) ||
    (userLatitude  <= bottomLeftLatitude - (LATITUDE_DELTA_FOR_LINES_AND_BEACONS / 2 )) ||
    (userLatitude  <= bottomLeftLongitude - (LONGITUDE_DELTA_FOR_LINES_AND_BEACONS / 2 ))
  ) {

    //const lowerLeftPoint = ''+(userLongitude - LONGITUDE_DELTA_FOR_LINES_AND_BEACONS)+','+(userLatitude - LATITUDE_DELTA_FOR_LINES_AND_BEACONS)+'';
    //const upperRightPoint = ''+(userLongitude + LONGITUDE_DELTA_FOR_LINES_AND_BEACONS)+','+(userLatitude + LATITUDE_DELTA_FOR_LINES_AND_BEACONS)+'';
    //const bBoxCoordinates = ''+lowerLeftPoint+','+upperRightPoint+''

    bottomLeftLongitude = userLongitude - LONGITUDE_DELTA_FOR_LINES_AND_BEACONS;
    bottomLeftLatitude = userLatitude - LATITUDE_DELTA_FOR_LINES_AND_BEACONS;
    topRightLongitude = userLongitude + LONGITUDE_DELTA_FOR_LINES_AND_BEACONS;
    topRightLatitude = userLatitude + LATITUDE_DELTA_FOR_LINES_AND_BEACONS;

  }
}

export const finnshTransportService = {
  updateLightBeacons,
  updateNavigationLines
};
