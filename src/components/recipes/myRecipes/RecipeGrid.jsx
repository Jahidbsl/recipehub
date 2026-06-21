// components/RecipeGrid.jsx
import { RecipeCard } from "./RecipeCard";
import { ChefHat } from "lucide-react";

export function RecipeGrid({ recipes }) {
  if (!recipes?.length) {
    return (
      <div className="text-center py-16 text-zinc-400">
        <ChefHat size={36} className="mx-auto mb-3" />
        <p className="text-sm">No recipes yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6">
      {recipes.map((r) => (
        <RecipeCard key={r._id} recipe={r} />
      ))}
    </div>
  );
}