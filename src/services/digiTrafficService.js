// Almost 76 kilometer visibility
const LATITUDE_DELTA_FOR_VESSELS = 0.24
const LONGITUDE_DELTA_FOR_VESSELS = 0.64

let isVesselRequest = true;
let bottomLeftLongitude = 24.277335;
let bottomLeftLatitude = 59.921822;
let topRightLongitude = 25.557335;
let topRightLatitude = 60.401822;

let userLatitude = 60.161822;
let userLongitude = 24.917335;


const fetchVesselsFromLastTwoHours = () => {

  const date = new Date();
  const timestampNow = Date.now();
  const timestampTwoHoursBefore = date.setHours(date.getHours() - 2)

  return fetch('https://meri.digitraffic.fi/api/v1/locations/latest?from='+timestampTwoHoursBefore+'&to='+timestampNow+'')
  .then(res => res.json())
  .then( response => handleVesselResponse(response))
  .catch( ({message}) => console.log(message))
}

const fetchNauticalWarnings = async () => {
  return fetch('https://meri.digitraffic.fi/api/v1/nautical-warnings/published')
  .then(res => res.json())
    .then( response => {

      const responseLength = response.features.length;

      const nauticalWarnings = [];

      if (responseLength >= 0 ) {
        let index = 0;
        while (index < responseLength) {
          nauticalWarnings.push({
            longitude: +response.features[index].geometry.coordinates[0],
            latitude: +response.features[index].geometry.coordinates[1],
            descriptionFI: response.features[index].properties.contentsFi,
            descriptionEN: response.features[index].properties.contentsEn,
          })
          index++
        }
      }

      return nauticalWarnings;
    })
    .catch( ({message}) => console.log(message))
}

const fetchSurroundingVessels = async (radiusInKiloMeter, longitude, latitude) => {

  setURI(longitude, latitude);
  if(isVesselRequest){
    //https://meri.digitraffic.fi/api/v1/locations/latitude/'+latitude+'/longitude/'+longitude+'/radius/30/from/2020-11-26T20:47:45.488Z
    const localDateTimeISO = dateInISOLocal();
    console.log('https://meri.digitraffic.fi/api/v1/locations/latitude/'+userLatitude+'/longitude/'+userLongitude+'/radius/'+radiusInKiloMeter+'/from/'+localDateTimeISO+'');
    return fetch('https://meri.digitraffic.fi/api/v1/locations/latitude/'+userLatitude+'/longitude/'+userLongitude+'/radius/'+radiusInKiloMeter+'/from/'+localDateTimeISO+'')
    .then(res => res.json())
    .then( response => {
      isVesselRequest = false;
      handleVesselResponse(response);
    })
    .catch( ({message}) => console.log(message))
  } else {
    return [];
  }

}

const handleVesselResponse = (response) => {

  const responseLength = response.features.length;
  const digiTrafficVessels = [];

  if (responseLength >= 0 ) {
    let index = 0;
    while (index < responseLength) {
      digiTrafficVessels.push({
        longitude: +response.features[index].geometry.coordinates[0],
        latitude: +response.features[index].geometry.coordinates[1],
        mmsi: response.features[index].properties.mmsi,
        heading: response.features[index].properties.heading,
      })
      index++
    }
  }

  return digiTrafficVessels;

}

const dateInISOLocal = () => {
  const date = new Date();
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal =  date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const isoLocal = dateLocal.toISOString();
  return isoLocal;
}

const setURI = (longitude, latitude) => {

  if (
    (latitude  >= topRightLatitude - (LATITUDE_DELTA_FOR_VESSELS / 2 )) ||
    (longitude >= topRightLongitude - (LONGITUDE_DELTA_FOR_VESSELS / 2 )) ||
    (latitude  <= bottomLeftLatitude - (LATITUDE_DELTA_FOR_VESSELS / 2 )) ||
    (longitude  <= bottomLeftLongitude - (LONGITUDE_DELTA_FOR_VESSELS / 2 ))
  ) {

    //const lowerLeftPoint = ''+(userLongitude - LONGITUDE_DELTA_FOR_LINES_AND_BEACONS)+','+(userLatitude - LATITUDE_DELTA_FOR_LINES_AND_BEACONS)+'';
    //const upperRightPoint = ''+(userLongitude + LONGITUDE_DELTA_FOR_LINES_AND_BEACONS)+','+(userLatitude + LATITUDE_DELTA_FOR_LINES_AND_BEACONS)+'';
    //const bBoxCoordinates = ''+lowerLeftPoint+','+upperRightPoint+''

    bottomLeftLongitude = longitude - LONGITUDE_DELTA_FOR_VESSELS;
    bottomLeftLatitude = latitude - LATITUDE_DELTA_FOR_VESSELS;
    topRightLongitude = longitude + LONGITUDE_DELTA_FOR_VESSELS;
    topRightLatitude = latitude + LATITUDE_DELTA_FOR_VESSELS;

    userLatitude = latitude;
    userLongitude = longitude;

    isVesselRequest = true;

  }
}

export const digiTrafficService = {
  fetchVesselsFromLastTwoHours,
  fetchNauticalWarnings,
  fetchSurroundingVessels,
}
