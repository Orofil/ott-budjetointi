import { useState } from "react";
import supabase from "../config/supabaseClient";
import { TransactionCategory } from "../constants/TransactionCategory";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [loadedTransactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreAvailable, setMoreAvailable] = useState(false);

  const loadTransactions = async (offset, pageLimit) => {
    setLoading(true);
    // Haetaan kirjautuneen käyttäjän tiedot
    const { data: { user } } = await supabase.auth.getUser();
  
    const { data, error } = await supabase
      .from("all_transactions")
      .select()
      .eq("user_id", user.id)
      .range(offset, offset + pageLimit);
    
    setLoading(false);
    if (error) {
      console.error("Virhe tapahtumien haussa:", error);
      return null;
    }

    // TODO nämä alla olevat
    const data = await loadTransactions(offset, PAGE_LIMIT);
    if (!data.length) {
      console.log("Tapahtumia ei löytynyt!");
      return;
    };

    if (data.length > PAGE_LIMIT) {
      setTransactions((prev) => [...prev, ...data.slice(0, -1)]);
      setMoreAvailable(true);
    } else {
      setTransactions((prev) => [...prev, ...data]);
      setMoreAvailable(false);
    }
    setOffset((prev) => prev + PAGE_LIMIT);
    setLoading(false);

    return data;
  };

  const getTransaction = async (id, type) => {
    setLoading(true);
    // Haetaan kirjautuneen käyttäjän tiedot
    const { data: { user } } = await supabase.auth.getUser();
  
    // Tarkistetaan kuuluuko tapahtuma kirjautuneelle käyttäjälle
    const { error } = await supabase
      .from("all_transactions")
      .select()
      .eq("type", type.types[0])
      .eq("user_id", user.id)
      .eq("id", id);
    
    if (error) {
      console.error("Tapahtumaa ei löydy:", error);
      return null;
    }
  
    const { data, error1 } = await supabase
      .from(type == TransactionCategory.EXPENSE ? "expense_transactions" : "income_transactions")
      .select()
      .eq("id", id);
    
    if (error1) {
      console.error("Virhe tapahtuman haussa:", error1);
      return null;
    }
    setLoading(false);
    return data;
  }

  const createTransaction = async (t) => {
    setLoading(true);
    // Lisätään tapahtuma
    const { data, error } = await supabase.rpc("add_transaction", {
      p_date: t.date,
      p_reference_number: t.reference_number,
      p_description: t.description,
      p_amount: t.amount,
      p_account: t.account,
      p_name: t.name,
      p_category_id: t.category
    });
    if (error != null) {
      console.log("Virhe tapahtuman tallentamisessa:", error);
      setLoading(false);
      return null;
    }
    console.log("Tapahtuma luotu, ID:", data);

    // Haetaan luotu tapahtuma
    let newTransaction = getTransaction(data, t.amount.startsWith("-") ? TransactionCategory.EXPENSE : TransactionCategory.INCOME);

    setTransactions((prev) => [...prev, newTransaction]); // TODO tämä pitää lajitella
    setLoading(false);
    return data;
  };
  
  const createTransactions = async (transactions) => {
    if (transactions == null) return;
  
    // TODO tätä varten pitää tehdä tietokantafunktio jotta nämä voi kaikki peruuttaa jos jossain kohti on virhe
    for (let i = 0; i < transactions.length; i++) {
      let tr = transactions[i];
      const { data, error } = await supabase.rpc("add_transaction", {
        p_date: tr.date,
        p_reference_number: tr.reference_number === "" ? null : Number(tr.reference_number),
        p_description: tr.description,
        p_amount: tr.amount,
        p_account: tr.account,
        p_name: tr.name,
        p_category_id: tr.category
      });
    
      if (error != null) {
        console.log("Virhe tapahtuman tallentamisessa:", error);
        return;
      }
      console.log("Tapahtuma luotu, ID:", data);
    }
  };

  const updateTransaction = async (data) => {
    setLoading(true);
    // Haetaan kirjautuneen käyttäjän tiedot
    const { data: { user } } = await supabase.auth.getUser();
  
    // Tarkistetaan kuuluuko tapahtuma kirjautuneelle käyttäjälle
    const { error } = await supabase
      .from("all_transactions")
      .select()
      .eq("type", data.amount.startsWith("-") ? TransactionCategory.EXPENSE.types[0] : TransactionCategory.INCOME.types[0])
      .eq("user_id", user.id)
      .eq("id", data.id);
    
    if (error) {
      console.error("Tapahtumaa ei löydy:", error);
      return null;
    }
    
    const { error1 } = await supabase
      .from(amount.startsWith("-") ? "expense_transactions" : "income_transactions")
      .update(data)
      .eq("id", data.id);
    if (error1) {
      console.error("Virhe tapahtuman päivityksessä:", error1);
      return null;
    }
    setTransactions((prev) =>
      prev.map((t) => (t.id === data.id ? { ...t, ...data } : t))
    );
    return true;
  };

  const deleteTransaction = async (type, id) => {
    setLoading(true);
    // Haetaan kirjautuneen käyttäjän tiedot
    const { data: { user } } = await supabase.auth.getUser();
  
    // Tarkistetaan kuuluuko tapahtuma kirjautuneelle käyttäjälle
    const { error } = await supabase
      .from("all_transactions")
      .select()
      .eq("type", type.types[0])
      .eq("user_id", user.id)
      .eq("id", id);
    
    if (error) {
      console.error("Poistettavaa tapahtumaa ei löydy:", error);
      return null;
    }
  
    const { data, error1 } = await supabase
      .from(type == TransactionCategory.EXPENSE ? "expense_transactions" : "income_transactions")
      .delete()
      .eq("id", id)
      .select();
    
    if (error1) {
      console.error("Virhe tapahtuman poistossa:", error1);
      return null;
    }
    // Poistetaan myös ladatuista tapahtumista
    setTransactions((prev) => prev.filter(t => !(t.id == id && t.type == type)));
    console.log("Tapahtuma poistettu:", data);
    setLoading(false);
    return data;
  }

  return (
    <TransactionContext.Provider value={{ loadedTransactions, loadTransactions, createTransaction, createTransactions, deleteTransaction, loading }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);