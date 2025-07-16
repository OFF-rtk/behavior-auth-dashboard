"use client";

import { useState } from "react";
import { getApiHealth } from "@/app/lib/data";

export default function HealthCheckPanel() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const { message } = await getApiHealth();
      setStatus(`✅ ${message}`);
    } catch {
      setStatus("❌ API is not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-md p-6 bg-white shadow-sm max-w-md">
      <h2 className="text-lg font-semibold">API Health Check</h2>
      <p className="text-sm text-gray-600">
        Sends a GET to the backend’s `/` endpoint
      </p>
      <button
        onClick={handleCheck}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Checking…" : "Check Status"}
      </button>
      {status && (
        <p
          className={`mt-2 text-sm font-medium ${
            status.startsWith("✅") ? "text-green-700" : "text-red-700"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
