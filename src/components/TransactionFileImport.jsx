import React, { useState } from "react";
import Papa from "papaparse";
import { useCategories } from "../actions/Categories";
import { Button } from "react-bootstrap";
import { useAccounts } from "../actions/Accounts";
import AccountDropdown from "./AccountDropdown";
import { createTransactions } from "../actions/Transactions";
import parseCSV from "../actions/CSVParse";

const TransactionFileImport = () => {
  const { expenseCategories, incomeCategories, loading } = useCategories();
  const { accounts, addAccount } = useAccounts();

  const [tableData, setTableData] = useState([]);
  const columnNames = {
    date: { name:"Päivämäärä", required:true },
    amount: { name:"Summa", required:true },
    account: { name:"Oma tili", required:true },
    name: { name:"Toinen osapuoli", required:false }, // TODO vähän ehkä huonot nimet vielä
    reference_number: { name:"Viitenumero", required:false },
    category: { name:"Kategoria", required:true },
    description: { name:"Kuvaus", required:false }
  };
  const columnPositions = [ // Sarakkeet siinä järjestyksessä missä ne näytetään taulukossa
    "date",
    "amount",
    "account",
    "name",
    "category",
    "reference_number",
    "description"
  ]
  const [isPending, setPending] = useState(false);
  const [message, setMessage] = useState(""); // Ilmoitus puuttuvista arvoista tai virheestä

  const fileUploadAndParse = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Luetaan tiedosto taulukoksi
    Papa.parse(file, {
      complete: (result) => 
        setTableData(parseCSV(result.data, accounts)),
      header: false,
      skipEmptyLines: true,
    });
  };

  const handleInput = (rowIndex, col, value) => {
    const wasExpense = tableData[rowIndex]["amount"].startsWith("-");
    const newData = [...tableData];
    newData[rowIndex] = { ...newData[rowIndex], [col]: value };
    if (col == "amount" && wasExpense != value.startsWith("-")) { // Resetoidaan kategoria jos määrää muutettiin positiivisesta negatiiviseksi tai toisin päin
      newData[rowIndex]["category"] = "";
    }
    setTableData(newData);
  };

  const deleteRow = (rowIndex) => {
    const confirmDelete = window.confirm("Poistetaanko tapahtuma?");
    if (confirmDelete) {
      setTableData((prev) => prev.filter((_, index) => index !== rowIndex));
    }
  }

  const saveTransactions = async (event) => {
    event.preventDefault();
    setPending(true);

    // Pakollisten tietojen tarkistus
    for (let i = 0; i < tableData.length; i++) {
      let row = tableData[i];
      if (Number(row.amount) == 0) {
        setMessage("Summa ei voi olla nolla");
        setPending(false);
        return;
      } else if (!row.account) {
        setMessage("Tili on pakollinen (muista luoda tili)");
        setPending(false);
        return;
      } else if (!row.category) {
        setMessage("Kategoria on pakollinen");
        setPending(false);
        return;
      }
    }

    await createTransactions(tableData);
    setMessage("");
    setPending(false);
  };
  
  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={fileUploadAndParse}
      />

      {/* Tapahtumien taulukko */}
      {tableData.length > 0 && (
        <table className="my-4 border-collapse border border-gray-500 w-full">
          <thead>
            {/* Otsikkorivi */}
            <tr>
              {columnPositions.map((col, index) => (
                <th key={index} className="border border-gray-500 p-2">
                  {columnNames[col].name} {columnNames[col].required &&
                    <span className="fw-bold text-danger">*</span>
                  }
                </th>
              ))}
              {/* Poistamispainikkeiden sarake */}
              <th />
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columnPositions.map((col, colIndex) => {
                  const createInput = (c) => {
                    // Inputin tyyppi riippuu sarakkeen datatyypistä
                    switch (c) {
                      case "date":
                        return <input
                        type="date"
                        required
                        max={new Date().toISOString().slice(0, 10)} // Ei voi valita tulevaisuudesta päivää
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)} />;
                      case "amount":
                        return <input
                        type="number"
                        required
                        step=".01"
                        inputMode="decimal"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)} />;
                      case "reference_number":
                        return <input
                        type="text"
                        inputMode="numeric"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)} />; // TODO rajoitetaan input vain numeroihin
                      case "category":
                        return (
                          <select
                            required
                            value={row[c]}
                            onChange={(e) => handleInput(rowIndex, c, e.target.value)}
                          >
                            <option value="" disabled hidden></option>
                            {(row.amount.startsWith("-") ? expenseCategories : incomeCategories).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.category_name}
                              </option>
                            ))}
                          </select>
                        );
                      case "account":
                        return <AccountDropdown
                        value={row["account_number"]} // TODO tämän näyttämän tekstin pitäisi muuttua kun value muuttuu
                        onChange={(e) => handleInput(rowIndex, c, e)} />
                      case "name":
                      case "description":
                      default:
                        return <input
                        type="text"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)} />;
                    }
                  };
          
                  return (
                    <td key={colIndex} className="border border-gray-500 p-2">
                      {createInput(col)}
                    </td>
                  );
                })}
                {/* Poistamispainike */}
                <td>
                  <Button
                    onClick={() => deleteRow(rowIndex)}
                  >
                    Poista
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && (
        <p className="tw-bold text-danger">{message}</p>
      )}

      {tableData.length > 0 && (
        <Button
          onClick={saveTransactions}
          variant="primary"
          type="submit"
          disabled={isPending}
          className="w-100"
        >
          {isPending ? "Lisätään..." : "Lisää"}
        </Button>
      )}
    </div>
  );
};

export default TransactionFileImport;