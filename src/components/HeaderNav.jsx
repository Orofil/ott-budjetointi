import {
  Container,
  Navbar,
  Nav,
  Offcanvas,
  Button,
  Dropdown,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const HeaderNav = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Hakee käyttäjän tilit
  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id);

    if (!error) {
      setAccounts(data);
    }
  };

  // Tilin lisäys
  const handleCreateAccount = async () => {
    if (!newAccountName.trim() || !newAccountNumber.trim()) {
      setErrorMessage("Tilin nimi ja tilinumero eivät voi olla tyhjiä.");
      setShowAlert(true);
      return;
    }

    if (accounts.some(acc => acc.account_name === newAccountName.trim())) {
      setErrorMessage("Tilin nimi on jo käytössä.");
      setShowAlert(true);
      return;
    }

    if (accounts.some(acc => acc.account_number === newAccountNumber.trim())) {
      setErrorMessage("Tilinumero on jo käytössä.");
      setShowAlert(true);
      return;
    }

    setIsCreating(true);

    const { data, error } = await supabase
      .from("accounts")
      .insert([{ account_name: newAccountName.trim(), account_number: newAccountNumber.trim(), user_id: user.id }])
      .select();

    if (!error && data?.length > 0) {
      setAccounts([...accounts, data[0]]);
      setNewAccountName("");
      setNewAccountNumber("");
      setShowAccountModal(false); // Sulje modal
    } else {
      setErrorMessage("Tilin luonti epäonnistui. Yritä uudelleen.");
      setShowAlert(true);
    }

    setIsCreating(false);
  };

  // Kirjaa käyttäjän ulos
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/login"); // Uudelleenohjaa kirjautumissivulle
    } else {
      console.error("Uloskirjautumisvirhe:", error.message);
    }
  };

  return (
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" expand="md" className="w-100 px-3">
        <Container
          fluid
          className="d-flex align-items-center justify-content-between"
        >
          <Navbar.Toggle aria-controls="offcanvasNavbar" className="d-md-none" />
          <Navbar.Brand className="text-white d-none d-md-block">
            Budjetointityökalu
          </Navbar.Brand>

          {user && (
            <Nav className="d-none d-md-flex mx-auto">
              <Nav.Link as={Link} to="/dashboard" className="text-white mx-3">
                Kotisivu
              </Nav.Link>
              <Nav.Link as={Link} to="/transaction-import" className="text-white mx-3">
                Tapahtumien tuonti
              </Nav.Link>
              <Nav.Link as={Link} to="/budgets" className="text-white mx-3">
                Budjettien hallinta
              </Nav.Link>
              <Nav.Link as={Link} to="/settings" className="text-white mx-3">
                Asetukset
              </Nav.Link>
            </Nav>
          )}

          {/* Profiili-dropdown */}
          {user ? (
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                {user.email || "Profiili"}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => setShowAccountModal(true)}>Lisää tili</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Kirjaudu ulos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button variant="outline-light" onClick={() => navigate("/login")}>Kirjaudu sisään</Button>
          )}

          {/* Mobiilin hampurilaisvalikko */}
          {user && (
            <Navbar.Offcanvas id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" placement="start" style={{ width: "300px" }} className="d-md-none">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel">Valikko</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-column">
                  <Nav.Link as={Link} to="/dashboard">Kotisivu</Nav.Link>
                  <Nav.Link as={Link} to="/transaction-import">Tapahtumien tuonti</Nav.Link>
                  <Nav.Link as={Link} to="/budgets">Budjettien hallinta</Nav.Link>
                  <Nav.Link as={Link} to="/settings">Asetukset</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          )}
        </Container>
      </Navbar>

      {/* Tilin lisäysmodal */}
      <Modal show={showAccountModal} onHide={() => setShowAccountModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Lisää uusi tili</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>{errorMessage}</Alert>}

          <Form>
            <Form.Group controlId="newAccountName">
              <Form.Label>Tilin nimi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Esim. Säästötili"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newAccountNumber" className="mt-2">
              <Form.Label>Tilinumero</Form.Label>
              <Form.Control
                type="text"
                placeholder="Esim. 123456-789"
                value={newAccountNumber}
                onChange={(e) => setNewAccountNumber(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" className="mt-3 w-100" onClick={handleCreateAccount} disabled={isCreating}>
              {isCreating ? "Luodaan..." : "Lisää tili"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HeaderNav;
