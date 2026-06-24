import { protectedFetch } from "../core/server";

export const getAllReports = async () => {
  return await protectedFetch(`/api/admin/reports`, {
    cache: "no-store",
  });
};
