import React, { useState } from "react"; 
import supabase from "../config/supabaseClient"; 
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Card } from "react-bootstrap";

function Login() {

  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [message, setMessage] = useState("");  
  const [isEmailSent, setIsEmailSent] = useState(false);  

  // handleSubmit on funktio, joka hoitaa lomakkeen lähettämisen ja sisäänkirjautumisen
  const handleSubmit = async (event) => {
    event.preventDefault();  
    setMessage("");  

    // Yritetään kirjautua Supabase-palvelun avulla
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Jos virhe ilmenee kirjautumisen aikana, näytetään virheilmoitus 
    if (error) {
      setMessage(error.message); 

      // Jos virheilmoitus liittyy sähköpostin varmistamiseen, pyydetään käyttäjää painamaan 'lähetä uusi vahvistuslinkki'-painiketta.
      if (error.message.toLowerCase().includes("confirm")) {
        setIsEmailSent(true);
      }
      return;  
    }

    
    // Tarkistetaan, onko sähköposti vahvistettu
    if (data.user && !data.user.email_confirmed_at) {
      setMessage("Sähköpostia ei ole vahvistettu. Tarkista sähköpostisi.");
      setIsEmailSent(true);
      return;
    }

    setMessage("Kirjautuminen onnistui!");
    navigate("/dashboard");
  };

  // handleResendConfirmation lähettää vahvistuslinkin uudelleen
  const handleResendConfirmation = async () => {
    setMessage(""); // Tyhjennetään viesti ennen uutta pyyntöä
  
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false }, // Estetään uuden käyttäjän luonti
    });
  
    if (error) {
      setMessage("Vahvistuslinkin lähetys epäonnistui. Yritä uudelleen.");
    } else {
      setMessage("Vahvistuslinkki on lähetetty uudelleen. Tarkista sähköpostisi.");
    }
  };

  return (
    <Col>
     
      <div className="d-flex flex-column align-items-center" style={{ paddingTop: "20vh", paddingBottom: "0vh"}} >
        <Card className="shadow p-4" style={{ width: "36rem" }}>
          <Card.Body className="text-center"><h2>Kirjaudu sisään</h2> <p></p></Card.Body>
  
          <Form onSubmit={handleSubmit}>
            {/* Käyttäjätunnus */}
            <Row className="mb-3 w-100 justify-content-center">
              <Col xs={6} md={4} className="text-end fw-bold">Sähköposti</Col>
              <Col xs={4} md={6} style={{ width: "20rem" }}>
                <Form.Control
                  onChange={(e) => setEmail(e.target.value)}  // Päivitetään sähköposti-tila
                  value={email}
                  type="email"
                  placeholder="Sähköposti"
                  required  // Tämä kenttä on pakollinen
                />
              </Col> 
              <Col xs={6} md={4} type="text" placeholder="testi"/>
            </Row>
      
            {/* Salasana */}
            <Row className="mb-3 w-100 justify-content-center">
              <Col xs={6} md={4} className="text-end fw-bold">Salasana</Col>
              <Col xs={4} md={6} style={{ width: "20rem" }}>
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}  // Päivitetään salasana-tila
                  value={password}
                  type="password"
                  placeholder="Salasana"
                  required  // Tämä kenttä on pakollinen
                />
              </Col>
              <Col xs={6} md={4} type="text" placeholder="testi"/>
            </Row>
      
            {/* TODO tästä paremman näköinen */}
            {message && <span>{message}</span>}  {/* Näytetään mahdollinen virheilmoitus tai onnistumisviesti */}

            {/* TODO tästä paremman näköinen */}
            {isEmailSent && (  // Jos sähköposti ei ole vahvistettu, näytetään vaihtoehto lähettää vahvistuslinkki uudelleen
              <div>
                <p>Sähköpostisi ei ole vahvistettu. Voit pyytää uuden vahvistuslinkin.</p>
                <button onClick={handleResendConfirmation}>Lähetä uusi vahvistuslinkki</button>
              </div>
            )}

            {/* Kirjaudu - nappi sekä linkit - unohtunut salasana & rekisteröidy tästä */}
            <Row className="mb-3 w-100 justify-content-center">
              
              <Col xs={4} md={6} className="text-start">
                <div className="text-muted fst-italic" style={{ cursor: "pointer" }}>
                  <a href="#" className="text-decoration-none">Unohtunut salasana?</a> {/* TODO toiminnallisuus puuttuu */}
                </div>
                <div className="text-muted fst-italic" style={{ cursor: "pointer" }}>
                  <Link
                    to="/register"
                    className="text-decoration-none">
                    Rekisteröidy tästä
                  </Link>
                </div>
              </Col>
              <Col xs={4} md={4}>
                <Button type="submit" color= 'white'>Kirjaudu</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
      
    </Col>
  );
}

export default Login;