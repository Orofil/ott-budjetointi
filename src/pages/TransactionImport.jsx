import React, { useActionState, useState } from "react";
import { Link } from "react-router-dom";
import CategoryDropdown from "../components/CategoryDropdown";
import { TransactionCategory } from "../constants/TransactionCategory";
import { createTransaction } from "../actions/Transactions";
import {
  Container,
  Row,
  Navbar,
  Nav,
  Offcanvas,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function TransactionImport() {
  const [transactionCategory, setTransactionCategory] = useState(
    TransactionCategory.EXPENSE
  );
  const [formState, formAction, isPending] = useActionState(
    createTransaction,
    null
  );
  // FIXME preventDefaultia ei ole tätä käytettäessä, joten inputit tyhjentyvät aina vaikka inputit eivät olisi oikein

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
          <h2>Lisää pankkitapahtuma</h2>
          <Link to="/dashboard">Takaisin</Link>
          <form action={formAction}>
            <label>
              Tapahtuman tyyppi:
              <select
                name="type"
                onChange={(e) => setTransactionCategory(e.target.value)}
              >
                <option value={TransactionCategory.EXPENSE}>Kulu</option>
                <option value={TransactionCategory.INCOME}>Tulo</option>
              </select>
            </label>
            <br />
            <label>
              Summa: <input type="number" name="amount" />
            </label>
            <br />
            <label>
              Saaja/Maksaja: <input type="text" name="payee-payer" />
            </label>
            <br />
            <label>
              Päivämäärä: <input type="date" name="date" />
            </label>
            <br />
            <label>
              Viitenumero: <input type="number" name="reference-number" />
            </label>
            <br />
            <label>
              Kuvaus: <textarea name="description" />
            </label>
            <br />
            <label>
              Tili: <input type="text" name="account" />
            </label>
            <br />
            <label>
              Kategoria: <CategoryDropdown categoryType={transactionCategory} />
            </label>
            <br />
            <button type="submit" disabled={isPending}>
              {isPending ? "Lisätään..." : "Lisää"}
            </button>
            <br />
            {formState && <span style={{ color: "red" }}>{formState}</span>}
          </form>
        </div>
      </Row>
    </Container>
  );
}

export default TransactionImport;
