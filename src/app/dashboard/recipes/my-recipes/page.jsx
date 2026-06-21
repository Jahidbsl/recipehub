import { getUserSession } from "@/lib/core/session";
import { RecipeGrid } from "@/components/recipes/myRecipes/RecipeGrid";
import { getRecipeByUser } from "@/lib/api/recipes";

const page = async () => {
  const user = await getUserSession();
  const recipes = await getRecipeByUser(user.id); 
  console.log(recipes, "recipes");

  return (
    <div>
      <RecipeGrid recipes={recipes} />
    </div>
  );
};

export default page;