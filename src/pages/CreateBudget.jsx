import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { useBudgets } from '../context/BudgetContext';
import { useAccounts } from '../context/AccountContext';

const CreateBudgetPage = () => {
  const { expenseCategories, incomeCategories } = useCategories(); // Kategoriat
  const { accounts } = useAccounts();
  const { addBudget } = useBudgets();
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategories.length) {
      setMessage("Vähintään yksi kategoria valittava");
      return;
    }
    if (!selectedAccounts.length) {
      setMessage("Vähintään yksi tili valittava");
      return;
    }

    let id = await addBudget({
      start_date: startDate,
      end_date: endDate,
      budget_name: budgetName,
      amount: budgetAmount,
      categories: selectedCategories,
      accounts: selectedAccounts
    });
    if (!id) {
      setMessage("Tapahtui virhe");
      return;
    }
    setMessage("");
    navigate('/budgets'); // Ohjataan takaisin Budgets-sivulle, jos budjetin luominen onnistui
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
    setSelectedCategories(selectedCategories.length === allCategories.length ? [] : allCategories.map((c) => c.id));
  };

  const toggleAccount = (item) => {
    setSelectedAccounts((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
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
            min="0"
            step="0.01"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="start-date">Aloituspäivämäärä:</label>
          <input
            id="start-date"
            type="date"
            max={endDate}
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
            min={startDate}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div style={{ maxWidth: "30rem" }}>
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
                    active={selectedCategories.includes(c.id)}
                    onClick={() => toggleCategory(c.id)}
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
                    active={selectedCategories.includes(c.id)}
                    onClick={() => toggleCategory(c.id)}
                  >
                    {c.category_name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </div>
        <div>
          <label>Valitse seurattavat tilit:</label>
          <ListGroup>
            {accounts.map((a) => (
              <ListGroup.Item
                key={a.id}
                action
                type="button"
                active={selectedAccounts.includes(a.id)}
                onClick={() => toggleAccount(a.id)}
              >
                {a.account_name ? `${a.account_name} (${a.account_number})` : a.account_number}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        
        {message && (
          <div className='text-danger'>{message}</div>
        )}

        <button type="submit">Luo budjetti</button>
        <button type="button" onClick={handleCancel}>Peruuta</button>
      </form>
    </div>
  );
};

export default CreateBudgetPage;



