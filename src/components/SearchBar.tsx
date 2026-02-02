
'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
// Inline debounce used instead of hook for simplicity

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [term, setTerm] = useState('');

    // Simple inline debounce implementation for now
    useEffect(() => {
        const handler = setTimeout(() => {
            if (term.trim()) onSearch(term.trim());
        }, 800);
        return () => clearTimeout(handler);
    }, [term, onSearch]);

    return (
        <div className="relative w-full max-w-md mx-auto z-10">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search city..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border-none text-primary placeholder-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
            </div>
        </div>
    );
}
