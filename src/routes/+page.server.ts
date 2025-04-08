import { getWeather } from '$lib/server/weather'
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ params }) => {
  const weatherData = getWeather(34, 343)
	return {'dfdf': 3434, 'weather': weatherData}
};