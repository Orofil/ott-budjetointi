import React, { createContext, useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const getSession = async () => {
      const response = await supabase.auth.getSession();
      const { data, error } = response;
  
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        console.log("Session fetched:", data);
        if (data?.session) {
          setUser(data.session.user);
        }
      }
      setLoading(false); // Set loading to false after fetching
    };

    getSession();

    // Listen for auth state changes
    const { data: authListener, error: listenerError } = supabase.auth.onAuthStateChange((_event, session) => {
      if (listenerError) {
        console.error("Error in listener:", listenerError.message);
      }
      setUser(session?.user || null);
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state until session is fetched
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};