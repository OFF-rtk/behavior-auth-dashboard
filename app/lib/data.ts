import { UserMeta, UserMetaArraySchema } from "./schemas/userMeta"
import {UserResponseSchema, type UserResponse, } from "./schemas/userSessions"
import { modelMeta, ModelMetaSchema } from "./schemas/modelMeta"
import { deviceProfile, deviceProfileSchema } from "./schemas/deviceProfile"

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchUsers(): Promise<UserMeta[]> {
  try {
    console.log("Fetching users directly from backend...");
    const res = await fetch("https://behavior-auth-api.onrender.com/all-users-meta", {
      cache: "no-store",
    });

    const rawData = await res.json();
    const parsed = UserMetaArraySchema.parse(rawData);

    return parsed.map((d: any) => ({
      ...d,
      last_trained_at: new Date(d.last_trained),
    }));
  } catch (error) {
    console.error("Fetching Users Error:", error);
    throw new Error("Failed to fetch session data");
  }
}

export async function fetchUserSession(user_id: string): Promise<UserResponse> {
  try {
    console.log("Fetching session data directly from backend...");
    const res = await fetch(`https://behavior-auth-api.onrender.com/session-data/${user_id}`, {
      cache: "no-store",
    });

    const json = await res.json();
    const parsed = UserResponseSchema.parse(json);

    return parsed;
  } catch (error) {
    console.error("Fetching Session Error:", error);
    throw new Error("Failed to fetch session data");
  }
}

export async function fetchModelMeta(user_id: string): Promise<modelMeta> {
  try {
    console.log("Fetching model metadata directly from backend...");
    const res = await fetch(`https://behavior-auth-api.onrender.com/model-meta/${user_id}`, {
      cache: "no-store",
    });

    const json = await res.json();
    const parsed = ModelMetaSchema.parse(json);

    return parsed;
  } catch (error) {
    console.error("Error fetching model metadata:", error);
    throw new Error("Failed to fetch model metadata");
  }
}

export async function fetchDeviceProfileServer(user_id: string): Promise<deviceProfile | null> {
  try {
    const res = await fetch(`https://behavior-auth-api.onrender.com/device-profile/${user_id}`, {
      method: "GET",
      cache: "no-store",
    });

    const json = await res.json();

    if (
      json.message?.includes("Device profile not found") ||
      !json.device_profile ||
      typeof json.device_profile !== "object"
    ) {
      return null;
    }

    return deviceProfileSchema.parse({
      user_id,
      device_profile: json.device_profile,
    });
  } catch (err) {
    console.error("fetchDeviceProfileServer error:", err);
    throw new Error("Failed to fetch device profile (server)");
  }
}



export async function fetchDeviceProfile(user_id: string): Promise<deviceProfile | null> {
  try {
    const res = await fetch(`/api/fetch-device-profile/${user_id}`, {
      method: "GET",
      cache: "no-store",
    });

    const json = await res.json();

    // Check for error message instead of blindly assuming it's a valid profile
    if (
      json.message?.includes("Device profile not found") ||
      !json.device_profile ||
      typeof json.device_profile !== "object"
    ) {
      return null; // Treat it as not stored
    }

    const parsed = deviceProfileSchema.parse({
      user_id,
      device_profile: json.device_profile,
    });

    return parsed;
  } catch (err) {
    console.error("fetchDeviceProfile (proxy) error:", err);
    throw new Error("Failed to fetch device profile");
  }
}





export async function storeDeviceProfile(
  userId: string,
  profile: unknown
): Promise<{ message: string }> {
  const res = await fetch(`/api/store-device-profile/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Failed to store profile");
  return res.json();
}

export async function getApiHealth(): Promise<{ message: string }> {
  const res = await fetch("/api/get-health", { method: "GET" });
  if (!res.ok) throw new Error("API unreachable");
  return res.json();
}

export async function injectInitialContext(userId: string, firstSnapshot: any) {
  const res = await fetch(`/api/predict/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(firstSnapshot),
  });

  if (!res.ok) throw new Error("Failed to inject initial context");
  return res.json();
}

export async function predictSnapshot(userId: string, snapshot: any) {
  const res = await fetch(`/api/predict/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snapshot),
  });

  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}



export async function postEndSession(userId: string, payload: { user_id: string, snapshots: any[] }) {
  const res = await fetch(`/api/post-end-session/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("End session failed:", errorText);
    throw new Error("Failed to send session data");
  }

  return res.json();
}

export async function resetUserData(userId: string) {
  const res = await fetch(`/api/reset-user-data/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Reset user data failed:", errorText);
    throw new Error("Failed to reset user data");
  }

  return res.json(); // Return parsed result if needed
}
