import React, { useState, useEffect } from "react";
import { Modal, Button, Form, DropdownButton, Dropdown } from "react-bootstrap";
import supabase from "../config/supabaseClient";

function AccountSelectionModule({ show, handleClose, userId, setSelectedAccount }) {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccountState] = useState(null);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId);

      if (data) {
        setAccounts(data);
      }
    };

    fetchAccounts();
  }, [userId]);

  const handleSelectAccount = (accountId) => {
    const account = accounts.find((acc) => acc.id === Number(accountId));
    setSelectedAccountState(account);
  };

  const handleConfirmAccount = () => {
    if (selectedAccount) {
      setSelectedAccount(selectedAccount);
      handleClose();
    }
  };

  const handleCreateAccount = async () => {
    if (!newAccountName || !newAccountNumber) return;

    const { data, error } = await supabase
      .from("accounts")
      .insert([
        { account_name: newAccountName, number: newAccountNumber, user_id: userId },
      ])
      .select();

    if (!error && data) {
      setAccounts([...accounts, ...data]);
      setNewAccountName("");
      setNewAccountNumber("");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Valitse tili</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="accountSelect">
            <Form.Label>Valitse tili:</Form.Label>
            <div className="d-flex align-items-center">
              <DropdownButton
                variant="outline-secondary"
                id="dropdown-basic-button"
                title={selectedAccount ? selectedAccount.account_name : "Valitse tili"}
                onSelect={handleSelectAccount}
              >
                {accounts.map((account) => (
                  <Dropdown.Item key={account.id} eventKey={account.id}>
                    {account.account_name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <Button
                variant="primary"
                className="ms-3"
                onClick={handleConfirmAccount}
                disabled={!selectedAccount}
              >
                OK
              </Button>
            </div>
          </Form.Group>

          <div className="mt-4">
            <Form.Label>Uusi tili</Form.Label>
            <Form.Group controlId="newAccountName">
              <Form.Control
                type="text"
                placeholder="Tili nimi"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newAccountNumber" className="mt-2">
              <Form.Control
                type="text"
                placeholder="Tili numero"
                value={newAccountNumber}
                onChange={(e) => setNewAccountNumber(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" className="mt-3" onClick={handleCreateAccount}>
              Luo uusi tili
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AccountSelectionModule;








