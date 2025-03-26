import React, { createContext, useState, useEffect, useContext } from "react";
import supabase from "../config/supabaseClient";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const response = await supabase.auth.getSession();
      const { data, error } = response;
  
      if (error) {
        console.error("Virhe session haussa:", error.message);
      } else {
        console.log("Sessio haettu:", data);
        if (data?.session) {
          setUser(data.session.user);
        }
      }
      setLoading(false);
    };

    getSession();

    // Kuunnellaan tilan muutoksia auktorisoinnissa
    const { data: authListener, error: listenerError } = supabase.auth.onAuthStateChange((_event, session) => {
      if (listenerError) {
        console.error("Virhe kuuntelijassa:", listenerError.message);
      }
      setUser(session?.user || null);
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  if (loading) {
    return <div>Ladataan...</div>; // Näytetään lataamisteksti kunnes sessio on haettu
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};