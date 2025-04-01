import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Row,
  Button,
  Modal,
  Form,
  Stack,
  Col,
  Card,
} from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from "date-fns/locale/fi";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend); //npm install chart.js react-chartjs-2

registerLocale("fi", fi);

const BudgetListPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [budjettiPopup, setBudjettiPopup] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [recurrence, setRecurrence] = useState([]);
  const [budjetit, setBudjetit] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotFound, setShowNotFound] = useState(false);

  // budjetin lisäystoiminto
  const handleSubmit = (e) => {
    e.preventDefault();
    const newBudget = {
      id: Date.now(),
      name: budgetName,
      amount: budgetAmount,
      startDate,
      endDate,
      categories,
      accounts,
      recurrence,
    };
    setBudjetit([...budjetit, newBudget]); // budjetin lisäys
    setShowPopup(false);
    setBudgetName("");
    setBudgetAmount("");
    setStartDate(null);
    setEndDate(null);
    setCategories([]);
    setAccounts([]);
    setRecurrence([]);
  };

  // avaa valitun budjetin tarkastelupopupin
  const handleViewBudget = (budget) => {
    setSelectedBudget(budget);
    setBudjettiPopup(true);
  };

  // mahdollisuus budjettin poistoon
  const handleDelete = (id) => {
    setBudjetit(budjetit.filter((budget) => budget.id !== id));
    setShowDeleteConfirmPopup(true);
  };

  // poistaa budjetin, jos varmistus hyväksytään
  const confirmDelete = () => {
    setBudjetit(budjetit.filter((budget) => budget.id !== selectedBudget.id));
    setShowDeleteConfirmPopup(false);
    setBudjettiPopup(false);
  };

  // ilmoitus, jos haettua budjettia ei löydy
  const handleSearch = () => {
    const found = budjetit.some(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setShowNotFound(!found);
  };


  return (
    <div fluid className="p-0">

      {/* pääsisältöalue budjettien hallinnan sivulla */}
      <Row className="min-vh-100 p-3"> 
        <div className="main-content w-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Omat budjetit</h2>
          <Button variant="success" className="px-4 py-2" onClick={() => setShowPopup(true)}>Uusi budjetti</Button>
    </div>
     <div className="text-muted bg-light p-3 rounded-3 shadow-sm">
      <p className="mb-1">Hallinnoi ja seuraa budjettejasi helposti. Pidä taloutesi hallinnassa tarkastelemalla, muokkaamalla ja poistamalla budjetteja tai luomalla uusia.</p>
      <p className="mb-0">Seuraa budjettiesi tilannetta reaaliajassa ja varmista, että pysyt suunnitelmassasi. </p>
    </div>
    <p className="text-dark"></p> {/* sisennys */}

    {/* hakukenttä */}
    <Stack direction="horizontal" gap={3} className="mb-4">
    <Col xs="auto">
              <Form.Control 
                className="me-auto" 
          placeholder=" Hae budjettia nimellä..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Col>
      <Button variant="primary" className="px-4 py-2" onClick={handleSearch}>Hae</Button>
    </Stack>

    {showNotFound && <p className="text-danger fw-bold">Tämän nimistä budjettia ei löydy!</p>}

    {/* budjettikortit */}
    <Row className="g-4">
      {budjetit.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((budget) => (
        <Col key={budget.id} xs={12} md={6} lg={4}>
          <Card className="border-0 shadow-sm rounded-3 bg-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <h5 className="fw-bold text-dark">{budget.name}</h5>
              </div>
              <p className="text-dark"></p> {/* sisennys */}
              <p className="text-dark">Summa: {budget.amount} €</p>
              <p className="text-dark">Kategoria: {budget.category} </p>
              

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
              <Button variant="outline-primary" onClick={() => handleViewBudget(budget)}>Tarkastele</Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
</Row>

      {/* uuden budjetin lisäys popuppina ("uusi budjetti"), nämähän ei nyt tallennu mihinkään vaan poistuu kun sivu päivittyy*/}
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Luo uusi budjetti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="budgetName">
              <Form.Label>Budjetin nimi</Form.Label>
              <Form.Control type="text" value={budgetName} onChange={(e) => setBudgetName(e.target.value)} required />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="budgetDate">
              <Form.Label>Aikaväli</Form.Label>
              <div className="d-flex gap-2">
                <DatePicker selected={startDate} onChange={setStartDate} className="form-control" locale="fi" placeholderText="Aloituspäivä" selectsStart startDate={startDate} endDate={endDate} required />
                <DatePicker selected={endDate} onChange={setEndDate} className="form-control" locale="fi" placeholderText="Lopetuspäivä" selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} required />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="budgetAmount">
              <Form.Label>Budjetin suuruus (€)</Form.Label>
              <Form.Control type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="budgetCategory">
              <Form.Label>Kategoriat</Form.Label>
              <Form.Select value={categories.length === 0 ? "Kaikki" : categories}
               onChange={(e) => setCategories([...e.target.selectedOptions].map(o => o.value))}>
                <option>Kaikki</option>
                <option>Ruoka</option>
                <option>Asuminen</option>
                <option>Matkustaminen</option>
                <option>Vapaa-aika</option>
              </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3" controlId="budgetAccount">
              <Form.Label>Tilit</Form.Label>
              <Form.Select value={accounts.length === 0 ? "Päätili" : accounts}
               onChange={(e) => setAccounts([...e.target.selectedOptions].map(o => o.value))}>
                <option>Päätili</option> {/* tässä oletusarvot, en tiedä mitä todellisuudessa halutaan) */}
                <option>Säästötili</option>
                <option>Luottokortti</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="budgetRecurrence">
              <Form.Label>Toistuvuus</Form.Label>
              <Form.Select value={recurrence.length === 0 ? "Ei toistu" : recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                <option>Ei toistu</option> {/* tässä oletusarvot, en tiedä mitä todellisuudessa halutaan) */}
                <option>Viikoittain</option>
                <option>Kuukausittain</option>
                <option>Vuosittain</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">Tallenna budjetti</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* fullscreen popup budjetin tarkasteluun aukeaa "tarkastele" buttonista */}
      <Modal show={budjettiPopup} onHide={() => setBudjettiPopup(false)} centered fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBudget?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBudget && (
      <>
          <h4>Budjetin tiedot:</h4>
          <p><strong>Budjetti:</strong> {selectedBudget.amount} €</p>
          <p><strong>Kategoria:</strong> {selectedBudget.categories}</p>
          <p><strong>Aikaväli:</strong> {selectedBudget.startDate?.toLocaleDateString('fi-FI')} - {selectedBudget.endDate?.toLocaleDateString('fi-FI')}</p>
          <p><strong>Tilit:</strong> {selectedBudget.accounts?.join(', ')}</p>
          <p><strong>Jäljellä olevat päivät:</strong> {selectedBudget.endDate ? Math.max(0, Math.ceil((selectedBudget.endDate - new Date()) / (1000 * 60 * 60 * 24))) : '-'}</p>

        {/* tässä oleusarvot, haetaan todellisuudessa tietokannasta) */}
        <p><strong>Käytetty:</strong> 300 €</p>
        <p><strong>Jäljellä:</strong> {selectedBudget.amount - 300} €</p>

        {/* progress bar näyttää jäljellä olevan budjetin */}
        <div className="progress my-3">
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${((selectedBudget.amount - 300) / selectedBudget.amount) * 100}%` }}
            aria-valuenow={(selectedBudget.amount - 300)}
            aria-valuemin="0"
            aria-valuemax={selectedBudget.amount}
          >
            {Math.round(((selectedBudget.amount - 300) / selectedBudget.amount) * 100)} %
          </div>
        </div>

        {/* piirakkakaavio budjetin käytöstä */}
        <div style={{ height: "300px" }}>
          <Doughnut
            data={{
              labels: ["Jäljellä", "Käytetty"],
              datasets: [
                {
                  data: [selectedBudget.amount - 300, 300], // pitää hakea oikeat tiedot
                  backgroundColor: ["#36A2EB", "#FF6384"],
                  hoverBackgroundColor: ["#36A2EB", "#FF6384"],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>

        {/* lista tapahtumista (tiedot kannasta)  */}
        <h5 className="mt-4">Tapahtumat</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Päivämäärä</th>
              <th>Kategoria</th>
              <th>Summa (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>pvm</td> {/* (tiedot kannasta)  */}
              <td>-</td> {/* (tiedot kannasta)  */}
              <td>-€</td> {/* (tiedot kannasta)  */}
            </tr>
          </tbody>
        </table>
      </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="danger" onClick={() => handleDelete(selectedBudget.id)}>Poista budjetti</Button>
  </Modal.Footer>
</Modal>

      {/* Budjetin poistovarmistuspopuppi */}
      <Modal show={showDeleteConfirmPopup} onHide={() => setShowDeleteConfirmPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Oletko varma, että haluat poistaa tämän budjetin?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tätä toimintoa ei voi peruuttaa.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmPopup(false)}>Peruuta</Button>
          <Button variant="danger" onClick={confirmDelete}>Poista budjetti</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BudgetListPage;
