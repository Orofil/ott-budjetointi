import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

// TODO poista nämä ylemmät ja korvaa aiemmat tämän käytöt alemmalla

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);

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
    };
    loadAccounts();
  }, []);

  // Uuden tilin lisäys
  const addAccount = async (account) => {
    // Haetaan kirjautuneen käyttäjän tiedot
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.rpc("add_account", {
      p_user_id: user.id,
      p_account_number: account.account_number,
      p_account_name: account.account_name
    });
    if (error) {
      console.error("Virhe tilin lisäämisessä:", error);
      return;
    }
    setAccounts((prev) => [...prev, account]);
    return data;
  };

  return (
    <AccountContext.Provider value={{ accounts, addAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = () => useContext(AccountContext);