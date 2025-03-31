import React, { useActionState, useContext, useEffect, useState } from "react";
import { TransactionCategory } from "../constants/TransactionCategory";
import { createTransaction, deleteTransaction, updateTransaction } from "../actions/Transactions";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Row, Col } from "react-bootstrap";
import { CategoryContext } from "../context/CategoryContext";
import { AccountContext } from "../context/AccountContext";

function TransactionEditView({ data, onSubmit }) {
  const { expenseCategories, incomeCategories, loading: loadingCategories } = useContext(CategoryContext);
  const { accounts, loading: loadingAccounts } = useContext(AccountContext);
  
  const [type, setType] = useState(TransactionCategory.EXPENSE);
  const [values, setValues] = useState({
    id: data?.id || "",
    amount: data?.amount || "",
    date: data?.date || "",
    account: data?.own_account || "",
    name: data?.other_account || "",
    reference_number: data?.reference_number || "",
    description: data?.description || "",
    category: data?.category_id || ""
  });
  const [error, setError] = useState([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  // Päivitetään lomakkeen arvoja
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (error.includes(name)) {
      setError(error.filter((e) => e !== name));
      setMessage("");
    }
    setValues({ ...values, [name]: value });
  };

  // Tapahtuman tyypin päivitys kun etumerkkiä muutetaan
  useEffect(() => {
    const prevType = type;
    const newType = String(values.amount).charAt(0) == "-" ? TransactionCategory.EXPENSE : TransactionCategory.INCOME;
    setType(newType);
    if (prevType != newType) { // Resetoidaan kategoria jos määrää muutettiin positiivisesta negatiiviseksi tai toisin päin
      values.category = "";
    }
  }, [values.amount]);

  const handleDelete = () => {
    const confirmDelete = window.confirm("Poistetaanko tapahtuma?");
    if (confirmDelete) {
      let result = deleteTransaction(type, values.id);
      if (result != null && result.length) return true;
    };
    return false;
  }

  const handleCreateOrEdit = () => {
    const { amount, date, account, reference_number, category } = values;
    const errorList = [];
    if (!amount || Number(amount) == 0) {
      errorList.push("amount");
    }
    if (!date) {
      errorList.push("date");
    }
    if (!account) {
      errorList.push("account");
    }
    // Hyväksytään vain numerot viitenumeroksi
    const numberRegex = /^\d+$/;
    if (reference_number && !reference_number.match(numberRegex)) {
      errorList.push("reference_number");
    }
    if (!category) {
      errorList.push("category");
    }
    setError(errorList);
    setMessage(errorList.length ? "Pakollisia arvoja puuttuu" : "");

    if (!errorList.length) {
      let data;
      if (values.id) {
        data = updateTransaction(values);
      } else {
        data = createTransaction(values);
      }
      if (data) {
        setValues({
          amount: "",
          date: "",
          account: "",
          name: "",
          reference_number: "",
          description: "",
          category: ""
        });
      }
      return true;
    }
    return false;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setPending(true);
    // Suoritetaan eri funktio riippuen painetun painikkeen nimestä
    const buttonName = e.nativeEvent.submitter.name;
    let success;
    if (buttonName === "send") {
      success = handleCreateOrEdit();
    } else if (buttonName === "delete") {
      success = handleDelete();
    }
    if (onSubmit) onSubmit(success);
    setPending(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Summa <span className="fw-bold text-danger">*</span></Form.Label>
        <Form.Control
          className={`fw-bold
            ${type == TransactionCategory.EXPENSE ? "text-danger" : "text-primary"}
            ${error.includes("amount") ? "border border-danger" : ""}`} // Puuttuvan kentän reunojen väritys
          type="number"
          step="0.01"
          name="amount"
          value={values.amount}
          onInput={handleInputChange} 
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Päivämäärä <span className="fw-bold text-danger">*</span></Form.Label>
        <Form.Control
          type="date"
          name="date"
          max={new Date().toISOString().slice(0, 10)} // Ei voi valita tulevaisuudesta päivää
          value={values.date}
          onInput={handleInputChange}
          className={error.includes("date") ? "border border-danger" : ""}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Tili <span className="fw-bold text-danger">*</span></Form.Label>
        <Form.Select
          name="account"
          disabled={loadingAccounts}
          value={values.account}
          onInput={handleInputChange}
          className={error.includes("account") ? "border border-danger" : ""}
        >
          <option value="" disabled hidden>Valitse tili</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.account_name ? `${a.account_name} (${a.account_number})` : a.account_number}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{type == TransactionCategory.EXPENSE ? "Saaja" : "Maksaja"}</Form.Label>
        <Form.Control
        type="text"
        name="name"
        value={values.name}
        onInput={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Viitenumero</Form.Label>
        <Form.Control
        type="text"
        name="reference_number"
        inputMode="numeric"
        value={values.reference_number}
        onInput={handleInputChange}
        className={error.includes("reference_number") ? "border border-danger" : ""}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Kuvaus</Form.Label>
        <Form.Control
        as="textarea"
        name="description"
        value={values.description}
        onInput={handleInputChange} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Kategoria <span className="fw-bold text-danger">*</span></Form.Label>
        <Form.Select
          name="category"
          disabled={loadingCategories}
          value={values.category}
          onInput={handleInputChange}
          className={error.includes("category") ? "border border-danger" : ""}
        >
          <option value="" disabled hidden>Valitse kategoria</option>
          {(type == TransactionCategory.EXPENSE ? expenseCategories : incomeCategories).map((c) => (
            <option key={c.id} value={c.id}>
              {c.category_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {message && (
        <p className="text-danger fw-bold">{message}</p>
      )}

      <Row className="gx-2">
        {/* Poistamispainike */}
        {values.id && (
          <Col xs="3">
            <Button
              variant="danger"
              type="submit"
              name="delete"
              disabled={pending}
              className="w-100"
            >
              {pending ? "Poistetaan..." : "Poista"}
            </Button>
          </Col>
        )}
        {/* Lähetä-painike, joka on estetty kun tapahtuma on käsittelyssä */}
        <Col xs={values.id ? "9" : "12"}>
          <Button
            variant="primary"
            type="submit"
            name="send"
            disabled={pending}
            className="w-100"
          >
            {pending ? "Tallennetaan..." : "Tallenna"}
          </Button>
        </Col>
      </Row>
      

      
    </Form>
  );
}

export default TransactionEditView;