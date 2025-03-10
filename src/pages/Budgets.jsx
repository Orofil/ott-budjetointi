import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Käytetään Link-komponenttia siirtymiseen

// Tämä komponentti hakee ja näyttää kaikki budjetit tietokannasta.
const BudgetListPage = () => {
  const [budgets, setBudgets] = useState([]); // Tallennetaan haetut budjetit tähän tilaan
  const [loading, setLoading] = useState(true); // Ladataanko budjetteja

  useEffect(() => {
    // Tässä voisi käyttää fetchiä tai axiosia budjettien hakemiseen
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/budgets"); // Muokkaa tämä reitti tarpeen mukaan
        const data = await response.json();
        setBudgets(data);
      } catch (error) {
        console.error("Virhe budjettien haussa", error);
      } finally {
        setLoading(false); // Lataus valmis
      }
    };

    fetchBudgets();
  }, []); // Efekti ajetaan vain ensimmäisellä renderöinnillä

  return (
    <div className="budget-list-page">
      <h1>Budjetit</h1>
      {loading ? (
        <p>Ladataan...</p>
      ) : (
        <div>
          <h2>Omat Budjetit</h2>
          <ul>
            {budgets.map((budget) => (
              <li key={budget.id}>
                <div>{budget.name}</div> {/* Budjetin nimi */}
                <div>{budget.amount} €</div> {/* Budjetin summa */}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="new-budget-button">
        <Link to="/create-budget">
          <button>Lisää uusi budjetti</button>
        </Link>
      </div>
    </div>
  );
};

export default BudgetListPage;
