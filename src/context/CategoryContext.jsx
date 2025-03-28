import React, { createContext, useState, useEffect, useContext } from "react";
import supabase from "../config/supabaseClient";
import { TransactionCategory } from "../constants/TransactionCategory";
import { UserContext } from "./UserContext";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const { user } = useContext(UserContext); // Haetaan kirjautuneen käyttäjän tiedot
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const expenses = await loadCategories(TransactionCategory.EXPENSE);
        const incomes = await loadCategories(TransactionCategory.INCOME);

        setExpenseCategories(expenses);
        setIncomeCategories(incomes);
      } catch (error) {
        console.error("Virhe kategorioiden haussa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const loadCategories = async (categoryType) => {
    // Jatketaan vain jos kategorian tyyppi löytyy TransactionCategorysta
    if (!Object.values(TransactionCategory).includes(categoryType)) {
      console.log("Virheellinen kategoriatyyppi:", categoryType);
      return null;
    }
  
    const { data, error } = await supabase.from("categories").select()
      .eq("user_id", user.id)
      .in("category_type", categoryType.types);
    if (error) {
      console.error("Virhe kategorioiden haussa:", error);
      return null;
    }
    return data;
  }

  return (
    <CategoryContext.Provider value={{ expenseCategories, incomeCategories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};