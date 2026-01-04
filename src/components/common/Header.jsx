import React, { useState, useEffect } from 'react';
import { Stethoscope, Settings, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [clinicInfo, setClinicInfo] = useState({
        doctorName: 'Dr. Rahul TP',
        clinicName: 'MediScript'
    });

    useEffect(() => {
        const loadSettings = () => {
            const stored = localStorage.getItem('clinicSettings');
            if (stored) {
                const parsed = JSON.parse(stored);
                setClinicInfo({
                    doctorName: parsed.doctorName || 'Dr. Rahul TP',
                    clinicName: parsed.clinicName || 'MediScript'
                });
            }
        };

        loadSettings();
        window.addEventListener('clinicSettingsUpdated', loadSettings);
        return () => window.removeEventListener('clinicSettingsUpdated', loadSettings);
    }, []);

    return (
        <header style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)'
        }}>
            <div className="container flex items-center justify-between" style={{ height: '4rem' }}>
                <div className="flex items-center gap-2">
                    <div style={{
                        padding: '0.5rem',
                        background: '#cffafe', // Cyan 100
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Stethoscope size={24} color="var(--color-primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
                        {clinicInfo.clinicName}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                        {clinicInfo.doctorName}
                    </span>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
                    </button>

                    <Link to="/settings" title="Settings" style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '9999px',
                        backgroundColor: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#475569',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                    }} className="hover:bg-slate-300">
                        <Settings size={16} />
                    </Link>
                </div>
            </div>
        </header>
    );
}
