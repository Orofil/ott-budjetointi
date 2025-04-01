import { Button, Card, Col } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";
import { findBudgetRepeating } from "../constants/BudgetRepeating";
import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { AccountContext } from "../context/AccountContext";
import { BudgetContext } from "../context/BudgetContext";

const BudgetListItem = ({ budget, onAction }) => {
  const { expenseCategories, incomeCategories } = useContext(CategoryContext);
  const { accounts } = useContext(AccountContext);

  return (
    <Col key={budget.id} xs={12} md={6} lg={4}>
      <Card className="border-0 shadow-sm rounded-3 bg-white">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <h5 className="fw-bold text-dark">{budget.budget_name}</h5>
          </div>
          <p className="text-dark fs-4">{budget.amount} €</p>
          <p className="fst-italic">
            {budget.repeating ?
              findBudgetRepeating(budget.repeating).text :
              `${new Date(budget.start_date).toLocaleDateString('fi-FI')} – ${new Date(budget.end_date).toLocaleDateString('fi-FI')}`
            }
          </p>
          <p className="text-dark">
            <span className="fw-bold">Kategoriat: </span>{budget.categories.map((c) => // Luetteloidaan budjetin kategoriat
              c == null ? "" :
              (expenseCategories.filter(ec => ec.id === c)[0]?.category_name ||
              incomeCategories.filter(ic => ic.id === c)[0]?.category_name)
            ).join(", ")}
          </p>
          <p className="text-dark">
            <span className="fw-bold">Tilit: </span>{budget.accounts.map((a) => { // Luetteloidaan budjetin tilit
              if (a == null) return "";
              let account = accounts.filter(acc => acc.id === a)[0];
              return !account ? "" : account.account_name ? account.account_name : account.account_number;
            }).join(", ")}
          </p>
          

          {/* Progress bar */}
          <div className="progress my-2" style={{ height: "8px" }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${(budget.used / budget.amount) * 100}%` }} 
              aria-valuenow={budget.used} 
              aria-valuemin="0" 
              aria-valuemax={budget.amount}
            />
          </div>
          <p className="text-muted">Käytetty: {budget.used} € / {budget.amount} €</p>
          
        </Card.Body>
        <Card.Footer className="bg-white d-flex justify-content-between">
          <Button variant="outline-primary" onClick={onAction}>Tarkastele</Button>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default BudgetListItem;