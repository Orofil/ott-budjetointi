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
      const { data, error } = await supabase.rpc("get_budgets", {
        p_user_id: user.id
      });
      if (error) {
        console.error("Virhe budjettien haussa:", error);
        setLoading(false);
        return null;
      }
      setBudgets(data);
      setLoading(false);

      // Haetaan samalla myös kuinka paljon budjetista on käytetty
      for (let i = 0; i < data.length; i++) {
        data[i].used = await getUsedAmount(data[i].id, null, null); // Päivämäärät on tällä hetkellä null
      }
      setBudgets(data);
    };
    loadBudgets();
  }, []);

  const addBudget = async (budget) => {
    setLoading(true);
    const { data: id , error } = await supabase.rpc("add_budget", {
      p_user_id: user.id,
      p_start_date: budget.start_date || null,
      p_end_date: budget.end_date || null,
      p_budget_name: budget.budget_name,
      p_amount: budget.amount,
      p_repeating: budget.repeating
    });
    if (error) {
      console.error("Virhe budjetin lisäämisessä:", error);
      setLoading(false);
      return;
    }
    budget.id = id;

    // TODO nämä tietokantafunktioon jotta kaiken voi peruuttaa jos jokin osa menee väärin
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

  const deleteBudget = async (budget_id) => {
    const { error, status } = await supabase
      .from("budgets")
      .delete()
      .eq("id", budget_id);
    if (error) {
      console.error("Virhe budjetin poistamisessa:", error);
      return;
    }
    console.log("Budjetti", budget_id, "poistettu, vastaus:", status);
    setBudgets((prev) => prev.filter(b => b.id !== budget_id));
  }

  const getUsedAmount = async (budget_id, start_date, end_date) => {
    const data = await getBudgetTransactions(budget_id, start_date, end_date);
    if (data == null) return;
    let result = -1 * data.reduce((n, {amount}) => n + amount, 0); // Lasketaan tapahtumien summa, vaihdetaan etumerkki koska on kyse kulutuksen määrästä
    return result.toFixed(2); // Pyöristetään jotta piilotetaan pyöristysvirheet
  }

  const getBudgetTransactions = async (budget_id, start_date, end_date) => {
    const { data, error } = await supabase.rpc("get_budget_transactions", {
      p_budget_id: budget_id,
      p_start_date: start_date,
      p_end_date: end_date
    });
    if (error) {
      console.error("Virhe budjetin tapahtumien haussa:", error);
      return;
    }
    return data;
  }

  return (
    <BudgetContext.Provider value={{ budgets, addBudget, deleteBudget, getBudgetTransactions, loading }}>
      {children}
    </BudgetContext.Provider>
  );
};