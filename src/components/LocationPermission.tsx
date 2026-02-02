
'use client';

import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationPermissionProps {
    onAllow: () => void;
    onDeny: () => void;
}

export function LocationPermission({ onAllow, onDeny }: LocationPermissionProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if we already have permission or if user previously denied
        // For simplicity in this demo, we'll show it if we don't have a saved preference
        // In a real app, you might check localStorage
        const hasInteracted = localStorage.getItem('location_preference');
        if (!hasInteracted) {
            // Small delay for entrance animation
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAllow = () => {
        localStorage.setItem('location_preference', 'allowed');
        setIsVisible(false);
        onAllow();
    };

    const handleDeny = () => {
        localStorage.setItem('location_preference', 'denied');
        setIsVisible(false);
        onDeny();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-full max-w-sm"
                >
                    <div className="glass-card p-6 rounded-2xl border border-white/40 shadow-2xl relative bg-black/20 backdrop-blur-xl">
                        <button
                            onClick={handleDeny}
                            className="absolute top-2 right-2 text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-500/20 p-3 rounded-full shrink-0">
                                <MapPin className="w-6 h-6 text-blue-200" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">Enable Location?</h3>
                                <p className="text-white/80 text-sm leading-relaxed mb-4">
                                    Get accurate weather for your climate by allowing location access.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAllow}
                                        className="flex-1 bg-white text-indigo-900 py-2 px-4 rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg"
                                    >
                                        Allow
                                    </button>
                                    <button
                                        onClick={handleDeny}
                                        className="flex-1 bg-transparent border border-white/30 text-white py-2 px-4 rounded-lg font-medium hover:bg-white/10 transition-colors"
                                    >
                                        Deny
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
