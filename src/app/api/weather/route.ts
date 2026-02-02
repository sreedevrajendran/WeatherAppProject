
import { NextResponse } from 'next/server';

const API_KEY = '836e9b4fc75a44d6bd6144318260202';
const BASE_URL = 'http://api.weatherapi.com/v1';

// Helper to map WeatherAPI codes to OpenWeatherMap icon codes
// This ensures our existing frontend (icons, backgrounds) continues to work
// WAPI Codes: https://www.weatherapi.com/docs/weather_conditions.json
const mapConditionToIcon = (code: number, isDay: number): string => {
    const daySuffix = isDay ? 'd' : 'n';

    // Clear / Sunny
    if (code === 1000) return `01${daySuffix}`;
    // Partly cloudy
    if (code === 1003) return `02${daySuffix}`;
    // Cloudy / Overcast
    if (code === 1006 || code === 1009) return `04${daySuffix}`;
    // Mist / Fog
    if ([1030, 1135, 1147].includes(code)) return `50${daySuffix}`;
    // Rain (Patchy, Light, Moderate, Heavy)
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return `10${daySuffix}`;
    // Drizzle
    if ([1150, 1153, 1168, 1171].includes(code)) return `09${daySuffix}`;
    // Thunder
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return `11${daySuffix}`;
    // Snow
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258].includes(code)) return `13${daySuffix}`;
    // Sleet / Ice
    if ([1069, 1072, 1198, 1201, 1204, 1207, 1249, 1252, 1261, 1264].includes(code)) return `13${daySuffix}`;

    return `02${daySuffix}`; // Default to cloudy
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cityParam = searchParams.get('city') || searchParams.get('q');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    let query = '';
    if (cityParam) {
        query = cityParam.trim();
        // WeatherAPI handles case-insensitivity well, 
        // but trimming whitespace is crucial for "London " vs "London"
    }
    else if (lat && lon) query = `${lat},${lon}`;
    else return NextResponse.json({ error: 'Missing city or coordinates' }, { status: 400 });

    try {
        // Fetch Forecast (WeatherAPI gives current + forecast in one call)
        // Requesting 7 days to ensure we have a robust 6-day view
        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7&aqi=yes&alerts=no`;

        const res = await fetch(url);
        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.error?.message || 'Failed to fetch weather' }, { status: res.status });
        }

        const data = await res.json();

        // ADAPTER: Transform to OpenWeatherMap structure (+ Extra fields for new UI)
        const currentOWM = {
            weather: [{
                main: data.current.condition.text,
                description: data.current.condition.text,
                icon: mapConditionToIcon(data.current.condition.code, data.current.is_day)
            }],
            main: {
                temp: data.current.temp_c,
                feels_like: data.current.feelslike_c,
                humidity: data.current.humidity,
                pressure: data.current.pressure_mb,
            },
            air_quality: data.current.air_quality, // Passing through AQI
            wind: {
                speed: data.current.wind_kph / 3.6
            },
            name: data.location.name,
            region: data.location.region, // Added for "City, State" display
            sys: {
                country: data.location.country
            },
            dt: data.current.last_updated_epoch
        };

        // Extract Hourly Forecast (next 24h from now)
        const currentEpoch = data.current.last_updated_epoch;
        let hourlyList: any[] = [];

        // Combine hours from today and tomorrow
        const allHours = [
            ...data.forecast.forecastday[0].hour,
            ...data.forecast.forecastday[1].hour
        ];

        // Filter for next 24 hours
        hourlyList = allHours.filter((h: any) => h.time_epoch > currentEpoch).slice(0, 24).map((h: any) => ({
            dt: h.time_epoch,
            dt_txt: h.time,
            temp: h.temp_c,
            icon: mapConditionToIcon(h.condition.code, h.is_day),
            pop: h.chance_of_rain || 0, // Probability of precipitation
        }));

        // Transform Daily Forecast
        const forecastList: any[] = [];

        data.forecast.forecastday.forEach((day: any) => {
            forecastList.push({
                dt: day.date_epoch,
                dt_txt: day.date,
                main: {
                    temp_max: day.day.maxtemp_c,
                    temp_min: day.day.mintemp_c,
                },
                weather: [{
                    main: day.day.condition.text,
                    icon: mapConditionToIcon(day.day.condition.code, 1)
                }]
            });
        });

        return NextResponse.json({
            current: currentOWM,
            hourly: hourlyList,
            forecast: { list: forecastList }
        });

    } catch (error) {
        console.error('Weather API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
