'use client';

import { AlertTriangle, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export type AlertSeverity = 'red' | 'yellow' | 'green';

interface WeatherAlertProps {
    severity: AlertSeverity;
    title: string;
    description: string;
    onDismiss?: () => void;
}

const severityConfig = {
    red: {
        color: 'bg-red-500/10 border-red-500/50 text-red-400',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        bgGlow: 'shadow-red-500/20',
    },
    yellow: {
        color: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
        icon: AlertCircle,
        iconColor: 'text-yellow-500',
        bgGlow: 'shadow-yellow-500/20',
    },
    green: {
        color: 'bg-green-500/10 border-green-500/50 text-green-400',
        icon: CheckCircle,
        iconColor: 'text-green-500',
        bgGlow: 'shadow-green-500/20',
    },
};

export function WeatherAlert({ severity, title, description, onDismiss }: WeatherAlertProps) {
    const [isVisible, setIsVisible] = useState(true);
    const config = severityConfig[severity];
    const Icon = config.icon;

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => onDismiss?.(), 300);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`glass-panel ${config.color} ${config.bgGlow} border-2 rounded-2xl p-4 shadow-xl relative overflow-hidden`}
                >
                    {/* Animated background pulse */}
                    <div className="absolute inset-0 opacity-20">
                        <div className={`absolute inset-0 ${config.iconColor} blur-3xl animate-pulse`} />
                    </div>

                    <div className="relative z-10 flex items-start gap-4">
                        <div className={`${config.iconColor} mt-1`}>
                            <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{title}</h3>
                            <p className="text-sm opacity-90">{description}</p>
                        </div>

                        {onDismiss && (
                            <button
                                onClick={handleDismiss}
                                className="text-secondary hover:text-white transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// AI-powered alert analyzer (simplified to red, yellow, green only)
export function analyzeWeatherConditions(weatherData: any): { severity: AlertSeverity; title: string; description: string } | null {
    if (!weatherData) return null;

    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const description = weatherData.weather[0].description.toLowerCase();
    const visibility = weatherData.visibility || 10000;

    // 🔴 RED ALERT - Severe/Dangerous conditions
    if (temp > 40 || temp < -5) {
        return {
            severity: 'red',
            title: '🚨 Extreme Temperature Alert',
            description: temp > 40
                ? 'Dangerously hot conditions. Stay indoors, stay hydrated, and avoid outdoor activities.'
                : 'Extreme cold conditions. Bundle up and limit outdoor exposure.',
        };
    }

    if (windSpeed > 15) {
        return {
            severity: 'red',
            title: '🚨 High Wind Alert',
            description: 'Strong winds detected. Secure loose objects and avoid outdoor activities.',
        };
    }

    if (description.includes('thunder') || description.includes('storm')) {
        return {
            severity: 'red',
            title: '⚡ Thunderstorm Warning',
            description: 'Thunderstorm activity detected. Stay indoors and avoid open areas.',
        };
    }

    if (visibility < 1000) {
        return {
            severity: 'red',
            title: '🌫️ Low Visibility Alert',
            description: 'Severe fog or mist. Drive carefully and use headlights.',
        };
    }

    // 🟡 YELLOW ALERT - Moderate/Caution conditions
    if (temp > 35 || temp < 5) {
        return {
            severity: 'yellow',
            title: '⚠️ Temperature Advisory',
            description: temp > 35
                ? 'Very hot weather. Stay hydrated and limit sun exposure.'
                : 'Cold weather. Dress warmly when going outside.',
        };
    }

    if (description.includes('rain') && !description.includes('light')) {
        return {
            severity: 'yellow',
            title: '🌧️ Heavy Rain Advisory',
            description: 'Heavy rainfall expected. Carry an umbrella and drive carefully.',
        };
    }

    if (windSpeed > 10) {
        return {
            severity: 'yellow',
            title: '💨 Windy Conditions',
            description: 'Moderate winds. Secure lightweight outdoor items.',
        };
    }

    if (humidity > 85) {
        return {
            severity: 'yellow',
            title: '💧 High Humidity',
            description: 'Very humid conditions. Stay cool and hydrated.',
        };
    }

    // 🟢 GREEN ALERT - Perfect/Safe conditions
    if (temp >= 18 && temp <= 28 && windSpeed < 5 && !description.includes('rain')) {
        return {
            severity: 'green',
            title: '✨ Perfect Weather',
            description: 'Ideal conditions for outdoor activities. Enjoy your day!',
        };
    }

    return null;
}
