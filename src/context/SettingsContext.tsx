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

    // Load from LocalStorage on mount
    useEffect(() => {
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
                console.error("Failed to load settings", e);
            }
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('weather_settings', JSON.stringify({
            units,
            updatePeriod,
            widgets,
            activities,
            savedLocations
        }));
    }, [units, updatePeriod, widgets, activities, savedLocations]);

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
