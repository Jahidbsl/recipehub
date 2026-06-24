export const getAllReports = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/admin/reports`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reports: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getAllReports api wrapper:", error);
    return [];
  }
};