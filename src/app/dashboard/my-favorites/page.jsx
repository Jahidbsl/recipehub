
import { getUserSession } from "@/lib/core/session";
import MyFavorites from "./MyFavorites";

const DashboardFavoritesPage = async () => {

  const user = await getUserSession().catch(() => null);

  return (
    <div className="container mx-auto">
   
      <MyFavorites user={user} />
    </div>
  );
};

export default DashboardFavoritesPage;