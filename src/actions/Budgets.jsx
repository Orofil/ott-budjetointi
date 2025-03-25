import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudgets = async () => {
      setLoading(true);
      // Haetaan kirjautuneen käyttäjän tiedot
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("budgets").select()
        .eq("user_id", user.id);
      if (error) {
        console.error("Virhe budjettien haussa:", error);
        setLoading(false);
        return null;
      }
      setBudgets(data);
      setLoading(false);
    };
    loadBudgets();
  }, []);

  return (
    <BudgetContext.Provider value={{ budgets, loading }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => useContext(BudgetContext);