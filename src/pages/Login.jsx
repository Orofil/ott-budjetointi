import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Card } from "react-bootstrap";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Tarkistetaan, onko käyttäjä jo kirjautunut
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        setMessage("Väärä sähköposti tai salasana.");
      } else if (error.message.toLowerCase().includes("confirm")) {
        setMessage("Sähköpostiasi ei ole vahvistettu. Tarkista sähköpostisi.");
        setIsEmailSent(true);
      } else {
        setMessage("Kirjautuminen epäonnistui. Yritä uudelleen.");
      }
      return;
    }

    if (data.user && !data.user.email_confirmed_at) {
      setMessage("Sähköpostia ei ole vahvistettu. Tarkista sähköpostisi.");
      setIsEmailSent(true);
      return;
    }

    setMessage("Kirjautuminen onnistui!");
    navigate("/dashboard");
  };

  const handleResendConfirmation = async () => {
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setMessage(error ? "Vahvistuslinkin lähetys epäonnistui." : "Vahvistuslinkki lähetetty uudelleen.");
  };

  return (
    <Col>
      <div className="d-flex flex-column align-items-center" style={{ paddingTop: "20vh" }}>
        <Card className="shadow p-4" style={{ width: "36rem" }}>
          <Card.Body className="text-center">
            <h2>Kirjaudu sisään</h2>
          </Card.Body>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 w-100 justify-content-center">
              <Col xs={6} md={4} className="text-end fw-bold">Sähköposti</Col>
              <Col xs={4} md={6}>
                <Form.Control type="email" placeholder="Sähköposti" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Col>
            </Row>

            <Row className="mb-3 w-100 justify-content-center">
              <Col xs={6} md={4} className="text-end fw-bold">Salasana</Col>
              <Col xs={4} md={6}>
                <Form.Control type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Col>
            </Row>

            {message && <div className="text-center text-danger">{message}</div>}

            {isEmailSent && (
              <div className="text-center">
                <p>Sähköpostisi ei ole vahvistettu. Voit pyytää uuden vahvistuslinkin.</p>
                <Button variant="secondary" onClick={handleResendConfirmation}>Lähetä uusi vahvistuslinkki</Button>
              </div>
            )}

            <Row className="mb-3 w-100 justify-content-center">
              <Col xs={4} md={6} className="text-start">
                <div className="text-muted fst-italic">
                  <Link to="/forgot-password" className="text-decoration-none">Unohtunut salasana?</Link>
                </div>
                <div className="text-muted fst-italic">
                  <Link to="/register" className="text-decoration-none">Rekisteröidy tästä</Link>
                </div>
              </Col>
              <Col xs={4} md={4}>
                <Button type="submit" variant="primary">Kirjaudu</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </Col>
  );
}

export default Login;