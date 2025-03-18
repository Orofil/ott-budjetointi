import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

function Login() {
  return (
    <Col>
    <div className="d-flex flex-column align-items-center" style={{ paddingTop: "20vh", paddingBottom: "0vh"}} >
      <Row><h2>Kirjaudu sisään</h2> <p></p></Row>

      {/* Käyttäjätunnus */}
      <Row className="mb-3 w-100 justify-content-center">
        <Col xs={6} md={4} className="text-end fw-bold">Käyttäjätunnus</Col>
        <Col xs={6} md={4}>
          <Form.Control type="text" placeholder="Tunnus" />
        </Col> 
        <Col xs={6} md={4} type="text" placeholder="testi"/>
      </Row>

      {/* Salasana */}
      <Row className="mb-3 w-100 justify-content-center">
        <Col xs={6} md={4} className="text-end fw-bold">Salasana</Col>
        <Col xs={6} md={4}>
          <Form.Control type="password" placeholder="Salasana" />
        </Col>
        <Col xs={6} md={4} type="text" placeholder="testi"/>
      </Row>

      {/* Kirjaudu - nappi sekä linkit - unohtunut salasana & rekisteröidy tästä */}
      <Row className="mb-3 w-100 justify-content-center">
        
        <Col xs={4} md={2} className="text-start">
          <div className="text-muted fst-italic" style={{ cursor: "pointer" }}>
            <a href="#" className="text-decoration-none">Unohtunut salasana?</a>
          </div>
          <div className="text-muted fst-italic" style={{ cursor: "pointer" }}>
            <a href="#" className="text-decoration-none">Rekisteröidy tästä</a>
          </div>
        </Col>
        <Col xs={4} md={2}>
          <Button color= 'white'>Kirjaudu</Button>
        </Col>
      </Row>

      
    </div>
 </Col>
  );

}


export default Login;
