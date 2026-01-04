import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save } from 'lucide-react';

export const SettingsPage = () => {
  const { doctorSettings, updateDoctorSettings } = useApp();
  const [formData, setFormData] = useState(doctorSettings);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    updateDoctorSettings(formData);
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Doctor Settings</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Doctor Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Qualification *
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => handleChange('qualification', e.target.value)}
              placeholder="e.g., MBBS, MD"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Clinic Name *
            </label>
            <input
              type="text"
              value={formData.clinicName}
              onChange={(e) => handleChange('clinicName', e.target.value)}
              placeholder="Enter clinic name"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter clinic address"
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png (optional)"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-slate-500">
              Enter a URL to your clinic logo (optional)
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
