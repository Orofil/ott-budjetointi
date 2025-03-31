import { useContext, useState } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import BudgetListItem from "../components/BudgetListItem";
import CreateBudgetPage from "./CreateBudget";
import { Doughnut } from "react-chartjs-2";

// Tämä komponentti hakee ja näyttää kaikki budjetit tietokannasta.
const BudgetListPage = () => {
  const { budgets, deleteBudget, loading } = useContext(BudgetContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotFound, setShowNotFound] = useState(false); // Löytyikö hakusanalla budjetteja
  const [showPopup, setShowPopup] = useState(false);
  const [showBudgetPopup, setShowBudgetPopup] = useState(false); // Onko budjetin tarkastelun modal näkyvissä
  const [selectedBudget, setSelectedBudget] = useState(null); // Budjetti popupia varten
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);

  // Ilmoitus, jos haettua budjettia ei löydy
  const handleSearch = () => {
    const found = budgets.some(b => b.budget_name.toLowerCase().includes(searchQuery.toLowerCase()));
    setShowNotFound(!found);
  };

  // Mahdollisuus budjettin poistoon
  const handleDelete = (id) => {
    deleteBudget(id);
    setShowDeleteConfirmPopup(true);
  };

  // Poistaa budjetin, jos varmistus hyväksytään
  const confirmDelete = () => {
    deleteBudget(selectedBudget.id);
    setShowDeleteConfirmPopup(false);
    setShowBudgetPopup(false);
  };

  return (
    <div fluid="true" className="budget-list-page">
      {/* Pääsisältöalue budjettien hallinnan sivulla */}
      <Row className="min-vh-100 p-3"> 
        <div className="main-content w-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Omat budjetit</h2>
            <Button variant="success" className="px-4 py-2" onClick={() => setShowPopup(true)}>
              Uusi budjetti
            </Button>
          </div>
          <div className="text-muted bg-light p-3 rounded-3 shadow-sm">
            <p className="mb-1">Hallinnoi ja seuraa budjettejasi helposti. Pidä taloutesi hallinnassa tarkastelemalla, muokkaamalla ja poistamalla budjetteja tai luomalla uusia.</p>
            <p className="mb-0">Seuraa budjettiesi tilannetta reaaliajassa ja varmista, että pysyt suunnitelmassasi. </p>
          </div>
          <p className="text-dark"></p> {/* Sisennys */}

          {/* Hakukenttä */}
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
            {/* Jos budjetteja ladataan vielä */}
            {loading && <p>Ladataan...</p>}
            {/* Näytetään joko hakutulokset tai kaikki budjetit jos mitään ei ole haettu */}
            {!loading && (searchQuery
            ? budgets.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : budgets).map((budget) => (
              <BudgetListItem
              key={budget.id}
              budget={budget}
              onAction={() => {
                setSelectedBudget(budget);
                setShowBudgetPopup(true);
              }} />
            ))}
            {/* Jos budjetteja ei ole */}
            {!budgets.length && (
              <p>Ei budjetteja</p>
            )}
          </Row>

          <div className="new-budget-button">
            <Link to="/create-budget">
              <button>Lisää uusi budjetti</button>
            </Link>
          </div>
        </div>
      </Row>

      {/* Uuden budjetin lisäys popuppina ("uusi budjetti") */}
      <CreateBudgetPage showPopup={showPopup} setShowPopup={setShowPopup} />

      {/* Fullscreen popup budjetin tarkasteluun aukeaa "tarkastele" buttonista */}
      <Modal show={showBudgetPopup} onHide={() => setShowBudgetPopup(false)} centered fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBudget?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBudget && (
            <>
                <h4>Budjetin tiedot:</h4>
                <p><strong>Budjetti:</strong> {selectedBudget.amount} €</p>
                <p><strong>Kategoria:</strong> {selectedBudget.category}</p>
                <p><strong>Aikaväli:</strong> {selectedBudget.startDate?.toLocaleDateString('fi-FI')} - {selectedBudget.endDate?.toLocaleDateString('fi-FI')}</p>
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
