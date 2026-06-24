import { authHeader } from "../core/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getUsers = async () => {
  const res = await fetch(`${BACKEND_URL}/api/users`,{
     headers: await authHeader()
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const patchUserBlockStatus = async (userId, shouldBlock) => {
  const res = await fetch(`${BACKEND_URL}/api/users/${userId}/block`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
       headers: await authHeader()
    },
    body: JSON.stringify({ isBlocked: shouldBlock }),
  });
  if (!res.ok) throw new Error("Failed to update user block status");
  return res.json();
};