import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Käytetään Link-komponenttia siirtymiseen
import { BudgetContext } from "../context/BudgetContext";
import { Stack } from "react-bootstrap";
import BudgetListItem from "../components/BudgetListItem";

// Tämä komponentti hakee ja näyttää kaikki budjetit tietokannasta.
const BudgetListPage = () => {
  const { budgets, loading } = useContext(BudgetContext);

  return (
    <div className="budget-list-page">
      <h1>Budjetit</h1>
      {loading ? (
        <p>Ladataan...</p>
      ) : (
        <div style={{ maxWidth: "50em" }}>
          <h2>Omat Budjetit</h2>
          <Stack gap={2}>
            {budgets.map((b) => (
              <BudgetListItem
              key={b.id}
              budget={b} /> /* TODO onClick ja linkin avaus */
            ))}
          </Stack>
          {/* Jos budjetteja ei ole */}
          {!budgets.length && (
            <p>Ei budjetteja</p>
          )}
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
