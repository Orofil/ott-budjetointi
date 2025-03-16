import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import TransactionList from "../components/TransactionList";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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

  // Määrittää "Budjettia käytetty/jäljellä" -piirakkadiagrammin
  const pieData1 = {
    labels: ["Käytetty (€)", "Jäljellä (€)"],
    datasets: [
      {
        data: [], // Tähän kuinka paljon budjettia käytetty/jäljellä
        backgroundColor: ["#ffce56", "#36a2eb"], // Tähän eri siivujen värit
      },
    ],
  };

  // Määrittää "Menot kategorioittain" -piirakkadiagrammin
  const pieData2 = {
    labels: [], // Tähän kategorioitten nimet
    datasets: [
      {
        data: [], // Tähän menot kategorioittain
        backgroundColor: [], // Tähän eri siivujen värit
      },
    ],
  };

  // Määrittää pylväsdiagrammin
  const barData = {
    labels: [], // Tähän päivän numerot
    datasets: [
      {
        label: "Menot (€)",
        backgroundColor: "#36a2eb",
        data: [], // Tähän menot päivittäin
      },
    ],
  };

  const navigateToTransaction = async () => {
    navigate("/transaction-import");
  };
  const navigateToBudgets = async () => {
    navigate("/budgets");
  };

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        {/* Piirakkadiagrammit */}
        <Col md={6}>
          <Card className="shadow p-4">
            <Card.Body>
              <h4 className="text-center">Budjettia käytetty/jäljellä</h4>
              <Pie data={pieData1} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow p-4">
            <Card.Body>
              <h4 className="text-center">Menot kategorioittain</h4>
              <Pie data={pieData2} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pylväsdiagrammi - Kuukauden menot päivittäin */}
      <Row className="justify-content-center mt-4">
        <Col md={12}>
          <Card className="shadow p-4">
            <Card.Body>
              <h4 className="text-center">Menot tässä kuussa</h4>
              <Bar data={barData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tapahtumalista */}
      <Row className="justify-content-center mt-4">
        <Col md={12}>
          <Card className="shadow p-4">
            <Card.Body>
              <h4 className="text-center">Viimeisimmät tapahtumat</h4>
              <TransactionList />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
