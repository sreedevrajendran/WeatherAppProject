'use client';

import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartAssistantProps {
    advice: string;
}

export function SmartAssistant({ advice }: SmartAssistantProps) {
    if (!advice) return null;

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 mx-4 max-w-2xl md:mx-auto w-full"
        >
            <div className="bg-white/10 backdrop-blur-md border-l-4 border-white/50 p-4 rounded-r-xl shadow-sm flex items-start gap-4">
                <Info className="w-5 h-5 text-white/80 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-white/90 text-sm uppercase tracking-widest mb-1 opacity-70">Daily Insight</h3>
                    <p className="font-medium text-white text-base leading-relaxed">{advice}</p>
                </div>
            </div>
        </motion.div>
    );
}
