export const dynamic = "force-dynamic";
import { getRecipes } from "@/lib/api/recipes";
import { BrowseRecipesClient } from "@/components/recipes/browse/BrowseRecipesClient";

const page = async () => {
  const recipes = await getRecipes();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-2">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Browse Recipes
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Explore recipes from the community
        </p>
      </div>
      <BrowseRecipesClient recipes={recipes} />
    </div>
  );
};

export default page;
