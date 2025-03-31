import { Button, Card, Col } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";
import { findBudgetRepeating } from "../constants/BudgetRepeating";

const BudgetListItem = ({ budget, onAction }) => {
  return (
    <Col key={budget.id} xs={12} md={6} lg={4}>
      <Card className="border-0 shadow-sm rounded-3 bg-white">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <h5 className="fw-bold text-dark">{budget.budget_name}</h5>
          </div>
          <p className="text-dark"></p> {/* sisennys */}
          <p className="text-dark">Summa: {budget.amount} €</p>
          <p className="text-dark">Kategoria: {budget.categories} </p>
          <Col xs="3" className="text-muted">
            {budget.repeating ?
              findBudgetRepeating(budget.repeating).text :
              `${budget.start_date} – ${budget.end_date}`
            }
          </Col>

          {/* progress bar */}
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
          
          <small className="text-muted">{budget.startDate ? budget.startDate.toLocaleDateString('fi-FI') : ''} - {budget.endDate ? budget.endDate.toLocaleDateString('fi-FI') : ''}</small>
          
        </Card.Body>
        <Card.Footer className="bg-white d-flex justify-content-between">
          <Button variant="outline-primary" onClick={onAction}>Tarkastele</Button>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default BudgetListItem;