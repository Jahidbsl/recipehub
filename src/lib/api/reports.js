import { authHeader } from "../core/server";


export const getAllReports = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/reports`, {
    method: "GET",
    headers: await authHeader(), // 👈 ম্যানুয়ালি অথরাইজেশন হেডার পাস করুন
    cache: "no-store",
  });
  return res.json();
};