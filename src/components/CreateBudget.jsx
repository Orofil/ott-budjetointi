import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { AccountContext } from "../context/AccountContext";
import { BudgetContext } from "../context/BudgetContext";
import { Button, Col, Form, ListGroup, Modal, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BudgetRepeating } from "../constants/BudgetRepeating";

const CreateBudgetPage = ({ showPopup, setShowPopup }) => {
  const { expenseCategories, incomeCategories } = useContext(CategoryContext);
  const { accounts } = useContext(AccountContext);
  const { addBudget } = useContext(BudgetContext);
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [repeatOrNot, setRepeatOrNot] = useState(false); // Ollaanko budjetista tekemässä toistuva vai ei
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [repeating, setRepeating] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [message, setMessage] = useState("");

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
    setBudgetName("");
    setBudgetAmount("");
    setRepeatOrNot(false);
    setStartDate(null);
    setEndDate(null);
    setRepeating("");
    setSelectedCategories([]);
    setSelectedAccounts([]);
    setShowPopup(false);
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
    <Modal show={showPopup} onHide={() => setShowPopup(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Luo uusi budjetti</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="budgetName">
            <Form.Label>Budjetin nimi</Form.Label>
            <Form.Control
              type="text"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Check
            className="mb-3"
            type="switch"
            label="Toistuva budjetti"
            value={repeatOrNot}
            onChange={(e) => setRepeatOrNot(e.target.checked)}
          />

          {!repeatOrNot && (
            <Form.Group className="mb-3" controlId="budgetDate">
              <Form.Label>Aikaväli</Form.Label>
              <div className="d-flex gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  className="form-control"
                  locale="fi"
                  placeholderText="Aloituspäivä"
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  required
                />
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  className="form-control"
                  locale="fi"
                  placeholderText="Lopetuspäivä"
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  required
                />
              </div>
            </Form.Group>
          )}

          {repeatOrNot && (
            <Form.Group className="mb-3" controlId="repeating">
              <Form.Label>Budjetin toistumisväli:</Form.Label>
              <Form.Select
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
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="selectedCategories">
            <Form.Label>Budjetin suuruus (€)</Form.Label>
            <Form.Control
              type="number"
              min="0.01"
              step="0.01"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="budgetCategory">
            <Form.Label>Kategoriat</Form.Label>
            <div style={{ maxWidth: "30rem" }}>
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
          </Form.Group>

          <Form.Group className="mb-3" controlId="selectedAccounts">
            <Form.Label>Tilit</Form.Label>
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
          </Form.Group>

          {message && (
            <div className='text-danger'>{message}</div>
          )}

          <Button variant="primary" type="submit">Tallenna budjetti</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateBudgetPage;