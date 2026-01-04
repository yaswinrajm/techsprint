import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DiseaseChart({ data }) {
    if (!data || data.length === 0) {
        return <div className="text-center text-slate-400 py-10">No diagnosis data available</div>;
    }

    const COLORS = ['#0ea5e9', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe'];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={100}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
