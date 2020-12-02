const isDistanceLessThen = (otherVessel, lastLatitude, lastLongitude, alertRadius) => {
  const PI = 0.017453292519943295;    //In Radians
  const cos = Math.cos;
  const EARTH_DIAMETER_IN_KM = 12756.274

  let haverSine = 0.5 - cos((otherVessel.latitude - lastLatitude) * PI)/2 +
    cos(lastLatitude * PI) * cos(otherVessel.latitude * PI) *
    (1 - cos((otherVessel.longitude - lastLongitude) * PI))/2;

  let distance = EARTH_DIAMETER_IN_KM * Math.asin(Math.sqrt(haverSine));
  //console.log( otherVessel.id, 'Distance', distance, 'AlertRadius', alertRadius);

  return distance < alertRadius;
}

export const Distance = {
  isDistanceLessThen,
}
