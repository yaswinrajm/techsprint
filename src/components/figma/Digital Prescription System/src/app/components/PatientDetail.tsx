import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, Pill } from 'lucide-react';

interface PatientDetailProps {
    patientId: string;
    onBack: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patientId, onBack }) => {
    const { patients, prescriptions } = useApp();

    const patient = patients.find(p => p.id === patientId);
    const patientPrescriptions = prescriptions.filter(p =>
        p.patientName.toLowerCase() === patient?.name.toLowerCase()
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!patient) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Patient not found</p>
                <button onClick={onBack} className="mt-4 text-cyan-600 hover:underline">
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">{patient.name}</h2>
                    <p className="text-sm text-slate-500">
                        {patient.age} years • {patient.gender}
                    </p>
                </div>
            </div>

            {/* Patient Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Patient Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Name</p>
                        <p className="font-medium text-slate-900">{patient.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Age</p>
                        <p className="font-medium text-slate-900">{patient.age} years</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Gender</p>
                        <p className="font-medium text-slate-900">{patient.gender}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Last Visit</p>
                        <p className="font-medium text-slate-900">{patient.lastVisit}</p>
                    </div>
                </div>
            </div>

            {/* Prescription History */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Prescription History ({patientPrescriptions.length})
                </h3>

                {patientPrescriptions.length > 0 ? (
                    <div className="space-y-4">
                        {patientPrescriptions.map((prescription) => (
                            <div
                                key={prescription.id}
                                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">{prescription.date}</span>
                                        </div>
                                        <p className="font-medium text-slate-900">{prescription.diagnosis}</p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-slate-100">
                                    <p className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                                        <Pill className="w-4 h-4" />
                                        Medicines ({prescription.medicines.length})
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {prescription.medicines.map((med, idx) => (
                                            <div key={idx} className="bg-slate-50 rounded px-3 py-2">
                                                <p className="font-medium text-sm text-slate-900">{med.drugName}</p>
                                                <p className="text-xs text-slate-500">
                                                    {med.dosage} • {med.frequency} • {med.duration}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-slate-500">
                        No prescription history found for this patient.
                    </p>
                )}
            </div>
        </div>
    );
};
