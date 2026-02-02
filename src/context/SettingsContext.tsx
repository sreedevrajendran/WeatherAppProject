'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Unit = 'metric' | 'imperial';
type UpdatePeriod = 1 | 2 | 3;

interface WidgetVisibility {
    wind: boolean;
    humidity: boolean;
    feelsLike: boolean;
    visibility: boolean;
    pressure: boolean; // New
    uvIndex: boolean; // New
    precipitation: boolean; // New
    aqi: boolean; // New
}

interface ActivityVisibility {
    running: boolean;
    jogging: boolean;
    cycling: boolean;
    hiking: boolean;
}

interface SettingsContextType {
    units: Unit;
    setUnits: (u: Unit) => void;
    updatePeriod: UpdatePeriod;
    setUpdatePeriod: (p: UpdatePeriod) => void;
    widgets: WidgetVisibility;
    toggleWidget: (key: keyof WidgetVisibility) => void;
    activities: ActivityVisibility;
    toggleActivity: (key: keyof ActivityVisibility) => void;
    savedLocations: string[];
    addLocation: (city: string) => void;
    removeLocation: (city: string) => void;
    isLocationSaved: (city: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    // defaults
    const [units, setUnits] = useState<Unit>('metric');
    const [updatePeriod, setUpdatePeriod] = useState<UpdatePeriod>(1);
    const [isLoading, setIsLoading] = useState(true);

    const [widgets, setWidgets] = useState<WidgetVisibility>({
        wind: true,
        humidity: true,
        feelsLike: true,
        visibility: true,
        pressure: true,
        uvIndex: true,
        precipitation: true,
        aqi: true,
    });

    const [activities, setActivities] = useState<ActivityVisibility>({
        running: true,
        jogging: true,
        cycling: true,
        hiking: true
    });

    const [savedLocations, setSavedLocations] = useState<string[]>([]);

    // Load settings from database on mount
    useEffect(() => {
        async function loadSettings() {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    setUnits(data.units);
                    setUpdatePeriod(data.updatePeriod);
                    setWidgets(data.widgets);
                    setActivities(data.activities);
                    setSavedLocations(data.savedLocations);
                }
            } catch (error) {
                console.error('Failed to load settings from database:', error);
                // Fallback to localStorage if database fails
                const saved = localStorage.getItem('weather_settings');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (parsed.units) setUnits(parsed.units);
                        if (parsed.updatePeriod) setUpdatePeriod(parsed.updatePeriod);
                        if (parsed.widgets) setWidgets(parsed.widgets);
                        if (parsed.activities) setActivities(parsed.activities);
                        if (parsed.savedLocations) setSavedLocations(parsed.savedLocations);
                    } catch (e) {
                        console.error("Failed to load settings from localStorage", e);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        }
        loadSettings();
    }, []);

    // Save to database with debounce (auto-save after changes)
    useEffect(() => {
        if (isLoading) return; // Don't save during initial load

        const timeoutId = setTimeout(async () => {
            try {
                await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        units,
                        updatePeriod,
                        widgets,
                        activities,
                        savedLocations
                    }),
                });
                // Also save to localStorage as backup
                localStorage.setItem('weather_settings', JSON.stringify({
                    units,
                    updatePeriod,
                    widgets,
                    activities,
                    savedLocations
                }));
            } catch (error) {
                console.error('Failed to save settings to database:', error);
            }
        }, 500); // Debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [units, updatePeriod, widgets, activities, savedLocations, isLoading]);

    const toggleWidget = (key: keyof WidgetVisibility) => {
        setWidgets(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleActivity = (key: keyof ActivityVisibility) => {
        setActivities(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const addLocation = (city: string) => {
        if (!savedLocations.includes(city)) {
            setSavedLocations(prev => [...prev, city]);
        }
    };

    const removeLocation = (city: string) => {
        setSavedLocations(prev => prev.filter(c => c !== city));
    };

    const isLocationSaved = (city: string) => savedLocations.includes(city);

    return (
        <SettingsContext.Provider value={{
            units, setUnits,
            updatePeriod, setUpdatePeriod,
            widgets, toggleWidget,
            activities, toggleActivity,
            savedLocations, addLocation, removeLocation, isLocationSaved
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};
