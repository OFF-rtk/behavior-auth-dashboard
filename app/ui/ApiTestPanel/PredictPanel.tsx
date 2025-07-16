"use client";

import { useEffect, useState, useRef } from "react";
import { useSelectedUser } from "@/app/lib/context/SelectedUserContext";
import { toast } from "react-toastify";
import { injectInitialContext, predictSnapshot } from "@/app/lib/data";
import {
  ExclamationTriangleIcon,
  GlobeAltIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

interface Snapshot {
  user_id: string;
  [key: string]: any;
}

interface Session {
  session_id: number;
  snapshots: Snapshot[];
}

interface RiskResponse {
  user_id: string;
  risk_score: number;
  geo_shift_score: number;
  network_shift_score: number;
  device_mismatch_score: number;
}

export default function PredictPanel() {
  const { userId } = useSelectedUser();
  const [mode, setMode] = useState<"normal-user" | "attacker" | "bot">("normal-user");
  const [sessions, setSessions] = useState<Session[] | Snapshot[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<Snapshot | null>(null);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(1);
  const [riskResult, setRiskResult] = useState<RiskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const hasInjectedRef = useRef(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const snapshotRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    // Reset state on mode switch
    setSessions([]);
    setCurrentSnapshot(null);
    setCurrentSnapshotIndex(mode === "normal-user" ? 1 : 0);
    setCurrentSessionIndex(0);
    setRiskResult(null);
    setHasLoaded(false);
  }, [mode]);


  const scrollToSnapshot = () => {
    if (snapshotRef.current) {
      snapshotRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  const handleLoadSnapshot = async () => {
    if (!userId) return toast.error("Select a user first");

    try {
      const baseId = userId.replace("_test", "");
      const modePath =
        mode === "normal-user"
          ? `/normal-users/${baseId}.json`
          : mode === "attacker"
          ? `/attackers/${baseId}.json`
          : `/bots/${baseId}.json`;

      const modeRes = await fetch(modePath);
      const modeData = await modeRes.json();

      // Inject initial context only once
      if (!hasInjectedRef.current) {
        const normalRes = await fetch(`/normal-users/${baseId}.json`);
        const normalData: Session[] = await normalRes.json();
        const firstContext = normalData?.[0]?.snapshots?.[0];

        if (!firstContext) return toast.error("Missing initial context snapshot");

        await injectInitialContext(userId, { ...firstContext, user_id: userId });
        hasInjectedRef.current = true;
        toast.success("Initial context injected");
      }

      if (mode === "normal-user") {
        const patched = (modeData as Session[]).map((s) => ({
          ...s,
          snapshots: s.snapshots.map((snap) => ({ ...snap, user_id: userId })),
        }));
        setSessions(patched);
        setCurrentSnapshot(patched[0]?.snapshots?.[1] || null);
        setCurrentSessionIndex(0);
        setCurrentSnapshotIndex(1);
      } else {
        const patched = (modeData as Snapshot[]).map((s) => ({ ...s, user_id: userId }));
        setSessions(patched);
        setCurrentSnapshot(patched[0] || null);
        setCurrentSnapshotIndex(0);
      }

      setHasLoaded(true);
      toast.success("Snapshot loaded");
      setTimeout(scrollToSnapshot, 100); 
    } catch (err) {
      console.error("Failed to load snapshot", err);
      toast.error("Snapshot load failed");
    }
  };

  const handleSubmit = async () => {
    if (!userId || !currentSnapshot) return toast.error("Nothing to predict");

    try {
      setLoading(true);
      const result = await predictSnapshot(userId, currentSnapshot);
      setRiskResult(result);
      toast.success("Prediction successful");

      if (mode === "normal-user") {
        const session = sessions[currentSessionIndex] as Session;
        const nextIdx = currentSnapshotIndex + 1;

        if (nextIdx < session.snapshots.length) {
          setCurrentSnapshotIndex(nextIdx);
          setCurrentSnapshot(session.snapshots[nextIdx]);
        } else if (currentSessionIndex + 1 < (sessions as Session[]).length) {
          const nextSession = sessions[currentSessionIndex + 1] as Session;
          setCurrentSessionIndex(currentSessionIndex + 1);
          setCurrentSnapshotIndex(0);
          setCurrentSnapshot(nextSession.snapshots[0]);
        } else {
          setCurrentSnapshot(null);
          toast.info("✅ All sessions completed");
        }
      } else {
        const nextIdx = currentSnapshotIndex + 1;
        if (nextIdx < (sessions as Snapshot[]).length) {
          setCurrentSnapshotIndex(nextIdx);
          setCurrentSnapshot((sessions as Snapshot[])[nextIdx]);
        } else {
          setCurrentSnapshot(null);
          toast.info("✅ All snapshots completed");
        }
      }
    } catch (err) {
      console.error("Prediction error", err);
      toast.error("Failed to predict");
    } finally {
      setLoading(false);
    }
  };

  const risks = [
    { name: "Total Risk Score", value: riskResult?.risk_score, icon: ExclamationTriangleIcon, color: "text-red-600" },
    { name: "Geo Shift Score", value: riskResult?.geo_shift_score, icon: GlobeAltIcon, color: "text-blue-500" },
    { name: "Network Shift Score", value: riskResult?.network_shift_score, icon: WifiIcon, color: "text-purple-500" },
    { name: "Device Mismatch Score", value: riskResult?.device_mismatch_score, icon: DevicePhoneMobileIcon, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6 border rounded-md p-6 bg-white shadow-sm mt-8">
      <h2 className="text-lg font-semibold">Predict Risk</h2>
      <p className="text-sm text-gray-600">
        POSTs snapshot data to backend `/predict` endpoint for <code>{userId}</code>.
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-1 mr-3">
          <label className="text-sm font-medium">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="border px-3 py-2 rounded w-48"
          >
            <option value="normal-user">Normal User</option>
            <option value="attacker">Attacker</option>
            <option value="bot">Bot</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleLoadSnapshot}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Load Snapshot
          </button>

          <button
            onClick={handleSubmit}
            disabled={!currentSnapshot || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Submit Snapshot
          </button>
        </div>
      </div>

      {/* Snapshot JSON Preview */}
      {hasLoaded && currentSnapshot && (
        <div 
            ref={snapshotRef}
            className="bg-gray-100 border text-sm p-4 rounded font-mono overflow-x-auto max-h-96"
        >
          <pre>{JSON.stringify(currentSnapshot, null, 2)}</pre>
        </div>
      )}

      {/* Risk Breakdown */}
      {riskResult && (
        <ul className="space-y-3 mt-4">
          {risks.map((risk) => (
            <li key={risk.name} className="flex items-center space-x-3">
              <risk.icon className={`h-5 w-5 ${risk.color}`} />
              <span className="font-medium">{risk.name}:</span>
              <span className="text-gray-700">
                {typeof risk.value === "number" ? risk.value.toFixed(2) : "N/A"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
