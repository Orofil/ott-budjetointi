import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { AuthWeakPasswordError, isAuthWeakPasswordError } from "@supabase/supabase-js";


function ForgotPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

      // tällä tarkastetaan onko käyttäjä tullut palautuslinkin kautta
      useEffect(() => {
        const checkUser = async () => {
          const { data, error } = await supabase.auth.getUser();
          if (data.user) {
            setIsTokenValid(true);
          } else {
            setMessage("Salasanan palautuslinkki ei ole voimassa. Pyydä uusi linkki.");
          }
        };
        checkUser();
      }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.updateUser({
      password,
    });
 
    if (isAuthWeakPasswordError(error)) {
      setMessage("Salasana on liian lyhyt. Sen on oltava vähintään 6 merkkiä.");
      return;
    } else if (error) {
      console.error("Supabase auth signUp error:", error);
      setMessage("Tapahtui virhe, yritä uudelleen.");
      return;
    } else {
        setMessage("Salasana vaihdettu onnistuneesti!");
        navigate("/login");
      }
  };


  return (
    <Col>
      <div className="d-flex flex-column align-items-center" style={{ paddingTop: "20vh" }}>
        <Card className="shadow p-4" style={{ width: "36rem" }}>
          <Card.Body className="text-center">
            <h2>Vaihda salasana</h2>
          </Card.Body>

          {!isTokenValid ? (
            <p className="text-center text-danger">{message}</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3 w-100 justify-content-center">
                <Col xs={6} md={4} className="text-end fw-bold">Uusi salasana</Col>
                <Col xs={4} md={6}>
                  <Form.Control type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Col>
              </Row>

              {message && <div className="text-center text-danger">{message}</div>}

              <Row className="mb-3 w-100 justify-content-center">
                <Col xs={4} md={4}>
                  <Button type="submit" variant="primary">Vaihda salasana</Button>
                </Col>
              </Row>
            </Form>
          )}
        </Card>
      </div>
    </Col>
  );
}

export default ForgotPassword;