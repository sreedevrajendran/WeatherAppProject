'use client';

import React, { useMemo, useEffect, useState } from 'react';

interface WeatherEffectsProps {
    weatherCode: string; // e.g. "01d", "10n"
    description: string;
}

export function WeatherEffects({ weatherCode, description }: WeatherEffectsProps) {
    // Determine condition from code
    const isDay = weatherCode.endsWith('d');
    const code = weatherCode.substring(0, 2); // "01", "10", etc.

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    // Memoize particles to prevent re-renders on every frame (though React reconciliation handles this well usually)
    const raindrops = useMemo(() => Array.from({ length: 50 }), []);
    const snowflakes = useMemo(() => Array.from({ length: 40 }), []);
    const clouds = useMemo(() => Array.from({ length: 4 }), []);

    // Render Nothing on Server/Hydration to avoid mismatch
    if (!isMounted) return null;

    // --- RENDER FUNCTIONS ---

    const renderSun = () => (
        <div className="absolute top-[-50px] right-[-50px] md:top-10 md:right-10 w-48 h-48 md:w-64 md:h-64 pointer-events-none z-0">
            {/* Core Sun */}
            <div className="absolute inset-0 m-auto w-24 h-24 bg-yellow-400 rounded-full shadow-[0_0_60px_rgba(250,204,21,0.6)] z-10" />

            {/* Rays */}
            <div className="absolute inset-0 w-full h-full animate-spin-slow">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent"
                        style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}
                    />
                ))}
            </div>
            <div className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }}>
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-4/5 h-1 bg-gradient-to-r from-transparent via-orange-300/30 to-transparent"
                        style={{ transform: `translate(-50%, -50%) rotate(${i * 45 + 22.5}deg)` }}
                    />
                ))}
            </div>
        </div>
    );

    const renderClouds = (overlapSun = false) => (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {clouds.map((_, i) => {
                const top = 10 + (i * 15);
                const duration = 25 + (i * 10);
                const delay = i * -15;
                const scale = 0.8 + (Math.random() * 0.5);
                const opacity = 0.6 + (Math.random() * 0.3);

                return (
                    <div
                        key={i}
                        className="animate-cloud absolute opacity-80 dark:opacity-30"
                        style={{
                            top: `${top}%`,
                            left: '-200px',
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                            opacity: overlapSun ? 0.9 : undefined
                        }}
                    >
                        <div
                            className={`bg-white rounded-full blur-2xl filter ${overlapSun ? 'bg-gray-200' : ''}`}
                            style={{ width: `${300 * scale}px`, height: `${100 * scale}px` }}
                        />
                    </div>
                );
            })}
        </div>
    );

    const renderRain = () => (
        <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
            {raindrops.map((_, i) => {
                const left = Math.random() * 100;
                const delay = Math.random() * 2;
                const duration = 0.5 + Math.random() * 0.5;

                return (
                    <div
                        key={i}
                        className="absolute top-0 w-[1px] h-10 bg-blue-400/50 animate-fall"
                        style={{
                            left: `${left}%`,
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`
                        }}
                    />
                )
            })}
        </div>
    );

    const renderSnow = () => (
        <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
            {snowflakes.map((_, i) => {
                const left = Math.random() * 100;
                const delay = Math.random() * 5;
                const duration = 3 + Math.random() * 4;
                const size = 2 + Math.random() * 4;

                return (
                    <div
                        key={i}
                        className="absolute top-0 bg-white rounded-full animate-fall"
                        style={{
                            left: `${left}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`
                        }}
                    />
                )
            })}
        </div>
    );

    const renderThunder = () => (
        <div className="absolute inset-0 z-0 bg-slate-900/10 pointer-events-none overflow-hidden">
            {/* Reusing Rain */}
            {renderRain()}
            {renderClouds(true)}
            {/* Simple flash effect could be added here in CSS but complex */}
        </div>
    );

    const renderSunnyGradient = () => (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-yellow-500/5 to-transparent z-0 pointer-events-none" />
    );

    // --- LOGIC ---

    // Clear (Sun/Moon)
    if (code === '01') {
        return isDay ? <>{renderSunnyGradient()}{renderSun()}</> : null; // Add Moon later if needed
    }

    // Clouds (Few, Scattered, Broken)
    if (['02', '03', '04'].includes(code)) {
        // 02: Few clouds (Sun + Cloud)
        if (code === '02' && isDay) return <>{renderSun()}{renderClouds()}</>;
        return renderClouds(true);
    }

    // Rain (Shower, Rain, Thunderstorm)
    if (['09', '10'].includes(code)) {
        return <>{renderClouds(true)}{renderRain()}</>;
    }

    // Thunderstorm
    if (code === '11') {
        return renderThunder();
    }

    // Snow
    if (code === '13') {
        return <>{renderClouds()}{renderSnow()}</>;
    }

    // Mist/Fog - Cosmic style: Subtle cool gradient + heavy blur, no solid white
    if (code === '50') {
        return (
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-200/5 to-transparent blur-3xl opacity-30" />
                {renderClouds()}
            </div>
        );
    }

    return null; // Default
}
