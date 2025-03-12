import {
  Container,
  Navbar,
  Nav,
  Offcanvas,
  Button,
} from "react-bootstrap";

const HeaderNav = () => (
  <Container fluid className="p-0"> {/* TODO en saanut toimimaan ilman ylimääräistä Containeria tässä, poista kommentti jos asialla ei ole väliä */}
    {/* Yläpalkki - Sisältää navigaation ja profiililinkin */}
    <Navbar
      bg="dark"
      variant="dark"
      expand={false}
      className="px-3 d-flex align-items-center w-100"
    >
      {/* Hampurilaisvalikko - avaa offcanvas-navigaation */}
      <Navbar.Toggle aria-controls="offcanvasNavbar" className="me-3" />
      <Navbar.Brand className="text-white mx-auto">
        Budjetointityökalu
      </Navbar.Brand>
      {/* Offcanvas-sivupalkki, joka sisältää navigointilinkit */}
      <Navbar.Offcanvas
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasNavbarLabel">Valikko</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Placeholder navigointilinkit - eivät johda vielä mihinkään */}
          <Nav className="flex-column">
            <Nav.Link href="#">Kotisivu</Nav.Link>
            <Nav.Link href="#">Tapahtumien tuonti</Nav.Link>
            <Nav.Link href="#">Budjettien hallinta</Nav.Link>
            <Nav.Link href="#">Asetukset</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
      {/* Profiilipainike oikeassa reunassa */}
      <Nav className="ms-auto d-flex align-items-center">
        <Button variant="outline-light">Profiili</Button>
      </Nav>
    </Navbar>
  </Container>
);
export default HeaderNav;