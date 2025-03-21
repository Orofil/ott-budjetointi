import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import TransactionFileImport from "../components/TransactionFileImport";
import TransactionCreation from "../components/TransactionCreation";

function TransactionImport() {
  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* Kortti lomakkeelle */}
          <Card className="shadow p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Lisää pankkitapahtuma</h2>
              <TransactionCreation /> {/* Lomake pankkitapahtuman lisäämiseksi */}
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
