"use server";

import { getUserToken } from "./session";

const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

export const authHeader = async () => {
  const token = await getUserToken();
  const header = {
    Authorization: `Bearer ${token}`,
  };
  return token ? header : {};
};

export const serverFetch = async (path) => {
  try {
    const res = await fetch(`${baseurl}${path}`);

    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Server fetch runtime error:", error);
    return null;
  }
};

export const protectedFetch = async (path) => {
  try {
    const res = await fetch(`${baseurl}${path}`, {
      headers: await authHeader(),
    });

    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Server fetch runtime error:", error);
    return null;
  }
};

export const serverMutation = async (path, data) => {
  const res = await fetch(`${baseurl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  console.log("URL:", `${baseurl}${path}`);
  console.log("Status:", res.status);

  const text = await res.text();

  console.log("Response:", text);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Expected JSON but got: ${text.slice(0, 100)}`);
  }
};
