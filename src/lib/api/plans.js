import { protectedFetch, serverFetch } from "../core/server";

export const getPlanById = async (planId) => {

  const cleanId = typeof planId === 'string' ? planId.trim() : "free";
  return protectedFetch(`/api/plans?plan_id=${cleanId}`); 
};