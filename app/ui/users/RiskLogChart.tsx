"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { lusitana } from "../fonts";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { UserSession } from "@/app/lib/schemas/userSessions";
import { useState } from 'react';

const METRICS = {
    risk: 'Risk Score',
    geo_shift_score: 'Geo Shift Score',
    network_shift_score: 'Network Shift Score',
    device_mismatch_score: 'Device Mismatch Score',
} as const

const METRIC_COLORS: Record<string, string> = {
  risk: '#ef4444',
  geo_shift_score: '#22c55e',
  network_shift_score: '#3b82f6',
  device_mismatch_score: '#f59e0b',
};

type MetricKey = keyof typeof METRICS;

export default function RiskLogChart({ riskLog } : { riskLog: UserSession["risk_log"] }) {
    const [selectedMetric, setSelectedMetric] = useState<MetricKey>('risk');
    const chartHeight = 350;
    
    const entries = riskLog.slice(-10).map((entry, idx) => ({
        time: new Date(entry.timestamp).toLocaleTimeString(),
        risk: entry.risk,
        geo_shift_score: entry.geo_shift_score,
        network_shift_score: entry.network_shift_score,
        device_mismatch_score: entry.device_mismatch_score
    }));

    if(!entries.length) {
        return (
            <div className="rounded-xl bg-gray-50 p-4 text-gray-400 text-center h-[350px] flex items-center justify-center">
                No risk log entries available.
            </div>
        );
    }


    return (
        <div className="w-full md:col-span-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                    {METRICS[selectedMetric]} (Last 10 Entries)
                </h2>

                <select
                    value={selectedMetric}
                    onChange={(e)=>setSelectedMetric(e.target.value as MetricKey)}
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm focus:outline-none focus:right-1 focus:right-blue-500"
                >
                    {Object.entries(METRICS).map(([key, label]) => (
                        <option key={key} value={key} className='text-black'>{label}</option>
                    ))}
                </select>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="rounded-md bg-white p-4">
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <LineChart data={entries}>
                            <XAxis dataKey="time" tick={{
                                fontSize: 12,
                                className: "text-[10px] md:text-xs", 
                                }} 
                            />
                            <YAxis tick={{ fontSize: 12 }} domain={[0, 'dataMax + 20']} />
                            <Tooltip
                                formatter={(value: number) => value.toFixed(2)}
                                contentStyle={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
                                labelStyle={{ color: '#6b7280' }}
                                itemStyle={{ color: METRIC_COLORS[selectedMetric]}}
                            />
                            <Line
                                type="monotone"
                                dataKey={selectedMetric}
                                stroke={METRIC_COLORS[selectedMetric]}
                                strokeWidth={2}
                                dot={{ fill: METRIC_COLORS[selectedMetric], r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h=5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500">Last 10 {METRICS[selectedMetric].toLowerCase()}</h3>
                </div>
            </div>
        </div>
    )
}