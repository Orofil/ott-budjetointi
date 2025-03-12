import supabase from "../config/supabaseClient";
import { TransactionCategory } from "../constants/TransactionCategory";

export const loadCategories = async (categoryType) => {
  // Jatketaan vain jos kategorian tyyppi löytyy TransactionCategorysta
  if (!Object.values(TransactionCategory).includes(categoryType)) {
    console.log("Virheellinen kategoriatyyppi");
    return null;
  }
  
  // Haetaan kaikki kategoriat
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase.from(categoryType).select()
    .or(`is_default.eq.TRUE,user_id.eq.${user.id}`);
  if (error) {
    console.error("Virhe kategorioiden haussa:", error);
    return null;
  }
  return data;
}