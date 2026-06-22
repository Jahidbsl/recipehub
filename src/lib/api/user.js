const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getUsers = async () => {
  const res = await fetch(`${BACKEND_URL}/api/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const patchUserBlockStatus = async (userId, shouldBlock) => {
  const res = await fetch(`${BACKEND_URL}/api/users/${userId}/block`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isBlocked: shouldBlock }),
  });
  if (!res.ok) throw new Error("Failed to update user block status");
  return res.json();
};