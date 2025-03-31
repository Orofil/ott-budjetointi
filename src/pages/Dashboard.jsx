import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useChartData } from "../hooks/useChartData"; // Tuodaan erillinen tiedoston funktio
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import TransactionList from "../components/TransactionList";
import AccountSelectionModule from "../components/AccountSelectionModule";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const { user } = useContext(UserContext);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [pieData1, setPieData1] = useState({
    labels: ["Budjetti (€)"],
    datasets: [{ data: [0], backgroundColor: ["#36a2eb"] }],
  });
  const [pieData2, setPieData2] = useState({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
  const [barData, setBarData] = useState({ labels: [], datasets: [{ label: "Menot (€)", backgroundColor: "#36a2eb", data: [] }] });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;

    const getData = async () => {
      const data = await useChartData(user.id);
      if (data) {
        setBarData(data.barData);
        setPieData2(data.pieData2);
      }
    };

    getData();
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <Container fluid className="p-4">
      <AccountSelectionModule
        show={showAccountModal}
        handleClose={() => setShowAccountModal(false)}
        userId={user.id}
        setSelectedAccount={setSelectedAccount}
      />
      <Row className="justify-content-center">
        <Col md={12} className="text-center">
          <h4>Käyttäjä: {user.email}</h4>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow p-4">
            <Card.Body>
              <h4 className="text-center">Budjettin määrä</h4>
              <Pie data={pieData1} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow p-4">
            <Card.Body>
              <h4 className="text-center">Menot kategorioittain (Piirakkadiagrammi)</h4>
              <Pie data={pieData2} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={12}>
          <Card className="shadow p-4">
            <Card.Body>
              <h4 className="text-center">Menot tässä kuussa (Pylväsdiagrammi)</h4>
              <Bar data={barData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={12}>
          <Card className="shadow p-4">
            <Card.Body>
              <Container className="py-3 d-flex align-items-center justify-content-center">
                <div className="me-5" style={{ width: "15rem" }}></div>
                <h4 className="m-0">Lisätyt tapahtumat</h4>
                <Button href="/transaction-import" variant="primary" className="ms-5" style={{ width: "15rem" }}>
                  Tuo uusia pankkitapahtumia
                </Button>
              </Container>
              <TransactionList />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
