import React from "react";
import { useNavigate } from "react-router-dom"; 
import supabase from "../config/supabaseClient"; 

function Dashboard() {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    // Kirjaudu ulos Supabasesta
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Jos uloskirjautumisessa tapahtui virhe, tulostetaan virheilmoitus
      console.error("Virhe uloskirjautumisessa:", error.message);
    } else {
      // Jos uloskirjautuminen onnistui, ohjataan käyttäjä kirjautumissivulle
      navigate("/login");
    }
  };

  const navigateToTransaction = async () => {
    navigate("/transaction-import");
  };

  return (
    <div>
      <h2>Etusivu</h2> 
      <button onClick={navigateToTransaction}>Lisää pankkitapahtuma</button>
      <button onClick={handleLogout}>Kirjaudu ulos</button> 
    </div>
  );
}

export default Dashboard; 
