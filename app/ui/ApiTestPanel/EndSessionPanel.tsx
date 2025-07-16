"use client";

import { transformSessionUserIds } from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { useSelectedUser } from "@/app/lib/context/SelectedUserContext";
import { postEndSession } from "@/app/lib/data";
import { toast } from "react-toastify";

export default function EndSessionPanel() {
  const { userId } = useSelectedUser();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadFile = async () => {
      if (!userId) return;
      const baseId = userId.replace("_test", "");
      try {
        const res = await fetch(`/normal-users/${baseId}.json`);
        if (!res.ok) throw new Error("Session file not found");
        const data = await res.json();

        const updated = transformSessionUserIds(data, userId);
        setSessionData(updated);
      } catch (err) {
        console.error("Failed to load session file:", err);
        setSessionData(null);
      }
    };

    loadFile();
  }, [userId]);

  const handleSubmit = async () => {
    if (!userId || !sessionData) return;

    try {
      setIsUploading(true); // ⏳ Show modal
      for (let i = 0; i < sessionData.length; i++) {
        const session = sessionData[i];
        const payload = {
          user_id: userId,
          snapshots: session.snapshots,
        };

        console.log(`🔁 Sending session ${i + 1}...`);
        await postEndSession(userId, payload);
        await new Promise((r) => setTimeout(r, 2000));
      }

      toast.success(`All sessions for ${userId} submitted`);
    } catch (err) {
      console.error("❌ Error submitting sessions:", err);
      toast.error("Failed to post one or more sessions");
    } finally {
      setIsUploading(false); // ✅ Hide modal
    }
  };

  return (
    <div className="space-y-6 border rounded-md p-6 bg-white shadow-sm relative">

      {/* 🔵 Fullscreen Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg space-y-3">
            <svg
              className="h-8 w-8 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-sm text-gray-700 font-medium">
              Uploading sessions and training model...
            </p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold">Post End Session Data</h2>
      <p className="text-sm text-gray-600">
        Sends a POST request with the sessional JSON below to the /end-session endpoint. Model training and Session Data storing might take a few minutes to complete. Please only send this data once for this user it's stored in the backend and would not be removed on reloading the site.
      </p>

      {sessionData && (
        <div className="bg-gray-100 border p-4 rounded font-mono overflow-y-auto max-h-96 text-sm">
          <pre>{JSON.stringify(sessionData.slice(0, 1), null, 2)}</pre>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!userId || !sessionData}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${
          !userId || !sessionData
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Submit Session Data
      </button>
    </div>
  );
}
