import React, { useState } from "react";
import supabase from "../config/supabaseClient";
import { Link } from "react-router-dom";
import { AuthWeakPasswordError, isAuthWeakPasswordError } from "@supabase/supabase-js";
import { Form, Col, Card, Button } from "react-bootstrap";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Nollataan aiemmat viestit

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (isAuthWeakPasswordError(error)) {
      setMessage("Salasana on liian lyhyt. Sen on oltava vähintään 6 merkkiä.");
      return;
    } else if (error) {
      console.error("Supabase auth signUp error:", error);
      setMessage("Tapahtui virhe, yritä uudelleen.");
      return;
    }

    setMessage("Käyttäjätili luotu! Vahvista sähköpostisi.");
    setEmailSent(true);
    setEmail(""); // Tyhjennetään sähköposti
    setPassword(""); // Tyhjennetään salasana
  };

  const resendEmail = async () => {
    const { data, error } = await supabase.auth.resendConfirmationEmail(email);

    if (error) {
      console.error("Supabase resend email error:", error);
      setMessage("Sähköpostin lähetys epäonnistui. Yritä uudelleen.");
    } else {
      setMessage("Vahvistuslinkki lähetetty uudelleen!");
    }
  };

  return (
    <Col>
     
     <div className="d-flex flex-column align-items-center" style={{ paddingTop: "10vh", paddingBottom: "0vh"}} >
       <Card className="shadow p-4">
         <Card.Body className="text-center"><h2>Rekisteröidy tästä</h2> <p></p></Card.Body>
 
       <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className= "fw-bold">Sähköposti</Form.Label>
              <Form.Control 
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Sähköposti"
                  required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className= "fw-bold">Salasana</Form.Label>
              <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Salasana"
                  required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Luo tili
            </Button>
          </Form>

          {emailSent && (
            <div className="mt-3 text-center">
              <p>Jos et ole saanut vahvistuslinkkiä, pyydä se uudelleen:</p>
              <Button variant="link" onClick={resendEmail}>Lähetä vahvistuslinkki uudelleen</Button>
            </div>
          )}

          <hr />

          <div className="text-center">
            <span>Onko sinulla jo tili?</span> <br />
            <Link to="/login" className="btn btn-outline-primary mt-2">Kirjaudu sisään</Link>
          </div>
        
      </Card>
      </div>
    </Col>
  );
}

export default Register;
