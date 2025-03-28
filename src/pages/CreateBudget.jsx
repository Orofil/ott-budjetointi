import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from '../context/CategoryContext';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { BudgetContext } from '../context/BudgetContext';
import { AccountContext } from '../context/AccountContext';
import { BudgetRepeating } from '../constants/BudgetRepeating';

const CreateBudgetPage = () => {
  const { expenseCategories, incomeCategories } = useContext(CategoryContext);
  const { accounts } = useContext(AccountContext);
  const { addBudget } = useContext(BudgetContext);
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [repeatOrNot, setRepeatOrNot] = useState(false); // Ollaanko budjetista tekemässä toistuva vai ei
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [repeating, setRepeating] = useState("");
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

    // Luodaan budjetti
    let id = await addBudget({
      start_date: startDate,
      end_date: endDate,
      budget_name: budgetName,
      amount: budgetAmount,
      repeating: repeating,
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

  useEffect(() => {
    if (repeatOrNot) {
      setStartDate("");
      setEndDate("");
    } else {
      setRepeating("");
    }
  }, [repeatOrNot]);

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
      <Form onSubmit={handleSubmit}>
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
            required
          />
        </div>
        <Form.Check
          type="switch"
          label="Toistuva budjetti"
          value={repeatOrNot}
          onChange={(e) => setRepeatOrNot(e.target.checked)}
        />
        {!repeatOrNot && (
          <>
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
          </>
        )}
        {repeatOrNot && (
          <div>
            <label htmlFor="repeating">Budjetin toistumisväli:</label>
            <select
              id="repeating"
              value={repeating}
              onChange={(e) => setRepeating(e.target.value)}
              required
            >
              <option value="" disabled hidden></option>
              {Object.values(BudgetRepeating).map((r) => (
                <option key={r.value} value={r.value}>
                  {r.text}
                </option>
              ))};
            </select>
          </div>
        )}
        
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
      </Form>
    </div>
  );
};

export default CreateBudgetPage;



