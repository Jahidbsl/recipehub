// রিপোর্ট বাতিল (Dismiss) করার ফাংশন
export const dismissReport = async (reportId) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/reports/${reportId}/dismiss`, {
    method: "DELETE",
  });
  return res.json();
};

// রেসিপি চিরতরে ডিলিট করার ফাংশন
export const deleteRecipeAndReports = async (recipeId) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/recipes/${recipeId}`, {
    method: "DELETE",
  });
  return res.json();


};


