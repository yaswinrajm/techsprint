import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PatientDetail } from '../components/PatientDetail';

export const PatientListPage = () => {
  const { patients, prescriptions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientPrescriptionCount = (patientName: string) => {
    return prescriptions.filter((p) => p.patientName.toLowerCase() === patientName.toLowerCase()).length;
  };

  // Show patient detail if selected
  if (selectedPatientId) {
    return (
      <PatientDetail
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => setSelectedPatientId(patient.id)}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="bg-cyan-100 rounded-full p-3 flex-shrink-0">
                <User className="w-6 h-6 text-cyan-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{patient.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-600">
                    {patient.age} years • {patient.gender}
                  </p>
                  <p className="text-sm text-slate-600">
                    Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    {getPatientPrescriptionCount(patient.name)} prescriptions
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500">No patients found</p>
        </div>
      )}
    </div>
  );
};

