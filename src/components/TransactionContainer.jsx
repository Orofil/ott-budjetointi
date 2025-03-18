import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { ArrowsAngleExpand, InfoCircle } from "react-bootstrap-icons";
import { loadCategories, useCategories } from "../actions/Categories";
import { TransactionCategory } from "../constants/TransactionCategory";

const TransactionContainer = ({ transaction, onClick }) => {
  const { expenseCategories, incomeCategories, loading } = useCategories();

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
            <div className="text-muted small">{transaction.own_account}</div> {/* TODO hae tilit näille ja tee sama haku kuin kategorioilla */}
          </Col>

          <Col xs="2" className="text-muted small">
              {transaction.type == 0 ?
              expenseCategories.find(c => c.id === transaction.category_id)?.category_name || transaction.category_id :
              incomeCategories.find(c => c.id === transaction.category_id)?.category_name || transaction.category_id}
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
