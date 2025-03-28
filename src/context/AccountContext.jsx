import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { UserContext } from "./UserContext";
import React from "react";

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { user } = useContext(UserContext); // Haetaan kirjautuneen käyttäjän tiedot
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
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