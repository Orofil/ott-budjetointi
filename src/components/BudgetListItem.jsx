import { Button, Col, Container, Row } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";
import { findBudgetRepeating } from "../constants/BudgetRepeating";

const BudgetListItem = ({ budget }) => {
  return (
    <Button
      variant="light"
      className="text-start p-3 border rounded shadow-sm"
    >
      <Container fluid>
        <Row className="align-items-center">
          <Col xs="5" className="fs-4">
            {budget.budget_name}
          </Col>
          
          <Col xs="3" className="fw-bold fs-4 text-end">
            {budget.amount} €
          </Col>

          <Col xs="3" className="text-muted">
            {budget.repeating ?
              findBudgetRepeating(budget.repeating).text :
              `${budget.start_date} – ${budget.end_date}`
            }
          </Col>

          <Col xs="1">
            <ChevronRight className="fs-3" />
          </Col>
        </Row>
      </Container>
    </Button>
  );
};

export default BudgetListItem;