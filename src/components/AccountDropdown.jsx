import React, { useEffect, useState } from "react";
import { Dropdown, Form, Button, Modal, InputGroup } from "react-bootstrap";
import { useAccounts } from "../actions/Accounts";

const AccountDropdown = ({ value, onChange }) => {
  const { accounts, addAccount, loading } = useAccounts();
  const [showModal, setShowModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState(value);
  const [accountName, setAccountName] = useState("");
  const [message, setMessage] = useState("");

  // Ollaanko luomassa uutta vaihtoehtoa
  const isNewValue = accountNumber && !accounts.some((a) => a.account_number == accountNumber);

  // Lisää uusi vaihtoehto
  const addNew = async () => {
    if (!accountNumber.trim()) {
      alert("Tilinumero vaaditaan!");
      return;
    }

    const data = await addAccount({
      account_number: accountNumber,
      account_name: accountName
    });
    if (!data) {
      setMessage("Virhe tilin lisäämisessä");
      return;
    }
    onChange(data);
    
    setShowModal(false);
    setAccountName("");
    setMessage("");
  };

  useEffect(() => {
    setAccountNumber(value);
  }, [value]);

  return (
    <div style={{ minWidth: "270px", display: "flex", alignItems: "center" }}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Valitse tai kirjoita..."
          disabled={loading}
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
            onChange(isNewValue ? "" : accounts.find((a) => a.account_number == e.target.value)?.id || "");
          }}
        />
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary"></Dropdown.Toggle>
          <Dropdown.Menu disabled={loading}>
            {accounts.map((o) => ( // FIXME tästä taitaa tulla virhe kun lisää uuden tilin, että kaikilla itemeillä pitäisi olla uniikki key
              <Dropdown.Item key={o.id} value={o.account_number} onClick={() => {
                  setAccountNumber(o.account_number);  
                  onChange(o.id);
                }}>
                {o.account_name ? `${o.account_name} (${o.account_number})` : o.account_number}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </InputGroup>

      {isNewValue && !loading && (
        <Button
          onClick={() => setShowModal(true)}
        >
          +
        </Button>
      )}

      {/* Uuden vaihtoehdon lisääminen */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Luo uusi tili</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tilinumero</Form.Label>
            <Form.Control
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Tilin nimi</Form.Label>
            <Form.Control
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </Form.Group>
          {message && (
            <p className="text-danger">{message}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Peruuta</Button>
          <Button variant="primary" onClick={addNew}>Luo</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccountDropdown;
