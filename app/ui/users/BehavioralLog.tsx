"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { lusitana } from "../fonts";
import { CalendarIcon } from "@heroicons/react/24/outline";

const METRICS = {
  tap_duration: "Tap Duration",
  inter_key_delay_avg: "Inter Key Delay Average",
  key_press_duration_avg: "Key Press Duration Average",
  typing_error_rate: "Typing Error Rate",
  swipe_speed: "Swipe Speed",
  swipe_angle: "Swipe Angle",
  scroll_distance: "Scroll Distance",
  scroll_velocity: "Scroll Velocity",
  gyro_variance: "Gyro Variance",
  accelerometer_noise: "Accelerometer Noise",
  session_duration_sec: "Session Duration Seconds",
  screen_transition_count: "Screen Transition Counts",
  avg_dwell_time_per_screen: "Average Dwell Time Per Screen",
} as const;

const METRIC_COLORS: Record<string, string> = {
  tap_duration: "#EF4444",
  inter_key_delay_avg: "#F97316",
  key_press_duration_avg: "#EAB308",
  typing_error_rate: "#22C55E",
  swipe_speed: "#10B981",
  swipe_angle: "#06B6D4",
  scroll_distance: "#3B82F6",
  scroll_velocity: "#6366F1",
  gyro_variance: "#8B5CF6",
  accelerometer_noise: "#EC4899",
  session_duration_sec: "#14B8A6",
  screen_transition_count: "#A855F7",
  avg_dwell_time_per_screen: "#F43F5E",
};

type MetricKey = keyof typeof METRICS;

export default function BehavioralLog({
  sessions,
}: {
  sessions: { filename: string; snapshots: any[] }[];
}) {
  const [selectedSession, setSelectedSession] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("tap_duration");
  const chartHeight = 350;

  const snapshots = sessions[selectedSession]?.snapshots ?? [];

  const entries = snapshots.map((entry, idx) => ({
    index: idx + 1,
    ...entry,
  }));

  const getYAxisDomain = () => {
    const values = entries.map((e) => e[selectedMetric]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    switch (selectedMetric) {
      case "typing_error_rate":
        return [0, 1];
      case "gyro_variance":
        return [0, 0.05];
      case "swipe_speed":
        return [0, Math.max(12000, max + 1000)];
      default: {
        const pad = (max - min) * 0.2 || 10;
        return [Math.max(0, min - pad), max + pad];
      }
    }
  };

  return (
    <div className="w-full md:col-span-4">
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <h2 className={`${lusitana.className} text-xl md:text-2xl`}>
          {METRICS[selectedMetric]} for{" "}
          <span className="text-blue-600">
            {sessions[selectedSession]?.filename || "Session"}
          </span>
        </h2>

        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(Number(e.target.value))}
            className="max-w-[140px] w-40 truncate rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm focus:outline-none"
          >
            {[...sessions]
            .map((s, i) => ({ ...s, index: i }))
            .sort((a, b) => {
                const getNumber = (filename: string) => {
                const match = filename.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
                };
                return getNumber(a.filename) - getNumber(b.filename);
            })
            .map((s) => (
                <option key={s.filename} value={s.index}>
                {s.filename}
                </option>
            ))}
          </select>

          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricKey)}
            className="max-w-[180px] truncate rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700"
          >
            {Object.entries(METRICS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="rounded-md bg-white p-4">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={entries}>
              <XAxis dataKey="index" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={getYAxisDomain()} />
              <Tooltip
                formatter={(value: number) => value.toFixed(6)}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderColor: "#e5e7eb",
                }}
                labelStyle={{ color: "#6b7280" }}
                itemStyle={{ color: METRIC_COLORS[selectedMetric] }}
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
          <h3 className="ml-2 text-sm text-gray-500">
            All entries for selected session
          </h3>
        </div>
      </div>
    </div>
  );
}
