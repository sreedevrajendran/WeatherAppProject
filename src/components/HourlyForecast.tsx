'use client';

import { getWeatherIcon } from '@/utils/weatherUtils';
import { format } from 'date-fns';

interface HourlyForecastProps {
    data: any[];
    units: 'metric' | 'imperial';
}

export function HourlyForecast({ data, units }: HourlyForecastProps) {
    if (!data || data.length === 0) return null;

    const convertTemp = (temp: number) => units === 'imperial' ? (temp * 9 / 5) + 32 : temp;

    return (
        <div className="w-full max-w-md mx-auto glass-panel rounded-3xl p-6 mb-4">
            <h3 className="text-primary text-lg font-medium mb-1">Hourly forecast</h3>
            <p className="text-secondary text-sm mb-6">Updated now</p>

            <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
                {data.map((hour, index) => {
                    const WeatherIcon = getWeatherIcon(hour.icon);
                    // Format time as "9 PM", "10 PM"
                    const timeLabel = format(new Date(hour.dt * 1000), 'h a');

                    return (
                        <div key={hour.dt} className="flex flex-col items-center min-w-[3rem]">
                            <span className="text-secondary text-sm font-medium whitespace-nowrap mb-3">{timeLabel}</span>
                            <WeatherIcon className="w-6 h-6 text-primary mb-3" />
                            <span className="text-primary font-medium mb-1">{Math.round(convertTemp(hour.temp))}°</span>
                            <span className="text-blue-500 text-xs font-medium">{hour.pop > 0 ? `${hour.pop}%` : ''}</span>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}
