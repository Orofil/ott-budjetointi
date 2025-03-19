import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../actions/Categories';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';

const CreateBudgetPage = () => {
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { expenseCategories, incomeCategories, loading } = useCategories(); // Kategoriat
  const [selectedCategories, setSelectedCategories] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBudget = {
      name: budgetName,
      amount: parseFloat(budgetAmount),
      startDate,
      endDate,
      selectedCategory
    };

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBudget),
      });

      if (response.ok) {
        navigate('/budgets'); // Ohjataan takaisin Budgets-sivulle, jos budjetin luominen onnistui
      } else {
        console.error("Budjetin luominen epäonnistui");
      }
    } catch (error) {
      console.error("Virhe budjetin luomisessa", error);
    }
  };

  const handleCancel = () => {
    navigate('/budgets'); // Jos käyttäjä peruuttaa, ohjataan takaisin Budgets-sivulle
  };

  const toggleCategory = (item) => {
    setSelectedCategories((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleAllCategories = () => {
    const allCategories = [...new Set([...expenseCategories, ...incomeCategories])];
    setSelectedCategories(selectedCategories.length === allCategories.length ? [] : allCategories);
  };

  return (
    <div className="create-budget-page">
      <h1>Lisää uusi budjetti</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="budget-name">Budjetin nimi:</label>
          <input
            id="budget-name"
            type="text"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="budget-amount">Budjetin summa (€):</label>
          <input
            id="budget-amount"
            type="number"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="start-date">Aloituspäivämäärä:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="end-date">Lopetuspäivämäärä:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div style={{ maxWidth: "30vw" }}>
          <label htmlFor="category">Valitse seurattavat kategoriat:</label>
          <Button variant="secondary" onClick={toggleAllCategories} className="w-100 mb-3">
            {selectedCategories.length === [...new Set([...expenseCategories, ...incomeCategories])].length
              ? "Poista valinnat"
              : "Valitse kaikki"}
          </Button>

          <Row>
            <Col>
              <h5>Kulujen kategoriat</h5>
              <ListGroup>
                {expenseCategories.map((c) => (
                  <ListGroup.Item
                    key={c.id}
                    action
                    type="button"
                    active={selectedCategories.includes(c)}
                    onClick={() => toggleCategory(c)}
                  >
                    {c.category_name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <h5>Tulojen kategoriat</h5>
              <ListGroup>
                {incomeCategories.map((c) => (
                  <ListGroup.Item
                    key={c.id}
                    action
                    type="button"
                    active={selectedCategories.includes(c)}
                    onClick={() => toggleCategory(c)}
                  >
                    {c.category_name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </div>
        <button type="submit">Luo budjetti</button>
        <button type="button" onClick={handleCancel}>Peruuta</button>
      </form>
    </div>
  );
};

export default CreateBudgetPage;



