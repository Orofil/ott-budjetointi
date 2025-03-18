import React, { useEffect, useState } from "react";
import { Dropdown, Form, Button, Modal, InputGroup } from "react-bootstrap";
import { addAccount, loadAccounts } from "../actions/Accounts";

const AccountDropdown = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState(value);
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      setOptions(await loadAccounts()); // TODO tilit pitää hakea kaikille jostain yhteisestä lähteestä, ettei niitä tarvitsisi ladata kaikille erikseen, ja jotta lisäykset menisivät kaikille
    };
    loadOptions();
  }, []);

  // Ollaanko luomassa uutta vaihtoehtoa
  const isNewValue = accountNumber && !options.some((a) => a.account_number == accountNumber);

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
    if (data) {
      setOptions((prev) => [...prev, data[0]]);

      setShowModal(false);
      onChange(data[0].id);
      setAccountName("");
    }
    // TODO näytä ilmoitus virheestä muussa tapauksessa
  };

  return (
    <div style={{ minWidth: "270px", display: "flex", alignItems: "center" }}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Valitse tai kirjoita..."
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
            onChange(isNewValue ? "" : options.find((a) => a.account_number == e.target.value).id); // FIXME tässä tulee virhe kun yritetään löytää kirjoitettua tilinumeroa vastaava tietokanta-id
          }}
        />
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary"></Dropdown.Toggle>
          <Dropdown.Menu>
            {options.map((o) => (
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

      {isNewValue && (
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
