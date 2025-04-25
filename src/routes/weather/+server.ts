import { fetchWeatherApi } from 'openmeteo'


export async function GET({ url }) {
	const lat: any = url.searchParams.get('lat')
  const lon: any = url.searchParams.get('lon')
  const tz: any = url.searchParams.get('tz')

  const params = {
    "latitude": Number(lat),
    "longitude": Number(lon),
    "hourly": "uv_index", //["uv_index", "sunshine_duration"]
    "timezone": tz,
    "forecast_days": 1
  };
  const api_url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(api_url, params);

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const hourly = response.hourly()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData: any = {
    hourly: {
      time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      uvIndex: hourly.variables(0)!.valuesArray()!,
    },
  };

	return new Response(JSON.stringify(weatherData), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
