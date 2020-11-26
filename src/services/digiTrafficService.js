const fetchLatest = () => {

  return fetch('https://meri.digitraffic.fi/api/v1/locations/latest')
  .then(res => res.json())
  .then( response => {
    console.log('digiTrafic fetcNnauticalWarnings', response.features[0].geometry.coordinates);
    const responseLength = response.features.length;
    console.log('Vessels length', responseLength)
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
  })
  .catch( ({message}) => console.log(message))
}

const fetchNauticalWarnings = () => {
  return fetch('https://meri.digitraffic.fi/api/v1/nautical-warnings/published')
  .then(res => res.json())
    .then( response => {
      const responseLength = response.features.length;
      console.log('Warnings length', responseLength)
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
      console.log('Warning as an object', nauticalWarnings);
      return nauticalWarnings;
    })
    .catch( ({message}) => console.log(message))
}

export const digiTrafficService = {
  fetchLatest,
  fetchNauticalWarnings
}
