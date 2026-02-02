
'use client';

import { getWeatherIcon } from '@/utils/weatherUtils';
import { Wind, Droplets, Thermometer, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface CurrentWeatherProps {
    data: any;
    loading: boolean;
}

export function CurrentWeather({ data, loading }: CurrentWeatherProps) {
    if (loading) return <div className="text-white text-center mt-10 animate-pulse">Updating weather...</div>;
    if (!data) return null;

    const { main, weather, wind, name, sys } = data;
    const WeatherIcon = getWeatherIcon(weather[0].icon);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 text-white w-full max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-2 mb-2 bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm">
                <MapPin className="w-4 h-4" />
                <span className="uppercase tracking-wider text-sm font-semibold">{name}, {sys.country}</span>
            </div>

            <div className="flex flex-col items-center my-6">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                    <WeatherIcon className="w-40 h-40 text-white drop-shadow-2xl" />
                </motion.div>

                <h1 className="text-8xl font-bold mt-4 tracking-tighter drop-shadow-lg">
                    {Math.round(main.temp)}°
                </h1>
                <p className="text-2xl font-medium opacity-90 capitalize mt-2">{weather[0].description}</p>
                <p className="text-lg opacity-80 mt-1">Feels like {Math.round(main.feels_like)}°</p>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full mt-6">
                <div className="glass-card p-4 rounded-2xl flex flex-col items-center">
                    <Wind className="w-6 h-6 mb-2 opacity-70" />
                    <span className="font-bold text-lg">{wind.speed} m/s</span>
                    <span className="text-xs opacity-60 uppercase">Wind</span>
                </div>
                <div className="glass-card p-4 rounded-2xl flex flex-col items-center">
                    <Droplets className="w-6 h-6 mb-2 opacity-70" />
                    <span className="font-bold text-lg">{main.humidity}%</span>
                    <span className="text-xs opacity-60 uppercase">Humidity</span>
                </div>
                <div className="glass-card p-4 rounded-2xl flex flex-col items-center">
                    <Thermometer className="w-6 h-6 mb-2 opacity-70" />
                    <span className="font-bold text-lg">{main.pressure} hPa</span>
                    <span className="text-xs opacity-60 uppercase">Pressure</span>
                </div>
            </div>
        </motion.div>
    );
}
