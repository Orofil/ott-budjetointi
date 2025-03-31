import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import supabase from "../config/supabaseClient";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const CategoriesPage = () => {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", type: "0" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Haetaan käyttäjän kategoriat
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

      if (data) setCategories(data);
      if (error) console.error("Virhe haettaessa kategorioita:", error.message);
    };

    if (user) fetchCategories();
  }, [user]);

  // Avaa modaalin uuden kategorian lisäämistä varten
  const handleShowModal = () => {
    setEditingCategory(null);
    setNewCategory({ name: "", type: "0" });
    setShowModal(true);
  };

  // Sulje modaalin
  const handleCloseModal = () => setShowModal(false);

  // Kategorian lisääminen
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setErrorMessage("Kategorian nimi ei voi olla tyhjä.");
      setShowAlert(true);
      return;
    }
    if (categories.some((cat) => cat.category_name === newCategory.name)) {
      setErrorMessage("Kategoria on jo olemassa.");
      setShowAlert(true);
      return;
    }
  
    const { error } = await supabase.from("categories").insert([{
      category_name: newCategory.name.trim(),
      category_type: Number(newCategory.type),
      user_id: user.id,
    }]);
  
    if (!error) {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);
  
      if (data) setCategories(data);
      handleCloseModal();
    } else {
      setErrorMessage("Virhe lisättäessä kategoriaa.");
      setShowAlert(true);
      console.error("Virhe lisättäessä kategoriaa:", error.message);
    }
  };

  // Kategorian muokkaus
  const handleEditCategory = async (categoryId, newName, newType) => {
    // Jos nimi ei ole muuttunut, käytetään alkuperäistä nimeä
    const updatedName = newName.trim() || categories.find(cat => cat.id === categoryId)?.category_name;
  
    // Tarkistetaan, että nimi ei ole tyhjä
    if (!updatedName) {
      setErrorMessage("Kategorian nimi ei voi olla tyhjä.");
      setShowAlert(true);
      return;
    }
  
    // Päivitetään kategoria tietokannassa
    const { data, error } = await supabase
      .from("categories")
      .update({ category_name: updatedName, category_type: Number(newType) })
      .eq("id", categoryId);
  
    // Tarkistetaan, onko päivitys onnistunut
    if (error) {
      console.error("Virhe muokattaessa kategoriaa:", error.message);
      setErrorMessage("Virhe muokattaessa kategoriaa.");
      setShowAlert(true);
    } else {
      console.log("Päivitetyt tiedot:", data);
  
      // Päivitetään kategoriat näkymässä
      setCategories(categories.map((cat) =>
        cat.id === categoryId ? { ...cat, category_name: updatedName, category_type: Number(newType) } : cat
      ));
  
      // Suljetaan muokkaustila ja tyhjennetään tilat
      setEditingCategory(null);  // Tämä sulkee muokkaustilan
      setNewCategory({ name: "", type: "0" });
    }
  };
  

  // Avaa poistovahvistusikkunan
  const handleShowDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  // Sulje poistovahvistusikkuna
  const handleCloseDeleteModal = () => {
    setCategoryToDelete(null);
    setShowDeleteModal(false);
  };

  // Kategorian poistaminen
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryToDelete.id);

    if (!error) {
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      handleCloseDeleteModal();
    } else {
      console.error("Virhe poistettaessa kategoriaa:", error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Omat kategoriat</h2>

      {/* Menot ja tulot taulukossa */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Tyyppi</th>
            <th>Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                {editingCategory === category.id ? (
                  <Form.Control
                    type="text"
                    defaultValue={category.category_name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                ) : (
                  category.category_name
                )}
              </td>
              <td>
                {editingCategory === category.id ? (
                  <Form.Select
                    defaultValue={category.category_type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  >
                    <option value="0">Menot</option>
                    <option value="1">Tulot</option>
                  </Form.Select>
                ) : category.category_type === 0 ? (
                  "Menot"
                ) : (
                  "Tulot"
                )}
              </td>
              <td>
                {editingCategory === category.id ? (
                  <Button
                    variant="success"
                    onClick={() => handleEditCategory(category.id, newCategory.name, newCategory.type)}
                  >
                    Tallenna
                  </Button>
                ) : (
                  <>
                    <Button variant="warning" className="me-2" onClick={() => setEditingCategory(category.id)}>
                      Muokkaa
                    </Button>
                    <Button variant="danger" onClick={() => handleShowDeleteModal(category)}>
                      Poista
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={handleShowModal}>
        Lisää kategoria
      </Button>

      {/* Lisää kategoria -modaali */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Lisää kategoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Virheilmoitus näkyy vain, jos showAlert on true */}
          {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>{errorMessage}</Alert>}

          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Kategorian nimi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Anna kategorian nimi"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="categoryType" className="mt-3">
              <Form.Label>Kategoriatyyppi</Form.Label>
              <Form.Select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
              >
                <option value="0">Meno</option>
                <option value="1">Tulo</option>
              </Form.Select>
            </Form.Group>

            <Button
              variant="primary"
              className="mt-3 w-100"
              onClick={handleAddCategory}
            >
              Lisää kategoria
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Poiston vahvistusikkuna */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vahvista poisto</Modal.Title>
        </Modal.Header>
        <Modal.Body>Haluatko varmasti poistaa kategorian "{categoryToDelete?.category_name}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Peruuta
          </Button>
          <Button variant="danger" onClick={handleDeleteCategory}>
            Poista
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoriesPage;

