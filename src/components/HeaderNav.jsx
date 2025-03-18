import { Container, Navbar, Nav, Offcanvas, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HeaderNav = () => (
  <Container fluid className="p-0">
    {" "}
    {/* TODO en saanut toimimaan ilman ylimääräistä Containeria tässä, poista kommentti jos asialla ei ole väliä */}
    {/* Yläpalkki */}
    <Navbar bg="dark" variant="dark" expand="md" className="w-100 px-3">
      <Container
        fluid
        className="d-flex align-items-center justify-content-between"
      >
        {/* Hampurilaisvalikko (vain mobiilinäkymässä) */}
        <Navbar.Toggle aria-controls="offcanvasNavbar" className="d-md-none" />

        {/* Budjetointityökalu-otsikko (vain työpöytänäkymässä) */}
        <Navbar.Brand className="text-white d-none d-md-block">
          Budjetointityökalu
        </Navbar.Brand>

        {/* Navigaatio työpöytänäkymässä */}
        <Nav className="d-none d-md-flex mx-auto">
          <Nav.Link as={Link} to="/dashboard" className="text-white mx-3">
            Kotisivu
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/transaction-import"
            className="text-white mx-3"
          >
            Tapahtumien tuonti
          </Nav.Link>
          <Nav.Link as={Link} to="/budgets" className="text-white mx-3">
            Budjettien hallinta
          </Nav.Link>
          <Nav.Link as={Link} to="#" className="text-white mx-3">
            Asetukset
          </Nav.Link>
        </Nav>

        {/* Profiilipainike oikealla */}
        <Button variant="outline-light" className="ms-auto">
          Profiili
        </Button>

        {/* Mobiilin hampurilaisvalikko */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          style={{ width: "300px" }}
          className="d-md-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Valikko</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/dashboard">
                Kotisivu
              </Nav.Link>
              <Nav.Link as={Link} to="/transaction-import">
                Tapahtumien tuonti
              </Nav.Link>
              <Nav.Link as={Link} to="/budgets">
                Budjettien hallinta
              </Nav.Link>
              <Nav.Link as={Link} to="#">
                Asetukset
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  </Container>
);
export default HeaderNav;
