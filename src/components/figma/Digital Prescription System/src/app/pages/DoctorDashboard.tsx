import React, { useState } from 'react';
import { Plus, X, Download, Printer } from 'lucide-react';
import { useApp, Medicine, Prescription } from '../context/AppContext';
import { MedicineSearch } from '../components/MedicineSearch';
import { generatePrescriptionPDF } from '../utils/pdfGenerator';

export const DoctorDashboard = () => {
  const { addPrescription, patients, doctorSettings } = useApp();

  // Patient Details
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Prescription
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const addMedicine = () => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      drugName: '',
      dosage: '',
      frequency: 'Once daily',
      duration: '7 days',
      instructions: 'Take after meals',
    };
    setMedicines([...medicines, newMedicine]);
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    setMedicines(
      medicines.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const handleClearForm = () => {
    setPatientName('');
    setAge('');
    setGender('Male');
    setDate(new Date().toISOString().split('T')[0]);
    setDiagnosis('');
    setMedicines([]);
  };

  const handleSaveAndPrint = () => {
    if (!patientName || !age || !diagnosis || medicines.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    const prescription: Prescription = {
      id: Date.now().toString(),
      patientId: Date.now().toString(),
      patientName,
      age: parseInt(age),
      gender,
      date,
      diagnosis,
      medicines,
    };

    addPrescription(prescription);
    alert('Prescription saved successfully!');

    // Auto-print after saving
    setTimeout(() => window.print(), 500);
    handleClearForm();
  };

  const handleDownloadPDF = () => {
    if (!patientName || !age || !diagnosis || medicines.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    const prescription: Prescription = {
      id: Date.now().toString(),
      patientId: Date.now().toString(),
      patientName,
      age: parseInt(age),
      gender,
      date,
      diagnosis,
      medicines,
    };

    generatePrescriptionPDF(prescription, doctorSettings);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side - Forms */}
      <div className="lg:col-span-2 space-y-6">
        {/* Patient Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Prescription Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Prescription</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Diagnosis *
            </label>
            <select
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            >
              <option value="">Select diagnosis</option>
              <option>Hypertension</option>
              <option>Type 2 Diabetes</option>
              <option>Upper Respiratory Tract Infection</option>
              <option>Acute Bronchitis</option>
              <option>Gastroesophageal Reflux Disease</option>
              <option>Urinary Tract Infection</option>
              <option>Migraine</option>
              <option>Arthritis</option>
            </select>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-900">Medicines</h4>
            <button
              onClick={addMedicine}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </button>
          </div>

          <div className="space-y-4">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="bg-slate-50 border border-slate-200 rounded-lg p-4 relative"
              >
                <button
                  onClick={() => removeMedicine(medicine.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Drug Name *
                    </label>
                    <MedicineSearch
                      value={medicine.drugName}
                      onChange={(value) => updateMedicine(medicine.id, 'drugName', value)}
                      onSelect={(selected) => {
                        updateMedicine(medicine.id, 'drugName', selected.name);
                        // Auto-fill first strength if available
                        if (selected.strengths.length > 0) {
                          updateMedicine(medicine.id, 'dosage', selected.strengths[0]);
                        }
                      }}
                      placeholder="Search drug name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) =>
                        updateMedicine(medicine.id, 'dosage', e.target.value)
                      }
                      placeholder="e.g., 500mg"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Frequency *
                    </label>
                    <select
                      value={medicine.frequency}
                      onChange={(e) =>
                        updateMedicine(medicine.id, 'frequency', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
                    >
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Three times daily</option>
                      <option>Four times daily</option>
                      <option>As needed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Duration *
                    </label>
                    <select
                      value={medicine.duration}
                      onChange={(e) =>
                        updateMedicine(medicine.id, 'duration', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
                    >
                      <option>3 days</option>
                      <option>5 days</option>
                      <option>7 days</option>
                      <option>14 days</option>
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Instructions *
                    </label>
                    <select
                      value={medicine.instructions}
                      onChange={(e) =>
                        updateMedicine(medicine.id, 'instructions', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
                    >
                      <option>Take after meals</option>
                      <option>Take before meals</option>
                      <option>Take with food</option>
                      <option>Take on empty stomach</option>
                      <option>Take at bedtime</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {medicines.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No medicines added. Click "Add Medicine" to start.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleClearForm}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium"
          >
            Clear Form
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3 border border-cyan-600 text-cyan-600 rounded-md hover:bg-cyan-50 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={handleSaveAndPrint}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-medium"
          >
            <Printer className="w-4 h-4" />
            Save & Print
          </button>
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Prescription Preview</h3>
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <p className="text-sm text-slate-600 mb-1">Patient</p>
              <p className="font-medium text-slate-900">{patientName || '-'}</p>
              <p className="text-sm text-slate-600">
                {age && gender ? `${age} years, ${gender}` : '-'}
              </p>
              <p className="text-sm text-slate-600">{date || '-'}</p>
            </div>

            <div className="border-b border-slate-200 pb-3">
              <p className="text-sm text-slate-600 mb-1">Diagnosis</p>
              <p className="font-medium text-slate-900">{diagnosis || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600 mb-2">Medicines</p>
              {medicines.length > 0 ? (
                <div className="space-y-3">
                  {medicines.map((medicine, index) => (
                    <div key={medicine.id} className="bg-slate-50 rounded-md p-3">
                      <p className="font-medium text-slate-900 text-sm mb-1">
                        {index + 1}. {medicine.drugName || 'Medicine name'}
                      </p>
                      <p className="text-xs text-slate-600">
                        {medicine.dosage || '-'} | {medicine.frequency || '-'}
                      </p>
                      <p className="text-xs text-slate-600">
                        Duration: {medicine.duration || '-'}
                      </p>
                      <p className="text-xs text-slate-600">
                        {medicine.instructions || '-'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No medicines added</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
