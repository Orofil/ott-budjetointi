import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { ArrowsAngleExpand } from "react-bootstrap-icons";
import { useCategories } from "../actions/Categories";
import { useAccounts } from "../actions/Accounts";

const TransactionContainer = ({ transaction, onClick }) => {
  const { expenseCategories, incomeCategories, loading } = useCategories();
  const { accounts, addAccount } = useAccounts();

  return (
    <Button
      variant="light"
      className="text-start p-3 border rounded shadow-sm transaction-container"
      onClick={onClick}
    >
      <Container fluid>
        <Row className="align-items-center">
          <Col xs="2" className={`fw-bold fs-4 text-end ${transaction.type == 0 ? "text-danger" : "text-primary"}`}>
            {transaction.type == 0 ? "" : "+"}{transaction.amount.toFixed(2)} €
          </Col>

          <Col xs="3">
            <div className="fw-semibold">{transaction.other_account}</div>
            <div className="text-muted small">{accounts.find(a => a.id === transaction.own_account)?.account_number || "Ladataan..."}</div> {/* TODO tilin nimi myös, tai vain jompi kumpi */}
          </Col>

          <Col xs="2" className="text-muted small">
              {transaction.type == 0 ?
              expenseCategories.find(c => c.id === transaction.category_id)?.category_name || "Ladataan..." :
              incomeCategories.find(c => c.id === transaction.category_id)?.category_name || "Ladataan..."}
          </Col>

          <Col xs="4" className="text-muted small d-none d-md-block">{transaction.description}</Col>

          <Col xs="1">
            <ArrowsAngleExpand className="fs-3" />
          </Col>
        </Row>
      </Container>
    </Button>
  );
};

export default TransactionContainer;
