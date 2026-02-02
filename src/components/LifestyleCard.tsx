'use client';

import { Activity, Wind, AlertCircle, Bike, Mountain } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface LifestyleCardProps {
    weatherData: any;
    aqi: any;
}

export function LifestyleCard({ weatherData, aqi }: LifestyleCardProps) {
    const { activities } = useSettings();

    // Data Extraction
    const temp = weatherData?.main?.temp || 0;
    const windSpeed = weatherData?.wind?.speed || 0; // m/s
    const visibility = weatherData?.visibility || 10000; // meters
    const isRaining = weatherData?.weather?.[0]?.main?.toLowerCase().includes('rain') ||
        weatherData?.weather?.[0]?.description?.toLowerCase().includes('rain');

    // --- Logic: Running / Jogging ---
    let runStatus = 'Good';
    let runColor = 'text-green-400';
    if (isRaining || temp > 30 || temp < 0 || windSpeed > 10) { // Added wind factor
        runStatus = 'Poor';
        runColor = 'text-red-400';
    } else if (temp > 25 || temp < 5 || windSpeed > 7) {
        runStatus = 'Fair';
        runColor = 'text-yellow-400';
    }

    // --- Logic: Cycling ---
    // Cycling is sensitive to wind and rain
    let cycleStatus = 'Good';
    let cycleColor = 'text-green-400';
    if (isRaining || windSpeed > 9 || temp > 35 || temp < 2) { // > ~32km/h wind is hard
        cycleStatus = 'Poor';
        cycleColor = 'text-red-400';
    } else if (windSpeed > 6 || temp > 30 || temp < 8) {
        cycleStatus = 'Fair';
        cycleColor = 'text-yellow-400';
    }

    // --- Logic: Hiking ---
    // Hiking matches visibility and duration
    let hikeStatus = 'Good';
    let hikeColor = 'text-green-400';
    if (isRaining || visibility < 2000 || temp > 32 || temp < 0) {
        hikeStatus = 'Poor';
        hikeColor = 'text-red-400';
    } else if (visibility < 5000 || temp > 28 || temp < 5) {
        hikeStatus = 'Fair';
        hikeColor = 'text-yellow-400';
    }

    // Heuristics for "Allergies" based on US-EPA-Index (1-6)
    const aqiIndex = aqi?.["us-epa-index"] || 1;
    let allergyStatus = 'Low';
    let allergyColor = 'text-green-400';

    if (aqiIndex >= 4) {
        allergyStatus = 'Extreme';
        allergyColor = 'text-red-400';
    } else if (aqiIndex >= 3) {
        allergyStatus = 'High';
        allergyColor = 'text-orange-400';
    } else if (aqiIndex === 2) {
        allergyStatus = 'Moderate';
        allergyColor = 'text-yellow-400';
    }

    return (
        <>
            <div className="w-full max-w-md mx-auto glass-panel rounded-3xl p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-primary text-lg font-medium">Activities</h2>
                    <span className="text-secondary">▼</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {activities.running && (
                        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                            <Activity className="text-primary w-6 h-6" />
                            <div>
                                <div className="text-primary font-medium">Running</div>
                                <div className={`text-xs ${runColor}`}>{runStatus}</div>
                            </div>
                        </div>
                    )}

                    {activities.jogging && (
                        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                            <Activity className="text-primary w-6 h-6" />
                            <div>
                                <div className="text-primary font-medium">Jogging</div>
                                <div className={`text-xs ${runColor}`}>{runStatus}</div>
                            </div>
                        </div>
                    )}

                    {activities.cycling && (
                        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                            <Bike className="text-primary w-6 h-6" />
                            <div>
                                <div className="text-primary font-medium">Cycling</div>
                                <div className={`text-xs ${cycleColor}`}>{cycleStatus}</div>
                            </div>
                        </div>
                    )}

                    {activities.hiking && (
                        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                            <Mountain className="text-primary w-6 h-6" />
                            <div>
                                <div className="text-primary font-medium">Hiking</div>
                                <div className={`text-xs ${hikeColor}`}>{hikeStatus}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full max-w-md mx-auto glass-panel rounded-3xl p-6 mb-4">
                <h2 className="text-primary text-lg font-medium mb-4">Allergies</h2>
                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                    <AlertCircle className="text-primary w-6 h-6" />
                    <div>
                        <div className="text-primary font-medium">Dust and dander</div>
                        <div className={`text-xs ${allergyColor}`}>{allergyStatus}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
