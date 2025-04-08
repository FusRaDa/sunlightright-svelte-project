interface WeatherObject {
  'latitude': number
  'longitude': number
}

export function getWeather(latitude: number, longitude: number): WeatherObject {

  return {'latitude': latitude, 'longitude': longitude}
}