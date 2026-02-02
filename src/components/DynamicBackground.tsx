'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DynamicBackgroundProps {
    children: ReactNode;
    weatherCode: string | null;
}

export function DynamicBackground({ children, weatherCode }: DynamicBackgroundProps) {
    const [gradient, setGradient] = useState('bg-pro-day');

    useEffect(() => {
        if (!weatherCode) return;

        const isNight = weatherCode.endsWith('n');

        let newGradient = 'bg-pro-day';

        // Map to professional minimal gradients
        if (weatherCode.startsWith('01')) newGradient = isNight ? 'bg-pro-night' : 'bg-pro-day';
        else if (weatherCode.startsWith('02') || weatherCode.startsWith('03') || weatherCode.startsWith('04')) newGradient = isNight ? 'bg-pro-night' : 'bg-pro-day'; // Minimalist clouds usually just mean subtle gray/dark
        else if (weatherCode.startsWith('09') || weatherCode.startsWith('10') || weatherCode.startsWith('11')) newGradient = 'bg-pro-rain';
        else if (weatherCode.startsWith('13')) newGradient = 'bg-pro-snow';
        else newGradient = isNight ? 'bg-pro-night' : 'bg-pro-day';

        setGradient(newGradient);

    }, [weatherCode]);

    return (
        <div className={`min-h-screen w-full transition-colors duration-1000 ease-in-out ${gradient}`}>
            {/* Content */}
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>
        </div>
    );
}
