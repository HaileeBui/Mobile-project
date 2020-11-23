const fetchLatest = () => {

  return fetch('https://meri.digitraffic.fi/api/v1/locations/latest')
  .then(res => res.json());

}

export const digiTrafficService = {
  fetchLatest
}
