import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import TransactionList from "../components/TransactionList";
import CategoryDropdown from "../components/CategoryDropdown";
import { TransactionCategory } from "../constants/TransactionCategory";
import {
  Container,
  Row,
  Navbar,
  Nav,
  Offcanvas,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Kirjaudu ulos Supabasesta
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Jos uloskirjautumisessa tapahtui virhe, tulostetaan virheilmoitus
      console.error("Virhe uloskirjautumisessa:", error.message);
    } else {
      // Jos uloskirjautuminen onnistui, ohjataan käyttäjä kirjautumissivulle
      navigate("/login");
    }
  };

  const navigateToTransaction = async () => {
    navigate("/transaction-import");
  };
  const navigateToBudgets = async () => {
    navigate("/budgets");
  };

  return (
    <Container fluid className="p-0">
      {/* Yläpalkki - Sisältää navigaation ja profiililinkin */}
      <Navbar
        bg="dark"
        variant="dark"
        expand={false}
        className="px-3 d-flex align-items-center w-100"
      >
        {/* Hampurilaisvalikko - avaa offcanvas-navigaation */}
        <Navbar.Toggle aria-controls="offcanvasNavbar" className="me-3" />
        <Navbar.Brand className="text-white mx-auto">
          Budjetointityökalu
        </Navbar.Brand>
        {/* Offcanvas-sivupalkki, joka sisältää navigointilinkit */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Valikko</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* Placeholder navigointilinkit - eivät johda vielä mihinkään */}
            <Nav className="flex-column">
              <Nav.Link href="#">Kotisivu</Nav.Link>
              <Nav.Link href="#">Tapahtumien tuonti</Nav.Link>
              <Nav.Link href="#">Budjettien hallinta</Nav.Link>
              <Nav.Link href="#">Asetukset</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        {/* Profiilipainike oikeassa reunassa */}
        <Nav className="ms-auto d-flex align-items-center">
          <Button variant="outline-light">Profiili</Button>
        </Nav>
      </Navbar>

      {/* Pääsisältöalue */}
      <Row className="min-vh-100">
        <div>
          <h2>Etusivu</h2>
          <h3>Tapahtumat</h3>
          <TransactionList />
          <hr />
          <button onClick={navigateToTransaction}>Lisää pankkitapahtuma</button>
          <button onClick={navigateToBudgets}>Budjetit</button>
          <button onClick={handleLogout}>Kirjaudu ulos</button>
        </div>
      </Row>
    </Container>
  );
}

export default Dashboard;
