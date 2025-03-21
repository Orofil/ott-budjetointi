import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
      // Haetaan kirjautuneen käyttäjän tiedot
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("accounts")
        .select()
        .eq("user_id", user.id);
      if (error) console.error("Virhe tilien haussa:", error);
      else setAccounts(data);
      setLoading(false);
    };
    loadAccounts();
  }, []);

  // Uuden tilin lisäys
  const addAccount = async (account) => {
    setLoading(true);
    // Haetaan kirjautuneen käyttäjän tiedot
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.rpc("add_account", {
      p_user_id: user.id,
      p_account_number: account.account_number,
      p_account_name: account.account_name
    });
    if (error) {
      console.error("Virhe tilin lisäämisessä:", error);
      setLoading(false);
      return;
    }
    setAccounts((prev) => [...prev, account]);
    setLoading(false);
    console.log("Lisätty tili:", data);
    return data;
  };

  return (
    <AccountContext.Provider value={{ accounts, addAccount, loading }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = () => useContext(AccountContext);