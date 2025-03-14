import React, { useActionState, useState } from "react";
import { Link } from "react-router-dom";
import CategoryDropdown from "../components/CategoryDropdown";
import {
  findTransactionCategory,
  TransactionCategory,
} from "../constants/TransactionCategory";
import { createTransaction } from "../actions/Transactions";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import TransactionFileImport from "../components/TransactionFileImport";

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
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* Kortti lomakkeelle */}
          <Card className="shadow p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Lisää pankkitapahtuma</h2>

              {/* Lomake pankkitapahtuman lisäämiseksi */}
              <Form action={formAction}>
                <Form.Group className="mb-3">
                  <Form.Label>Tapahtuman tyyppi</Form.Label>
                  <Form.Select
                    name="type"
                    onChange={(e) =>
                      setTransactionCategory(
                        findTransactionCategory(e.target.value)
                      )
                    }
                  >
                    <option value={TransactionCategory.EXPENSE.id}>Kulu</option>
                    <option value={TransactionCategory.INCOME.id}>Tulo</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Summa</Form.Label>
                  <Form.Control type="number" name="amount" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Saaja/Maksaja</Form.Label>
                  <Form.Control type="text" name="payee-payer" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Päivämäärä</Form.Label>
                  <Form.Control type="date" name="date" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Viitenumero</Form.Label>
                  <Form.Control type="number" name="reference-number" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Kuvaus</Form.Label>
                  <Form.Control as="textarea" name="description" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tili</Form.Label>
                  <Form.Control type="text" name="account" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Kategoria</Form.Label>
                  <CategoryDropdown categoryType={transactionCategory} />
                </Form.Group>

                {/* Lähetä-painike, joka on estetty kun tapahtuma on käsittelyssä */}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isPending}
                  className="w-100"
                >
                  {isPending ? "Lisätään..." : "Lisää"}
                </Button>
                {/* Virheilmoitus, jos lomakkeen lähetyksessä on ongelma */}
                {formState && (
                  <div className="text-danger mt-3 text-center">
                    {formState}
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
          {/* Kortti tiedoston tuonnille */}
          <Card className="shadow p-4 mt-4">
            <Card.Body>
              <h3 className="text-center">Tuo tiedostosta</h3>
              <p className="text-center">Tiedoston on oltava .csv-muodossa.</p>
              <TransactionFileImport />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TransactionImport;
