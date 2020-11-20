const isDistanceLessThen = (otherVessel, lastLatitude, lastLongitude, alertRadius) => {
  const PI = 0.017453292519943295;
  const cos = Math.cos;

  let a = 0.5 - cos((otherVessel.latitude - lastLatitude) * PI)/2 +
    cos(lastLatitude * PI) * cos(otherVessel.latitude * PI) *
    (1 - cos((otherVessel.longitude - lastLongitude) * PI))/2;

  let distance = 12742 * Math.asin(Math.sqrt(a));

  return distance < alertRadius;

}


export const Distance = {
  isDistanceLessThen,
}
