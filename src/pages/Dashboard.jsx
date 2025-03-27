import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Card } from "react-bootstrap";
import TransactionList from "../components/TransactionList";
import AccountSelectionModule from "../components/AccountSelectionModule";
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

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const { user } = useContext(UserContext);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null); // Tallennetaan valittu tili
  const navigate = useNavigate();

  // Varmistetaan, että käyttäjä on kirjautunut
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const isFirstLogin = sessionStorage.getItem("isFirstLogin");

      if (isFirstLogin !== "true") {
        sessionStorage.setItem("isFirstLogin", "true");
        setShowAccountModal(true); // Avaa tili valintaikkuna ensimmäistä kertaa
      }
    }
  }, [user, navigate]);

  // Jos ei ole käyttäjää, näytetään latausruutu
  if (!user) return <div>Loading...</div>;

  // Esimerkkidata grafiikoille
  const pieData1 = {
    labels: ["Käytetty (€)", "Jäljellä (€)"],
    datasets: [
      {
        data: [],
        backgroundColor: ["#ffce56", "#36a2eb"],
      },
    ],
  };

  const pieData2 = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  const barData = {
    labels: [],
    datasets: [
      {
        label: "Menot (€)",
        backgroundColor: "#36a2eb",
        data: [],
      },
    ],
  };

  return (
    <Container fluid className="p-4">
      {/* AccountSelectionModule komponenteja, jotka avautuvat tarvittaessa */}
      <AccountSelectionModule
        show={showAccountModal}
        handleClose={() => setShowAccountModal(false)}
        userId={user.id}
        setSelectedAccount={setSelectedAccount}
      />

  

      {/* Muu sisältö Dashboardissa */}
      <Row className="justify-content-center">
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









