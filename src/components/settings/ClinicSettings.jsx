import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function ClinicSettings() {
    const [settings, setSettings] = useState({
        clinicName: '',
        doctorName: '',
        qualification: '',
        address: '',
        phone: '',
        logoUrl: ''
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('clinicSettings');
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('clinicSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // Dispatch a custom event so other components (Header) can update immediately
        window.dispatchEvent(new Event('clinicSettingsUpdated'));
    };

    return (
        <div className="container main-content" style={{ marginTop: '2rem', maxWidth: '800px' }}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Clinic Settings</h2>
            
            <div className="card space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="label">Doctor Name</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            value={settings.doctorName}
                            onChange={(e) => handleChange('doctorName', e.target.value)}
                            placeholder="e.g. Dr. Rahul TP" 
                        />
                    </div>
                    <div>
                        <label className="label">Qualification</label>
                        <input 
                            type="text" 
                            className="input-field"
                            value={settings.qualification}
                            onChange={(e) => handleChange('qualification', e.target.value)}
                            placeholder="e.g. MBBS, MD" 
                        />
                    </div>
                    
                    <div>
                        <label className="label">Clinic Name</label>
                        <input 
                            type="text" 
                            className="input-field"
                            value={settings.clinicName}
                            onChange={(e) => handleChange('clinicName', e.target.value)}
                            placeholder="e.g. Health Plus Clinic" 
                        />
                    </div>
                     <div>
                        <label className="label">Phone Number</label>
                        <input 
                            type="text" 
                            className="input-field"
                            value={settings.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="e.g. +91 98765 43210" 
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="label">Clinic Address</label>
                        <textarea 
                            className="input-field"
                            rows="3"
                            value={settings.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            placeholder="e.g. 123, Main Street, City" 
                        />
                    </div>

                    <div className="md:col-span-2">
                         <label className="label">Logo URL (Optional)</label>
                        <input 
                            type="text" 
                            className="input-field"
                            value={settings.logoUrl}
                            onChange={(e) => handleChange('logoUrl', e.target.value)}
                            placeholder="https://example.com/logo.png" 
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button onClick={handleSave} className="btn btn-primary flex items-center gap-2">
                        <Save size={18} /> {saved ? 'Saved!' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
