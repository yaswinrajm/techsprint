import React, { useState, Suspense, lazy } from 'react';
import { getAnalyticsData } from '../../utils/storage';

// Lazy load heavy components for better initial load performance
const DiseaseMap = lazy(() => import('../map/DiseaseMap'));
const DiseaseChart = lazy(() => import('./DiseaseChart'));
const PatientTrendsChart = lazy(() => import('./PatientTrendsChart'));

// Loading skeleton component
const ChartSkeleton = () => (
    <div className="animate-pulse flex flex-col items-center justify-center h-full">
        <div className="w-3/4 h-4 bg-slate-200 rounded mb-4"></div>
        <div className="w-full h-48 bg-slate-100 rounded"></div>
    </div>
);

export default function AnalyticsDashboard() {
    const [data] = useState(() => getAnalyticsData());

    return (
        <div className="container main-content" style={{ marginTop: '2rem' }}>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Analytics Dashboard</h2>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card bg-white p-6 shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-2">Total Prescriptions</h3>
                    <p className="text-4xl font-bold text-cyan-700">{data.totalPrescriptions}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Disease Trends */}
                <div className="card p-6 h-96">
                    <h3 className="text-lg font-bold mb-4 text-slate-700">Top Diagnoses</h3>
                    <Suspense fallback={<ChartSkeleton />}>
                        <DiseaseChart data={data.diseaseTrends} />
                    </Suspense>
                </div>

                {/* Patient Trends */}
                <div className="card p-6 h-96">
                    <h3 className="text-lg font-bold mb-4 text-slate-700">Patient Trends (Last 7 Days)</h3>
                    <Suspense fallback={<ChartSkeleton />}>
                        <PatientTrendsChart data={data.patientTrends} />
                    </Suspense>
                </div>
            </div>

            {/* Disease Map */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Regional Disease Hotspots</h3>
                <Suspense fallback={<div className="h-96 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading map...</div>}>
                    <DiseaseMap />
                </Suspense>
            </div>
        </div>
    );
}

