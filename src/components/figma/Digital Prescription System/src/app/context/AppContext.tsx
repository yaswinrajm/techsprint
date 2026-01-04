import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Medicine {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
}

export interface DoctorSettings {
  name: string;
  qualification: string;
  clinicName: string;
  phone: string;
  address: string;
  logoUrl: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  doctorSettings: DoctorSettings;
  updateDoctorSettings: (settings: DoctorSettings) => void;
  prescriptions: Prescription[];
  addPrescription: (prescription: Prescription) => void;
  patients: Patient[];
  currentPrescription: Partial<Prescription> | null;
  setCurrentPrescription: (prescription: Partial<Prescription> | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Mock data
const mockPatients: Patient[] = [
  { id: '1', name: 'John Smith', age: 45, gender: 'Male', lastVisit: '2026-01-02' },
  { id: '2', name: 'Emma Johnson', age: 32, gender: 'Female', lastVisit: '2026-01-03' },
  { id: '3', name: 'Michael Brown', age: 58, gender: 'Male', lastVisit: '2026-01-01' },
  { id: '4', name: 'Sarah Davis', age: 27, gender: 'Female', lastVisit: '2026-01-04' },
  { id: '5', name: 'Robert Wilson', age: 61, gender: 'Male', lastVisit: '2025-12-30' },
];

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    age: 45,
    gender: 'Male',
    date: '2026-01-02',
    diagnosis: 'Hypertension',
    medicines: [
      {
        id: '1',
        drugName: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning',
      },
    ],
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Emma Johnson',
    age: 32,
    gender: 'Female',
    date: '2026-01-03',
    diagnosis: 'Upper Respiratory Tract Infection',
    medicines: [
      {
        id: '1',
        drugName: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        instructions: 'Take after meals',
      },
    ],
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Load initial state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('isAuthenticated');
    return stored === 'true';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('isDarkMode');
    if (stored) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const stored = localStorage.getItem('prescriptions');
    return stored ? JSON.parse(stored) : mockPrescriptions;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : mockPatients;
  });

  const [currentPrescription, setCurrentPrescription] = useState<Partial<Prescription> | null>(null);

  const [doctorSettings, setDoctorSettings] = useState<DoctorSettings>(() => {
    const stored = localStorage.getItem('clinicSettings');
    return stored ? JSON.parse(stored) : {
      name: 'Dr. Sarah Anderson',
      qualification: 'MBBS, MD (Internal Medicine)',
      clinicName: 'MediScript Health Center',
      phone: '+1 (555) 123-4567',
      address: '123 Medical Plaza, Suite 200\nHealthville, CA 90210',
      logoUrl: '',
    };
  });

  // Apply dark mode class to document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  // Persist auth state
  React.useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  // Persist prescriptions
  React.useEffect(() => {
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const updateDoctorSettings = (settings: DoctorSettings) => {
    setDoctorSettings(settings);
    localStorage.setItem('clinicSettings', JSON.stringify(settings));
    // Dispatch event for other components to update
    window.dispatchEvent(new Event('clinicSettingsUpdated'));
  };

  const addPrescription = (prescription: Prescription) => {
    setPrescriptions((prev) => [prescription, ...prev]);

    // Also update patients list with new patient if not exists
    const existingPatient = patients.find(p => p.name.toLowerCase() === prescription.patientName.toLowerCase());
    if (!existingPatient) {
      const newPatient: Patient = {
        id: prescription.patientId,
        name: prescription.patientName,
        age: prescription.age,
        gender: prescription.gender,
        lastVisit: prescription.date,
      };
      const updatedPatients = [newPatient, ...patients];
      setPatients(updatedPatients);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isDarkMode,
        toggleDarkMode,
        doctorSettings,
        updateDoctorSettings,
        prescriptions,
        addPrescription,
        patients,
        currentPrescription,
        setCurrentPrescription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
