import supabase from "../config/supabaseClient";
import { TransactionCategory } from "../constants/TransactionCategory";

export const loadCategories = async (categoryType) => {
  // Jatketaan vain jos kategorian tyyppi löytyy TransactionCategorysta
  if (!Object.values(TransactionCategory).includes(categoryType)) {
    console.log("Virheellinen kategoriatyyppi:", categoryType);
    return null;
  }
  
  // let categoryNumbers;
  // switch (categoryType) {
  //   case EXPENSE:
  //     categoryNumbers = [0];
  //     break;
  //   case INCOME:
  //     categoryNumbers = [1];
  //     break;
  //   case ALL:
  //     categoryNumbers = [0, 1];
  //     break;
  // }

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("categories").select()
    .eq("user_id", user.id)
    .in("category_type", categoryType.types);
  if (error) {
    console.error("Virhe kategorioiden haussa:", error);
    return null;
  }
  return data;
}