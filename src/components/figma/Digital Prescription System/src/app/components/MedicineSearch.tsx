import React, { useState, useEffect, useRef } from 'react';
import { searchMedicines, MedicineResult } from '../utils/medicineApi';

interface MedicineSearchProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (medicine: MedicineResult) => void;
    placeholder?: string;
    className?: string;
}

export const MedicineSearch: React.FC<MedicineSearchProps> = ({
    value,
    onChange,
    onSelect,
    placeholder = 'Search drug name...',
    className = '',
}) => {
    const [suggestions, setSuggestions] = useState<MedicineResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value.length >= 2) {
            setIsLoading(true);
            const timeoutId = window.setTimeout(async () => {
                const results = await searchMedicines(value);
                setSuggestions(results);
                setIsOpen(results.length > 0);
                setIsLoading(false);
            }, 300);
            return () => window.clearTimeout(timeoutId);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [value]);

    const handleItemClick = (medicine: MedicineResult, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('Selected medicine:', medicine.name);

        // Update the input value first
        onChange(medicine.name);

        // Then call onSelect for additional handling (like dosage)
        if (onSelect) {
            onSelect(medicine);
        }

        setIsOpen(false);
        setSuggestions([]);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent bg-white text-slate-900 ${className}`}
            />

            {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-[9999] w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((medicine, index) => (
                        <li
                            key={`${medicine.name}-${index}`}
                            onClick={(e) => handleItemClick(medicine, e)}
                            className="px-4 py-3 hover:bg-cyan-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                        >
                            <span className="font-medium text-slate-900">{medicine.name}</span>
                            {medicine.strengths.length > 0 && (
                                <span className="text-xs text-slate-500 ml-2">
                                    ({medicine.strengths.slice(0, 2).join(', ')})
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

