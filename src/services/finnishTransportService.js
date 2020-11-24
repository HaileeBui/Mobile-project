import {DOMParser} from 'xmldom';

const lightBeaconURI = 'https://julkinen.vayla.fi/inspirepalvelu/avoin/wms?request=getmap&LAYERS=loistot&WIDTH=1400&HEIGHT=1400&FORMAT=application/vnd.google-earth.kml+xml&bbox=16.24929508576318,59,32.56325366255485,69.36901556703918&srs=CRS:84';
const lightBeaconURI2 = 'https://julkinen.vayla.fi/inspirepalvelu/avoin/wms?request=getmap&LAYERS=loistot&WIDTH=1400&HEIGHT=1400&FORMAT=application/vnd.google-earth.kml+xml&bbox=24.755115,60.107362,25.068056,60.204050&srs=CRS:84';
const navigationLinesURI = 'https://julkinen.vayla.fi/inspirepalvelu/avoin/wms?request=getmap&LAYERS=navigointilinjat&WIDTH=1400&HEIGHT=1400&FORMAT=application/vnd.google-earth.kml+xml&bbox=16.24929508576318,59,32.56325366255485,69.36901556703918&srs=CRS:84';
const navigationLinesURI2 = 'https://julkinen.vayla.fi/inspirepalvelu/avoin/wms?request=getmap&LAYERS=navigointilinjat&WIDTH=1400&HEIGHT=1400&FORMAT=application/vnd.google-earth.kml+xml&bbox=24.755115,60.107362,25.068056,60.204050&srs=CRS:84';

const fetchLightBeacons = async () => {

  return fetch(lightBeaconURI2).
    then(response => response.text()).
    then(string => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(string, 'text/xml');
      const numberOfPlaceMarks = xmlDoc.getElementsByTagName('Placemark');
      //console.log('Number of Placemarks', numberOfPlaceMarks);
      const lightCoordinates = [];
      for (let index = 0; index < 50; index++) {

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
    }).
    catch(error => {
      console.log(error.message);
    });

};

const fetchNavigationLines = async () => {

  return fetch( navigationLinesURI2 ).
    then(response => response.text()).
    then(string => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(string, 'text/xml');
      const numberOfMultiGeometry = xmlDoc.getElementsByTagName('MultiGeometry').length;
      console.log('Number of Multigeometry', numberOfMultiGeometry);

      const navigationLine = [];
      for (let index = 0; index < 50; index++) {

        let coordinateAsString = xmlDoc.getElementsByTagName(
          'MultiGeometry')[index].getElementsByTagName(
          'LineString')[0].getElementsByTagName(
          'coordinates')[0].childNodes[0].nodeValue.split(/[ ,]+/);

        let coordinates = [];
        let innerIndex = 0;
        while (innerIndex < coordinateAsString.length ) {
          coordinates.push({
            longitude:  +coordinateAsString[0],
            latitude: +coordinateAsString[1],
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

export const finnshTransportService = {
  fetchLightBeacons,
  fetchNavigationLines
};
