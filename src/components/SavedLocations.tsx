
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, X, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedLocationsProps {
    currentCity: string | null;
    onSelectCity: (city: string) => void;
}

export function SavedLocations({ currentCity, onSelectCity }: SavedLocationsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('saved_locations');
        if (saved) {
            setLocations(JSON.parse(saved));
        }
    }, []);

    const saveToStorage = (locs: string[]) => {
        localStorage.setItem('saved_locations', JSON.stringify(locs));
        setLocations(locs);
    };

    const addLocation = () => {
        if (!currentCity) return;
        if (locations.includes(currentCity)) return; // Already saved
        if (locations.length >= 10) {
            alert("You can only save up to 10 locations.");
            return;
        }
        const newLocs = [...locations, currentCity];
        saveToStorage(newLocs);
    };

    const removeLocation = (city: string) => {
        const newLocs = locations.filter(l => l !== city);
        saveToStorage(newLocs);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-4 right-4 md:right-8 z-40 bg-surface hover:bg-white/10 p-2 rounded-full text-primary transition-all shadow-md border border-white/10"
                title="Saved Locations"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Sidebar Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-80 glass-panel shadow-2xl z-50 p-6 text-primary border-l border-white/10"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Bookmark className="w-5 h-5 text-accent" />
                                    Saved Places
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-secondary" />
                                </button>
                            </div>

                            {/* Add Current City Section */}
                            {currentCity && !locations.includes(currentCity) && (
                                <div className="mb-6">
                                    <button
                                        onClick={addLocation}
                                        className="w-full flex items-center justify-center gap-2 bg-accent hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-colors shadow-md"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add {currentCity}
                                    </button>
                                </div>
                            )}

                            {/* Locations List */}
                            <div className="space-y-3">
                                {locations.length === 0 ? (
                                    <p className="text-secondary text-center py-10 italic">No locations saved yet.</p>
                                ) : (
                                    locations.map((city) => (
                                        <motion.div
                                            key={city}
                                            layout
                                            className="group flex items-center justify-between bg-surface hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all shadow-sm"
                                        >
                                            <button
                                                onClick={() => {
                                                    onSelectCity(city);
                                                    setIsOpen(false);
                                                }}
                                                className="flex items-center gap-3 flex-1 text-left"
                                            >
                                                <MapPin className="w-4 h-4 text-secondary group-hover:text-accent transition-colors" />
                                                <span className="font-medium text-primary truncate">{city}</span>
                                            </button>
                                            <button
                                                onClick={() => removeLocation(city)}
                                                className="p-2 text-secondary hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            <div className="absolute bottom-6 left-0 w-full text-center text-xs text-secondary">
                                {locations.length} / 10 saved
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
