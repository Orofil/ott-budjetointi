import React, { useState } from "react";
import { Col, DropdownButton, Button, Container, Dropdown, Row, FormControl, Card } from "react-bootstrap";

function Settings() {
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [categories, setCategories] = useState([
    "Kategoria tietokannasta",
    "2. Kategoria tietokannasta",
    "3. Kategoria tietokannasta",
  ]); // Lista kategorioista

  // Dropdown-button
  const handleSelect = (eventKey, event) => {
    setSelectedCategory(event.target.textContent);
  };

  // Kategorian vaihto
  const handleInputChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Kategorian tallennus
  const handleSave = () => {
    if (!selectedCategory.trim()) return; // Estää tyhjien kategorioiden tallennuksen

    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      const existingIndex = updatedCategories.findIndex((cat) => cat === selectedCategory);

      if (existingIndex !== -1) {
        // Jos kategoria on olemassa, älä lisää
        updatedCategories[existingIndex] = selectedCategory;
      } else {
        // Uusi kategoria, lisää
        updatedCategories.push(selectedCategory);
      }

      return updatedCategories;
    });

    setSelectedCategory(""); // Tyhjennä teksti-boksi
  };

  return (
    
    <Container fluid className="p-4">
        <Row className="justify-content-center">
        <Col xs={12} md={6} className="p-3">
        <Card className="shadow p-4">
          <h4>Valitse muokattava kategoria tai kirjoita kenttään kategoria, jonka haluat lisätä</h4>
          <br />

          <div className="d-flex flex-column align-items-start p-2">
            <DropdownButton
              id="dropdown-button-dark-example2"
              variant="primary"
              title="Valitse kategoria"
              className="mb-2"
              data-bs-theme="dark"
              onSelect={handleSelect}
            >
              {categories.map((category, index) => (
                <Dropdown.Item key={index} eventKey={index}>
                  {category}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <FormControl
              type="text"
              placeholder="Kirjoita tai valitse kategoria"
              value={selectedCategory}
              onChange={handleInputChange}
              className="w-100 mb-2"
            />

            <Button variant="primary" onClick={handleSave}>Tallenna</Button>
          </div>
        </Card>
        </Col>
      </Row>
    </Container>
    
  );
}

export default Settings;
