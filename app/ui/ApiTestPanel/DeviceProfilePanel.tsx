"use client";

import { useEffect, useState } from "react";
import { useSelectedUser } from "@/app/lib/context/SelectedUserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storeDeviceProfile, fetchDeviceProfile } from "@/app/lib/data";

export default function DeviceProfilePanel() {
  const { userId, setUserId } = useSelectedUser();
  const [deviceProfile, setDeviceProfile] = useState<any>(null);
  const [isStored, setIsStored] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setDeviceProfile(null);
      setIsStored(false);
      return;
    }

    setLoading(true);

    fetchDeviceProfile(userId)
      .then((profile) => {
        if (profile?.device_profile) {
          setDeviceProfile(profile.device_profile);
          setIsStored(true); // ✅ Backend profile exists
        } else {
          throw new Error("Profile not stored");
        }
      })
      .catch(async () => {
        // 🧩 Fallback to static JSON
        try {
          const baseId = userId.replace("_test", "");
          const res = await fetch(`/device-profiles/${baseId}.json`);
          if (!res.ok) throw new Error("Static profile not found");

          const staticProfile = await res.json();
          setDeviceProfile(staticProfile);
          setIsStored(false); // 🟢 Enable store button
        } catch (staticErr) {
          console.error("Static fallback failed:", staticErr);
          setDeviceProfile(null);
          setIsStored(false);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
  };

  const handleStoreProfile = async () => {
    if (!userId) return;

    try {
      const baseId = userId.replace("_test", "");
      const res = await fetch(`/device-profiles/${baseId}.json`);
      if (!res.ok) throw new Error("Static device profile not found");
      const profile = await res.json();

      const result = await storeDeviceProfile(userId, profile);
      toast.success(result.message || "Device profile stored successfully");

      // Re-fetch from backend to confirm
      const updated = await fetchDeviceProfile(userId);
      if (updated?.device_profile) {
        setDeviceProfile(updated.device_profile);
        setIsStored(true); // ✅ Profile now stored
      } else {
        setDeviceProfile(null);
        setIsStored(false);
      }
    } catch (err) {
      toast.error("Error storing device profile");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 border rounded-md p-6 bg-white shadow-sm">
      <h2 className="text-lg font-semibold">Device Profile Setup</h2>
      <p className="text-sm text-gray-600">
        Sends a POST to <code>/store-device-profile/{`{userId}`}</code> with the device profile JSON
      </p>

      {/* User Dropdown */}
      <div className="relative w-full max-w-sm">
        <select
          value={userId || ""}
          onChange={handleUserChange}
          className="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-10 text-base text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>
            Select a user
          </option>
          {Array.from({ length: 10 }).map((_, i) => {
            const id = `s00${i + 1}_test`;
            return (
              <option key={id} value={id}>
                {id}
              </option>
            );
          })}
        </select>
      </div>

      {/* Status Text */}
      {!loading && userId && (
        <p
          className={`text-sm font-medium ${
            isStored ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {isStored ? (
            <>
              ✅ Device profile stored for{" "}
              <span className="font-mono">{userId}</span>.
            </>
          ) : (
            <>
              ⚠️ Device profile not stored. Ready to upload fallback for{" "}
              <span className="font-mono">{userId}</span>.
            </>
          )}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-sm text-gray-500">Loading device profile...</p>
      )}

      {/* Profile Display */}
      {deviceProfile && (
        <div className="bg-gray-100 border p-4 rounded font-mono overflow-y-auto max-h-64 text-sm">
          <pre>{JSON.stringify(deviceProfile, null, 2)}</pre>
        </div>
      )}

      {/* Store Button */}
      <button
        onClick={handleStoreProfile}
        disabled={!userId || isStored}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${
          !userId || isStored
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Store Device Profile
      </button>
    </div>
  );
}
