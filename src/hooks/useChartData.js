import supabase from "../config/supabaseClient";

export const useChartData = async (userId) => {
  try {
    if (!userId) return null;

    const { data: accountsData, error: accountsError } = await supabase
      .from("accounts")
      .select("id")
      .eq("user_id", userId);

    if (accountsError) {
      console.error(accountsError);
      return null;
    }

    const accountId = accountsData[0]?.id;
    if (!accountId) {
      console.log("Käyttäjällä ei ole tiliä.");
      return null;
    }

    const { data: expenseData, error: expenseError } = await supabase
      .from("expense_transactions")
      .select("category_id, amount")
      .eq("account_from", accountId);

    if (expenseError) {
      console.error(expenseError);
      return null;
    }

    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id, category_name");

    if (categoryError) {
      console.error(categoryError);
      return null;
    }

    const categoryMap = categoryData.reduce((acc, category) => {
      acc[category.id] = category.category_name;
      return acc;
    }, {});

    const categories = expenseData.reduce((acc, transaction) => {
      const categoryName = categoryMap[transaction.category_id] || "Tuntematon";
      acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
      return acc;
    }, {});

    const categoryColors = Object.keys(categories).map(
      () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );

    return {
      barData: {
        labels: Object.keys(categories),
        datasets: [
          {
            label: "Menot (€)",
            backgroundColor: "#36a2eb",
            data: Object.values(categories),
          },
        ],
      },
      pieData2: {
        labels: Object.keys(categories),
        datasets: [
          {
            data: Object.values(categories),
            backgroundColor: categoryColors,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Virhe tietojen haussa:", error);
    return null;
  }
};












