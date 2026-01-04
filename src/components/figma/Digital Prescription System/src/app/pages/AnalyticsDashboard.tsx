import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp, Users, Calendar, Pill } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsDashboard = () => {
  const { prescriptions, patients } = useApp();
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'all'>('all');

  // Filter prescriptions by date range
  const filteredPrescriptions = useMemo(() => {
    if (dateRange === 'all') return prescriptions;

    const now = new Date();
    const daysAgo = dateRange === '7days' ? 7 : 30;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    return prescriptions.filter(p => new Date(p.date) >= cutoffDate);
  }, [prescriptions, dateRange]);

  // Calculate statistics
  const totalPrescriptions = filteredPrescriptions.length;
  const totalPatients = patients.length;

  // Top diagnoses data
  const topDiagnosesData = useMemo(() => {
    const diagnosisCount = filteredPrescriptions.reduce((acc, prescription) => {
      acc[prescription.diagnosis] = (acc[prescription.diagnosis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(diagnosisCount)
      .map(([name, count]) => ({ name: name.length > 15 ? name.substring(0, 15) + '...' : name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredPrescriptions]);

  // Top medicines data
  const topMedicinesData = useMemo(() => {
    const medicineCount: Record<string, number> = {};
    filteredPrescriptions.forEach(p => {
      p.medicines.forEach(med => {
        medicineCount[med.drugName] = (medicineCount[med.drugName] || 0) + 1;
      });
    });

    return Object.entries(medicineCount)
      .map(([name, count]) => ({ name: name.length > 12 ? name.substring(0, 12) + '...' : name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredPrescriptions]);

  // Gender distribution
  const genderData = useMemo(() => {
    const genderCount = filteredPrescriptions.reduce((acc, p) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(genderCount).map(([name, value]) => ({ name, value }));
  }, [filteredPrescriptions]);

  const COLORS = ['#0e7490', '#22d3ee', '#f472b6'];

  // Patient trends by day of week
  const patientTrendsData = useMemo(() => {
    const dayCount: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    filteredPrescriptions.forEach(p => {
      const dayName = new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (dayCount[dayName] !== undefined) {
        dayCount[dayName]++;
      }
    });
    return Object.entries(dayCount).map(([day, patients]) => ({ day, patients }));
  }, [filteredPrescriptions]);

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <Calendar className="w-5 h-5 text-slate-500" />
        <span className="text-sm text-slate-600 font-medium">Filter by:</span>
        <div className="flex gap-2">
          {(['7days', '30days', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRange === range
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm mb-1">Total Prescriptions</p>
              <p className="text-4xl font-bold">{totalPrescriptions}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <FileText className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-slate-900">{totalPatients}</p>
            </div>
            <Users className="w-8 h-8 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Unique Diagnoses</p>
              <p className="text-3xl font-bold text-slate-900">{topDiagnosesData.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Medicines Prescribed</p>
              <p className="text-3xl font-bold text-slate-900">{topMedicinesData.reduce((sum, m) => sum + m.count, 0)}</p>
            </div>
            <Pill className="w-8 h-8 text-cyan-600" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Diagnoses */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Diagnoses</h3>
          {topDiagnosesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDiagnosesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#0e7490" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">No data available</div>
          )}
        </div>

        {/* Top Medicines */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Prescribed Medicines</h3>
          {topMedicinesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMedicinesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">No data available</div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Prescriptions by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={patientTrendsData}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e7490" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0e7490" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="patients" stroke="#0e7490" fillOpacity={1} fill="url(#colorPatients)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Patient Demographics</h3>
          {genderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

