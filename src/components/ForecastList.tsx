'use client';

import { getWeatherIcon } from '@/utils/weatherUtils';
import { format } from 'date-fns';

interface ForecastListProps {
    data: any;
    units: 'metric' | 'imperial';
}

export function ForecastList({ data, units }: ForecastListProps) {
    if (!data || !data.list) return null;

    const convertTemp = (temp: number) => units === 'imperial' ? (temp * 9 / 5) + 32 : temp;
    const tempUnit = units === 'imperial' ? '°F' : '°';

    // List is already pre-filtered by our API adapter to daily snapshots
    const dailyForecasts = data.list;

    return (
        <div className="w-full max-w-md mx-auto glass-panel rounded-3xl p-6 mb-4 overflow-hidden">
            <h2 className="text-secondary text-xs uppercase tracking-wider font-bold mb-4 ml-1">6-Day Forecast</h2>

            <div className="flex flex-col gap-1">
                {dailyForecasts.slice(0, 6).map((day: any) => {
                    const WeatherIcon = getWeatherIcon(day.weather[0].icon);
                    const isToday = new Date(day.dt * 1000).getDate() === new Date().getDate();

                    return (
                        <div key={day.dt} className="flex items-center justify-between py-3 px-2 hover:bg-white/5 dark:hover:bg-white/5 rounded-xl transition-colors cursor-default group">

                            {/* Day Name */}
                            <div className="w-16 text-primary font-medium text-sm">
                                {isToday ? 'Today' : format(new Date(day.dt * 1000), 'EEE')}
                            </div>

                            {/* Icon & Rain Chance */}
                            <div className="flex items-center gap-2 flex-1">
                                <WeatherIcon className="w-6 h-6 text-accent" />
                                <span className={`text-xs font-semibold ${day.pop > 0.2 ? 'text-blue-500' : 'text-secondary/50'}`}>
                                    {day.pop >= 0.2 ? `${Math.round(day.pop * 100)}%` : ''}
                                </span>
                            </div>

                            {/* Min/Max Temps (Visual layout) */}
                            <div className="flex items-center gap-4 w-32 justify-end">
                                <span className="text-secondary text-sm font-medium w-8 text-right">
                                    {Math.round(convertTemp(day.main.temp_min))}°
                                </span>

                                {/* Visual Bar */}
                                <div className="hidden sm:block w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-300 to-yellow-300 opacity-80"
                                        style={{ width: '100%' }} // Simplified bar for visual flair, real width calc is complex without min/max of week
                                    />
                                </div>

                                <span className="text-primary text-sm font-bold w-8 text-right">
                                    {Math.round(convertTemp(day.main.temp_max))}{tempUnit}
                                </span>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
