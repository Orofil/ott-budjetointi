import {
  Container,
  Navbar,
  Nav,
  Offcanvas,
  Button,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const HeaderNav = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Kirjaa käyttäjän ulos
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/login"); // Uudelleenohjaa kirjautumissivulle
    } else {
      console.error("Uloskirjautumisvirhe:", error.message);
    }
  };

  return (
    <Container fluid className="p-0">
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

          {/* Navigaatio vain jos käyttäjä on kirjautunut */}
          {user && (
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
              <Nav.Link as={Link} to="/settings" className="text-white mx-3">
                Asetukset
              </Nav.Link>
            </Nav>
          )}

          {/* Profiili-dropdown */}
          {user ? (
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-light"
                id="dropdown-basic"
                className="ms-auto"
                style={{ transition: "background 0.3s, color 0.3s" }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#white";
                  e.target.style.color = "black";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "white";
                }}
              >
                {user.email || "Profiili"}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={handleLogout}>Kirjaudu ulos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button variant="outline-light" onClick={() => navigate("/login")}>Kirjaudu sisään</Button>
          )}

          {/* Mobiilin hampurilaisvalikko */}
          {user && (
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
                  <Nav.Link as={Link} to="/settings">
                    Asetukset
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          )}
        </Container>
      </Navbar>
    </Container>
  );
};

export default HeaderNav;