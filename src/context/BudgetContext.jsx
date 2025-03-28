import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { UserContext } from "./UserContext";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { user } = useContext(UserContext); // Haetaan kirjautuneen käyttäjän tiedot
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudgets = async () => {
      setLoading(true);
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

  const addBudget = async (budget) => {
    setLoading(true);
    const { data: id , error } = await supabase.rpc("add_budget", {
      p_user_id: user.id,
      p_start_date: budget.start_date,
      p_end_date: budget.end_date,
      p_budget_name: budget.budget_name,
      p_amount: budget.amount
    });
    if (error) {
      console.error("Virhe budjetin lisäämisessä:", error);
      setLoading(false);
      return;
    }
    budget.id = id;

    // TODO nämä tietokantafunktioon jotta kaiken voi peruutta jos jokin osa menee väärin
    // Tallennetaan seurattavat kategoriat
    const { error: error2 } = await supabase
      .from("budgets_categories")
      .insert(budget.categories.map((c) => ({
        budget_id: id,
        budget_category_id: c
      })));
    if (error2) {
      console.error("Virhe budjetin kategorioiden lisäämisessä:", error);
      setLoading(false);
      return;
    }

    // Tallennetaan seurattavat tilit
    const { error: error3 } = await supabase
      .from("budgets_accounts")
      .insert(budget.accounts.map((a) => ({
        account_id: a,
        budget_id: id
      })));
    if (error3) {
      console.error("Virhe budjetin tilien lisäämisessä:", error);
      setLoading(false);
      return;
    }

    // Haetaan budjettiin kuuluvat tapahtumat
    const { error: error4 } = await supabase.rpc("populate_budget_transactions", { p_budget_id: id });
    if (error4) {
      console.error("Virhe budjetin tapahtumien lisäämisessä:", error);
      setLoading(false);
      return;
    }

    setBudgets((prev) => [...prev, budget]);
    setLoading(false);
    console.log("Lisätty budjetti:", id);
    return id;
  };

  return (
    <BudgetContext.Provider value={{ budgets, addBudget, loading }}>
      {children}
    </BudgetContext.Provider>
  );
};