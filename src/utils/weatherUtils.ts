
import {
    Sun, CloudRain, CloudSnow, Cloud, CloudLightning, Wind, Moon, CloudDrizzle,
    ThermometerSun, Umbrella
} from 'lucide-react';

export const formatTemperature = (temp: number): string => {
    return `${Math.round(temp)}°`;
};

export const getWeatherIcon = (code: string, isNight: boolean = false) => {
    // OpenWeatherMap icon codes
    // 01d/n: clear sky
    // 02d/n: few clouds
    // 03d/n: scattered clouds
    // 04d/n: broken clouds
    // 09d/n: shower rain
    // 10d/n: rain
    // 11d/n: thunderstorm
    // 13d/n: snow
    // 50d/n: mist

    const iconMap: Record<string, any> = {
        '01d': Sun,
        '01n': Moon,
        '02d': Cloud, // partly cloudy day
        '02n': Cloud, // partly cloudy night
        '03d': Cloud,
        '03n': Cloud,
        '04d': Cloud,
        '04n': Cloud,
        '09d': CloudDrizzle,
        '09n': CloudDrizzle,
        '10d': CloudRain,
        '10n': CloudRain,
        '11d': CloudLightning,
        '11n': CloudLightning,
        '13d': CloudSnow,
        '13n': CloudSnow,
        '50d': Wind,
        '50n': Wind,
    };

    return iconMap[code] || Sun;
};

export const generateAIAdvice = (weather: any): string => {
    if (!weather) return "Loading smart insights...";

    const { main, weather: conditions, wind } = weather;
    const temp = main.temp;
    const condition = conditions[0].main.toLowerCase(); // Rain, Clear, Clouds, etc.
    const windSpeed = wind.speed;

    const advices = [];

    // Temperature based advice
    if (temp > 30) advices.push("High temperatures expected; precautionary hydration and sun protection recommended.");
    else if (temp > 25) advices.push("Conditions are favorable for outdoor activities.");
    else if (temp < 10) advices.push("Temperatures are low; warm clothing is advisable.");
    else if (temp < 0) advices.push("Freezing conditions detected; ensure adequate thermal protection.");

    // Condition based advice
    if (condition.includes('rain')) advices.push("Precipitation expected; carrying an umbrella is recommended.");
    if (condition.includes('snow')) advices.push("Snowfall likely; exercise caution on slippery surfaces.");
    if (condition.includes('clear')) advices.push("Visibility is good; optimal conditions for photography/outdoor work.");
    if (condition.includes('thunderstorm')) advices.push("Storm activity detected; remaining indoors is safer.");

    // Wind based advice
    if (windSpeed > 10) advices.push("High wind speeds detected; secure loose items.");

    if (advices.length === 0) return "Conditions are stable.";

    // Pick the most critical advice
    return advices[0];
};
