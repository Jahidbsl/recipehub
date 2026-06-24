import { authHeader } from "../core/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getUsers = async () => {
  const res = await fetch(`${BACKEND_URL}/api/users`, {
    headers: await authHeader()
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const patchUserBlockStatus = async (userId, shouldBlock) => {
  // এখানে হেডার্স অবজেক্টটি একদম ক্লিন করে দেওয়া হয়েছে
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeader()),
  };

  const res = await fetch(`${BACKEND_URL}/api/users/${userId}/block`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({ isBlocked: shouldBlock }),
  });
  if (!res.ok) throw new Error("Failed to update user block status");
  return res.json();
};