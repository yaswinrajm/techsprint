import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientTrendsChart({ data }) {
    // Mocking trend data for now based on available prescriptions, 
    // as we might not have enough historical data in the "demo".
    // In a real app, this would aggregate by date.

    // Fallback if no real trend data
    const chartData = data && data.length > 0 ? data : [
        { date: 'Mon', patients: 4 },
        { date: 'Tue', patients: 3 },
        { date: 'Wed', patients: 7 },
        { date: 'Thu', patients: 2 },
        { date: 'Fri', patients: 6 },
        { date: 'Sat', patients: 8 },
        { date: 'Sun', patients: 5 },
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0e7490" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0e7490" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="patients"
                        stroke="#0e7490"
                        fillOpacity={1}
                        fill="url(#colorPatients)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
