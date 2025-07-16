export function transformSessionUserIds(data: any, userId: string) {
  if (!Array.isArray(data)) {
    console.warn("Expected data to be an array of sessions.");
    return [];
  }

  return data.map((session: any, i: number) => {
    if (!Array.isArray(session.snapshots)) {
      console.warn(`⚠️ No snapshots in session[${i}]. Skipping...`);
      return session;
    }

    const updatedSnapshots = session.snapshots.map((snapshot: any) => ({
      ...snapshot,
      user_id: userId,
    }));

    return {
      ...session,
      snapshots: updatedSnapshots,
    };
  });
}
