import { serverFetch } from "../core/server";

export const getAllReports = async () => {
  return await serverFetch(`/api/admin/reports`, {
    cache: "no-store",
  });
};
