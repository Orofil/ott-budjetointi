import React, { useActionState, useState } from "react";
import { Link } from "react-router-dom";
import CategoryDropdown from "../components/CategoryDropdown";
import { findTransactionCategory, TransactionCategory } from "../constants/TransactionCategory";
import { createTransaction } from "../actions/Transactions";
import "bootstrap/dist/css/bootstrap.min.css";
import TransactionFileImport from "../components/TransactionFileImport";

function TransactionImport() {
  const [transactionCategory, setTransactionCategory] = useState(
    TransactionCategory.EXPENSE
  );
  const [formState, formAction, isPending] = useActionState(
    createTransaction,
    null
  );
  // FIXME preventDefaultia ei ole tätä käytettäessä, joten inputit tyhjentyvät aina vaikka inputit eivät olisi oikein

  return (
    <div>
      <h2>Lisää pankkitapahtuma</h2>
      <Link to="/dashboard">Takaisin</Link>
      <form action={formAction}>
        <label>
          Tapahtuman tyyppi:
          <select
            name="type"
            onChange={(e) => setTransactionCategory(findTransactionCategory(e.target.value))}
          >
            <option value={TransactionCategory.EXPENSE.id}>Kulu</option>
            <option value={TransactionCategory.INCOME.id}>Tulo</option>
          </select>
        </label>
        <br />
        <label>
          Summa: <input type="number" name="amount" />
        </label>
        <br />
        <label>
          Saaja/Maksaja: <input type="text" name="payee-payer" />
        </label>
        <br />
        <label>
          Päivämäärä: <input type="date" name="date" />
        </label>
        <br />
        <label>
          Viitenumero: <input type="number" name="reference-number" />
        </label>
        <br />
        <label>
          Kuvaus: <textarea name="description" />
        </label>
        <br />
        <label>
          Tili: <input type="text" name="account" />
        </label>
        <br />
        <label>
          Kategoria: <CategoryDropdown categoryType={transactionCategory} />
        </label>
        <br />
        <button type="submit" disabled={isPending}>
          {isPending ? "Lisätään..." : "Lisää"}
        </button>
        <br />
        {formState && <span style={{ color: "red" }}>{formState}</span>}
      </form>
      
      <hr />
      <h3>Tuo tiedostosta</h3>
      <p>Tiedoston on oltava .csv-muodossa.</p>
      <TransactionFileImport />
    </div>
  );
}

export default TransactionImport;
