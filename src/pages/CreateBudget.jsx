import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBudgetPage = () => {
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Kategoria
  const [categories, setCategories] = useState([]); // Kategoriat

  const navigate = useNavigate();

  // Hakee kategoriat (sisältäen oletuskategoriat ja käyttäjän lisäämät)
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories'); // Hae kategoriat API:sta
      const data = await response.json();
      setCategories(data); // Aseta kategoriat tilaan
    };

    fetchCategories();
  }, []);

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
        <div>
          <label htmlFor="category">Valitse seurattavat kategoriat:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Valitse kategoria</option>
            <option value="all">Kaikki kategoriat</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Luo budjetti</button>
        <button type="button" onClick={handleCancel}>Peruuta</button>
      </form>
    </div>
  );
};

export default CreateBudgetPage;



