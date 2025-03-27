import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import supabase from "../config/supabaseClient";

function AccountCreationModule({ userId }) {
  const [show, setShow] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Tarkista, onko käyttäjällä jo tilejä
  useEffect(() => {
    const checkUserAccounts = async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("id")
        .eq("user_id", userId);

      if (!error && (!data || data.length === 0)) {
        setShow(true); // Avaa ikkuna vain jos tilejä ei ole
      }
    };

    checkUserAccounts();
  }, [userId]);

  const handleCreateAccount = async () => {
    if (!newAccountName.trim() || !newAccountNumber.trim()) return;
    if (isCreating) return;
    setIsCreating(true);

    const { data, error } = await supabase
      .from("accounts")
      .insert([{ account_name: newAccountName.trim(), account_number: newAccountNumber.trim(), user_id: userId }])
      .select();

    if (!error && data?.length > 0) {
      setNewAccountName("");
      setNewAccountNumber("");
      setShow(false); // Sulje ikkuna onnistuneen lisäyksen jälkeen

      // Tarkista, onko käyttäjällä kategorioita
      const { data: existingCategories } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", userId);

      if (!existingCategories || existingCategories.length === 0) {
        // Lisää oletuskategoriat
        await supabase.from("categories").insert([
          { category_name: "Ruoka", category_type: 0, user_id: userId },
          { category_name: "Vuokra", category_type: 0, user_id: userId },
          { category_name: "Liikenne", category_type: 0, user_id: userId },
          { category_name: "Kulttuuri", category_type: 0, user_id: userId },
          { category_name: "Hyvinvointi", category_type: 0, user_id: userId },
          { category_name: "Muut tulot", category_type: 1, user_id: userId },
          { category_name: "Palkka", category_type: 1, user_id: userId },
          { category_name: "Tuet ja avustukset", category_type: 1, user_id: userId },
        ]);
      }
    } else {
      setErrorMessage("Tilin luonti epäonnistui. Tarkista syötteet.");
      setShowAlert(true);
    }

    setIsCreating(false);
  };

  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Luo ensimmäinen tilisi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>{errorMessage}</Alert>}

        <Form>
          <Form.Group controlId="newAccountName">
            <Form.Label>Tilin nimi</Form.Label>
            <Form.Control
              type="text"
              placeholder="Esim. Säästötili"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="newAccountNumber" className="mt-2">
            <Form.Label>Tilinumero</Form.Label>
            <Form.Control
              type="text"
              placeholder="Esim. FI123456789012"
              value={newAccountNumber}
              onChange={(e) => setNewAccountNumber(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" className="mt-3 w-100" onClick={handleCreateAccount} disabled={isCreating}>
            {isCreating ? "Luodaan..." : "Luo tili"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AccountCreationModule;














