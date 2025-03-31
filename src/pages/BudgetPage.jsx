import { useContext, useState, useEffect } from "react"; 
import { BudgetContext } from "../context/BudgetContext";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import BudgetListItem from "../components/BudgetListItem";
import CreateBudgetPage from "../components/CreateBudget";
import { Doughnut } from "react-chartjs-2";
import supabase from "../config/supabaseClient";

const BudgetPage = () => {
  const { budgets, deleteBudget, loading } = useContext(BudgetContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotFound, setShowNotFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showBudgetPopup, setShowBudgetPopup] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
  const [usedAmount, setUsedAmount] = useState(0);

  // Uudet muuttujat tapahtuman tiedoille
  const [expenseDates, setExpenseDates] = useState([]); // Tallentaa tapahtumien päivämäärät
  const [expenseCategories, setExpenseCategories] = useState([]); // Tallentaa tapahtumien kategoriat
  const [expenseAmounts, setExpenseAmounts] = useState([]); // Tallentaa tapahtumien summat

  // Ilmoitus, jos haettua budjettia ei löydy
  const handleSearch = () => {
    const found = budgets.some((b) =>
      b.budget_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  // Haetaan valitun budjetin käytetty summa, tapahtumatiedot ja tallennetaan ne erillisiin muuttujiin
  useEffect(() => {
    if (selectedBudget) {
      const fetchUsedAmount = async () => {
        try {
          // Haetaan budjettiin liittyvät tapahtumat
          const { data, error } = await supabase
            .from("budgets_expense_transactions")
            .select("expense_transaction_id")
            .eq("budget_id", selectedBudget.id);

          if (error) throw error;

          const expenseTransactionIds = data.map(
            (transaction) => transaction.expense_transaction_id
          );

          // Jos tapahtumia on, haetaan niiden tiedot
          if (expenseTransactionIds.length > 0) {
            const { data: expenseTransactions, error: expenseError } =
              await supabase
                .from("expense_transactions")
                .select("amount, date, category_id") // Haetaan summa, päivämäärä ja kategoria
                .in("id", expenseTransactionIds);

            if (expenseError) throw expenseError;

            // Lasketaan yhteen käytetty summa
            const totalUsedAmount = expenseTransactions.reduce(
              (sum, transaction) => sum + transaction.amount,
              0
            );
            setUsedAmount(totalUsedAmount);

            // Tallennetaan tapahtumien tiedot erillisiin taulukoihin
            const dates = expenseTransactions.map((transaction) => transaction.date);
            const categories = expenseTransactions.map((transaction) => transaction.category_id);
            const amounts = expenseTransactions.map((transaction) => transaction.amount);

            setExpenseDates(dates); // Päivämäärät
            setExpenseCategories(categories); // Kategoriat
            setExpenseAmounts(amounts); // Summat
          } else {
            setUsedAmount(0);
            setExpenseDates([]);
            setExpenseCategories([]);
            setExpenseAmounts([]);
          }
        } catch (error) {
          console.error("Tapahtumien haku epäonnistui:", error);
        }
      };

      fetchUsedAmount();
    }
  }, [selectedBudget]);

  return (
    <div fluid="true" className="budget-list-page">
       {/* Pääsisältöalue budjettien hallinnan sivulla */}
      <Row className="min-vh-100 p-3">
        <div className="main-content w-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Omat budjetit</h2>
            <Button
              variant="success"
              className="px-4 py-2"
              onClick={() => setShowPopup(true)}
            >
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
                placeholder="Hae budjettia nimellä..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Button variant="primary" className="px-4 py-2" onClick={handleSearch}>
              Hae
            </Button>
          </Stack>

          {showNotFound && <p className="text-danger fw-bold">Tämän nimistä budjettia ei löydy!</p>}

          {/* budjettikortit */}
          <Row className="g-4">
            {/* Jos budjetteja ladataan vielä */}
            {loading && <p>Ladataan...</p>}
            {/* Näytetään joko hakutulokset tai kaikki budjetit jos mitään ei ole haettu */}
            {!loading && (searchQuery
            ? budgets.filter(b => b.budget_name.toLowerCase().includes(searchQuery.toLowerCase()))
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
        </div>
      </Row>

      {/* Uuden budjetin lisäys popupina */}
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
              <p><strong>Käytetty:</strong> {usedAmount} €</p>
              <p><strong>Jäljellä:</strong> {selectedBudget.amount - usedAmount} €</p>

              {/* progress bar näyttää jäljellä olevan budjetin */}
              <div className="progress my-3">
  <div
    className="progress-bar bg-success"
    role="progressbar"
    style={{ width: `${((selectedBudget.amount - usedAmount) / selectedBudget.amount) * 100}%` }}
    aria-valuenow={selectedBudget.amount - usedAmount}
    aria-valuemin="0"
    aria-valuemax={selectedBudget.amount}
  >
    {Math.round(((selectedBudget.amount - usedAmount) / selectedBudget.amount) * 100)} %
  </div>
</div>
              {/* Piirakkadiagrammi budjetin käytöstä */}
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={{
                    labels: ["Jäljellä", "Käytetty"], // Otsikot segmentteihin
                    datasets: [
                      {
                        data: [selectedBudget.amount - usedAmount, usedAmount], // Arvot (jäljellä oleva vs. käytetty)
                        backgroundColor: ["#36A2EB", "#FF6384"], // Värit segmenteille
                        hoverBackgroundColor: ["#36A2EB", "#FF6384"], // Värit, kun osoitin on segmentin päällä
                      },
                    ],
                  }}
                  options={{
                    responsive: true, 
                    maintainAspectRatio: false, 
                  }}
                />
              </div>

              


              {/* Näytetään tapahtumatiedot taulukossa */}
  <h4>Budjetin tapahtumat:</h4>
<table className="table">
  <thead>
    <tr>
      <th>Päivämäärä</th>
      <th>Kategoria</th>
      <th>Summa (€)</th>
    </tr>
  </thead>
  <tbody>
    {expenseDates.map((date, index) => (
      <tr key={index}>
        <td>{date}</td>
        <td>{expenseCategories[index]}</td>
        <td>{expenseAmounts[index]} €</td>
      </tr>
    ))}
  </tbody>
</table>

            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDelete(selectedBudget.id)}>
            Poista budjetti
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Budjetin poistovahvistuspopup */}
      <Modal show={showDeleteConfirmPopup} onHide={() => setShowDeleteConfirmPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Oletko varma, että haluat poistaa tämän budjetin?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tätä toimintoa ei voi peruuttaa.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmPopup(false)}>
            Peruuta
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Poista
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BudgetPage;
