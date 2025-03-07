import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import CategoryDropdown from "../components/CategoryDropdown";
import { TransactionCategory } from "../constants/transactionCategory";

function TransactionImport() {
  const navigate = useNavigate();
  const [transactionCategory, setTransactionCategory] = useState(TransactionCategory.EXPENSE);

  const navigateBack = async () => {
    navigate("/dashboard");
  };

  const createTransaction = async () => {
    // TODO data tietokantaan
  };

  return (
    <div>
      <h2>Lisää pankkitapahtuma</h2>
      <button type="button" onClick={navigateBack}>Takaisin</button>
      <form>
        <label>Tapahtuman tyyppi</label>
        <select onChange={(e) => setTransactionCategory(e.target.value)}>
          <option value={TransactionCategory.EXPENSE}>Kulu</option>
          <option value={TransactionCategory.INCOME}>Tulo</option>
        </select>
        <br />
        <label>Määrä</label>
        <input type="number"></input>
        <br />
        <label>Saaja/Maksaja</label>
        <input type="text"></input>
        <br />
        <label>Päivämäärä</label>
        <input type="date"></input>
        <br />
        <label>Viitenumero</label>
        <input type="number"></input>
        <br />
        <label>Kuvaus</label>
        <textarea></textarea>
        <br />
        <label>Tili</label>
        <input type="text"></input>
        <br />
        <label>Kategoria</label>
        <CategoryDropdown categoryType={transactionCategory} />
        <br />
        <label>Päivämäärä</label>
        <input type="date"></input>
        <br />
        <button type="submit" onClick={createTransaction}>Lisää</button> 
      </form>
    </div>
  );
}

export default TransactionImport; 
