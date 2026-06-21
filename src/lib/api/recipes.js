import { serverFetch } from "../core/server";

export const getRecipeByUser = async (userId) => {
  return serverFetch(`/api/recipes?userId=${userId}`);
};


export const getRecipes = async ({ category, cuisine } = {}) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (cuisine) params.append("cuisine", cuisine);

  const query = params.toString();
  return serverFetch(`/api/recipes${query ? `?${query}` : ""}`);
};

export const getRecipeById = async (id) => {
  return serverFetch(`/api/browse-recipes/${id}`);
};

export const getInteractions = async (recipeId, userId) => {
  return serverFetch(`/api/browse-recipes/${recipeId}/interactions?userId=${userId}`);
};