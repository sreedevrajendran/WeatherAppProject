'use client';

import { X, Trash2, Settings, Info, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (city: string) => void;
}

export function SettingsDrawer({ isOpen, onClose, onSelectLocation }: SettingsDrawerProps) {
    const {
        units, setUnits,
        updatePeriod, setUpdatePeriod,
        widgets, toggleWidget,
        activities, toggleActivity,
        savedLocations, removeLocation
    } = useSettings();

    const [activeTab, setActiveTab] = useState<'general' | 'locations' | 'about'>('general');

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                            mass: 0.8
                        }}
                        className="fixed top-0 right-0 h-full w-full max-w-md glass-panel border-l border-white/10 z-[70] flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                <Settings className="w-5 h-5 text-accent" /> Settings
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-2 gap-2 border-b border-white/10">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-accent/20 text-accent' : 'text-secondary hover:bg-white/5'}`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab('locations')}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'locations' ? 'bg-accent/20 text-accent' : 'text-secondary hover:bg-white/5'}`}
                            >
                                Locations
                            </button>
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'about' ? 'bg-accent/20 text-accent' : 'text-secondary hover:bg-white/5'}`}
                            >
                                About
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    {/* Units */}
                                    <section>
                                        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Weather Units</h3>
                                        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                                            <button
                                                onClick={() => setUnits('metric')}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${units === 'metric' ? 'bg-accent text-white shadow-lg' : 'text-secondary hover:text-white'}`}
                                            >
                                                Celsius (°C)
                                            </button>
                                            <button
                                                onClick={() => setUnits('imperial')}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${units === 'imperial' ? 'bg-accent text-white shadow-lg' : 'text-secondary hover:text-white'}`}
                                            >
                                                Fahrenheit (°F)
                                            </button>
                                        </div>
                                    </section>

                                    {/* Forecast Period */}
                                    <section>
                                        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Forecast Update Period</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[1, 2, 3].map((period) => (
                                                <button
                                                    key={period}
                                                    onClick={() => setUpdatePeriod(period as any)}
                                                    className={`py-2 rounded-xl border transition-all text-sm font-medium ${updatePeriod === period ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-transparent text-secondary hover:bg-white/10'}`}
                                                >
                                                    {period} Hour
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Widgets */}
                                    <section>
                                        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Visible Conditions</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(widgets).map(([key, isVisible]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => toggleWidget(key as any)}
                                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-sm ${isVisible ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-transparent text-secondary hover:bg-white/10'}`}
                                                >
                                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Activities */}
                                    <section>
                                        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Activities</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(activities).map(([key, isVisible]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => toggleActivity(key as any)}
                                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-sm ${isVisible ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-white/5 border-transparent text-secondary hover:bg-white/10'}`}
                                                >
                                                    <span className="capitalize">{key}</span>
                                                    <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-orange-400' : 'bg-white/20'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'locations' && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">Saved Cities</h3>
                                    {savedLocations.length === 0 ? (
                                        <div className="text-center py-10 text-secondary">
                                            <MapPin className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                            <p>No locations saved yet.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {savedLocations.map(city => (
                                                <div key={city} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                                    <button onClick={() => { onSelectLocation(city); onClose(); }} className="text-white font-medium hover:text-accent transition-colors">
                                                        {city}
                                                    </button>
                                                    <button onClick={() => removeLocation(city)} className="text-secondary hover:text-red-400 transition-colors p-2">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="text-center space-y-6 py-10">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-accent to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-accent/20">
                                        <Info className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Cosmic Weather</h3>
                                        <p className="text-secondary">Version 2.0.0 (Cosmic Glass)</p>
                                    </div>
                                    <div className="space-y-2 text-sm text-secondary px-6">
                                        <p>Designed with deep scientific aesthetics and high-performance glassmorphism.</p>
                                        <p>© 2026 Sreedev Inc.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
