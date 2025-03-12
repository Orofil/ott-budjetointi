import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import TransactionList from "../components/TransactionList";

import "bootstrap/dist/css/bootstrap.min.css";

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
  const navigateToBudgets = async () => {
    navigate("/budgets");
  };

  return (
    <div>
      <h2>Etusivu</h2>
      <h3>Tapahtumat</h3>
      <TransactionList />
      <hr />
      <button onClick={navigateToTransaction}>Lisää pankkitapahtuma</button>
      <button onClick={navigateToBudgets}>Budjetit</button>
      <button onClick={handleLogout}>Kirjaudu ulos</button>
    </div>
  );
}

export default Dashboard;
