'use client';

import { useState, useEffect, useCallback } from 'react';
import { ForecastList } from '@/components/ForecastList';
import { HourlyForecast } from '@/components/HourlyForecast';
import { LifestyleCard } from '@/components/LifestyleCard';
import { SearchBar } from '@/components/SearchBar';
import { SavedLocations } from '@/components/SavedLocations';
import { WeatherEffects } from '@/components/WeatherEffects';
import { Search, MapPin, Wind, Droplets, Thermometer, Eye, Settings as SettingsIcon, Crosshair, Heart, CloudLightning, Activity, Umbrella, Gauge } from 'lucide-react';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { getWeatherIcon } from '@/utils/weatherUtils';


// Inner component to consume Context
function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { units, updatePeriod, widgets, addLocation, removeLocation, isLocationSaved } = useSettings();

  // Helper: Convert Units (API defaults to metric usually, but let's assume we get Metric)
  const convertTemp = (temp: number) => units === 'imperial' ? (temp * 9 / 5) + 32 : temp;
  const convertSpeed = (speed: number) => units === 'imperial' ? speed * 2.237 : speed;
  const tempUnit = units === 'imperial' ? '°F' : '°';
  const speedUnit = units === 'imperial' ? 'mph' : 'm/s';

  const fetchWeather = useCallback(async (city: string) => { // Added useCallback back for consistency and potential optimization
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch weather');

      setWeatherData(data.current);
      setForecastData(data.forecast);
      setHourlyData(data.hourly);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [units]); // Dependency on units for potential re-fetch if units change and API needs to reflect that

  const fetchByLocation = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Location weather failed');
      const data = await res.json();

      setWeatherData(data.current);
      setHourlyData(data.hourly || []);
      setForecastData(data.forecast);
      setError('');

    } catch (err) {
      setError('Could not fetch weather for your location.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAllowLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchByLocation(latitude, longitude);
      },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback or just do nothing, user can search manually
        });
    }
  }, [fetchByLocation]);

  // Initial Load
  useEffect(() => {
    const pref = localStorage.getItem('location_preference');
    if (pref === 'allowed') {
      handleAllowLocation();
    } else {
      fetchWeather('London'); // Default city if no preference or not allowed
    }
  }, [handleAllowLocation, fetchWeather]);

  // Filter Hourly Data based on Period
  const filteredHourly = hourlyData ? hourlyData.filter((_: any, i: number) => i % updatePeriod === 0) : [];

  const isSaved = weatherData ? isLocationSaved(weatherData.name) : false;

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-6 px-4 relative overflow-hidden">

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSelectLocation={fetchWeather}
      />

      {/* Weather Animations Layer */}
      {weatherData && (
        <WeatherEffects
          weatherCode={weatherData.weather[0].icon}
          description={weatherData.weather[0].description}
        />
      )}

      {/* Main UI Content Layer */}
      <div className="relative z-20 w-full flex flex-col items-center">

        {/* Top Navigation Bar */}
        <div className="w-full max-w-5xl flex gap-3 mb-8 z-50 items-center">

          {/* GPS Button */}
          <button
            onClick={handleAllowLocation}
            className="glass-panel p-3 rounded-xl text-secondary hover:text-accent hover:bg-white/10 transition-colors"
            title="Use my location"
          >
            <Crosshair className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar onSearch={fetchWeather} />
          </div>

          {/* Save Button */}
          {weatherData && (
            <button
              onClick={() => isSaved ? removeLocation(weatherData.name) : addLocation(weatherData.name)}
              className={`glass-panel p-3 rounded-xl transition-colors ${isSaved ? 'text-red-500 bg-red-500/10' : 'text-secondary hover:text-white hover:bg-white/10'}`}
              title={isSaved ? "Remove from saved" : "Save location"}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="glass-panel p-3 rounded-xl text-secondary hover:text-white hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-5xl pb-10">

          {/* Loading State */}
          {loading && (
            <div className="text-secondary text-center py-20 animate-pulse">
              <p className="text-lg font-medium">Updating forecast...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="glass-panel text-red-400 p-4 rounded-xl text-center border-red-500/20 max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* Weather Data Grid */}
          {!loading && weatherData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

              <div className="flex flex-col gap-6">
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center p-8 text-center glass-panel rounded-3xl relative z-10 overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                  <h1 className="text-primary text-4xl font-bold mb-2 tracking-tight relative z-10">
                    {weatherData.name}
                  </h1>
                  <p className="text-secondary text-sm font-medium mb-8 flex items-center gap-1 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 relative z-10 backdrop-blur-md">
                    <MapPin className="w-3.5 h-3.5" /> {weatherData.region || ''}
                  </p>

                  <div className="text-9xl font-bold text-gradient-accent tracking-tighter mb-4 drop-shadow-2xl relative z-10">
                    {Math.round(convertTemp(weatherData.main.temp))}{tempUnit}
                  </div>
                  <p className="text-secondary text-xl font-medium capitalize mb-10 tracking-wide relative z-10">
                    {weatherData.weather[0].description}
                  </p>

                  {/* Configurable Bento Grid */}
                  <div className="w-full grid grid-cols-2 gap-4 mt-8 relative z-10">

                    {widgets.wind && (
                      <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors group/card">
                        <div className="flex items-center gap-2 mb-3 text-secondary text-xs font-bold uppercase tracking-wider">
                          <Wind className="w-4 h-4 text-cyan-400" /> Wind
                        </div>
                        <div className="text-2xl font-bold text-main">
                          {Math.round(convertSpeed(weatherData.wind.speed))} <span className="text-sm font-normal text-secondary">{speedUnit}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-cyan-400/50 w-3/4" />
                        </div>
                      </div>
                    )}

                    {widgets.humidity && (
                      <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3 text-secondary text-xs font-bold uppercase tracking-wider">
                          <Droplets className="w-4 h-4 text-blue-400" /> Humidity
                        </div>
                        <div className="text-2xl font-bold text-main">
                          {weatherData.main.humidity}<span className="text-sm font-normal text-secondary">%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-blue-400/50" style={{ width: `${weatherData.main.humidity}%` }} />
                        </div>
                      </div>
                    )}

                    {widgets.feelsLike && (
                      <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3 text-secondary text-xs font-bold uppercase tracking-wider">
                          <Thermometer className="w-4 h-4 text-orange-400" /> Feels Like
                        </div>
                        <div className="text-2xl font-bold text-main">
                          {Math.round(convertTemp(weatherData.main.feels_like))}{tempUnit}
                        </div>
                        <div className="text-xs text-secondary mt-2">
                          {weatherData.main.feels_like > weatherData.main.temp ? 'Warmer' : 'Cooler'} than actual
                        </div>
                      </div>
                    )}

                    {widgets.visibility && (
                      <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3 text-secondary text-xs font-bold uppercase tracking-wider">
                          <Eye className="w-4 h-4 text-emerald-400" /> Visibility
                        </div>
                        <div className="text-2xl font-bold text-main">
                          {((weatherData.visibility || 10000) / 1000).toFixed(1)} <span className="text-sm font-normal text-secondary">km</span>
                        </div>
                        <div className="text-xs text-secondary mt-2">
                          {(weatherData.visibility || 10000) > 8000 ? 'Clear view' : 'Low viz'}
                        </div>
                      </div>
                    )}

                    {/* New Data Points (Mocked/Calculated as they might not be in basic weatherData) */}
                    {widgets.pressure && (
                      <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3 text-secondary text-xs font-bold uppercase tracking-wider">
                          <Gauge className="w-4 h-4 text-purple-400" /> Pressure
                        </div>
                        <div className="text-2xl font-bold text-main">
                          {weatherData.main.pressure} <span className="text-sm font-normal text-secondary">hPa</span>
                        </div>
                      </div>
                    )}

                    {widgets.aqi && weatherData.air_quality && (
                      <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3 text-secondary text-xs font-bold uppercase tracking-wider">
                          <CloudLightning className="w-4 h-4 text-yellow-400" /> AQI
                        </div>
                        <div className="text-2xl font-bold text-main">
                          {weatherData.air_quality['us-epa-index']}
                        </div>
                        <div className="text-xs text-secondary mt-2">
                          Index Level
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Hourly Forecast */}
                <HourlyForecast data={filteredHourly} units={units} />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                <ForecastList data={forecastData} units={units} />
                <LifestyleCard weatherData={weatherData} aqi={weatherData.air_quality} />
              </div>

            </div>
          )}

          {/* Empty State / Onboarding */}
          {!weatherData && !loading && !error && (
            <div className="text-center py-20 px-6 max-w-md mx-auto">
              <div className="bg-surface w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm animate-bounce-slow">
                <Search className="w-10 h-10 text-accent/50" />
              </div>
              <h2 className="text-primary text-2xl font-bold mb-3">Weather Dashboard</h2>
              <p className="text-secondary text-lg mb-10 leading-relaxed">Search for a city to see the detailed forecast, lifestyle insights, and live animations.</p>

              <button
                onClick={handleAllowLocation}
                className="bg-accent text-white font-bold py-4 px-10 rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
              >
                Use My Location
              </button>
            </div>
          )}


          {/* Footer */}
          <footer className="w-full text-center py-6 mt-8 border-t border-white/5">
            <p className="text-secondary text-sm font-medium">
              Designed by <span className="text-white">Sreedev Rajendran</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SettingsProvider>
      <WeatherDashboard />
    </SettingsProvider>
  );
}

