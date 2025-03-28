import React, { useContext, useEffect, useState } from "react";
import Papa from "papaparse";
import { CategoryContext } from "../context/CategoryContext";
import { Button } from "react-bootstrap";
import { AccountContext } from "../context/AccountContext";
import AccountDropdown from "./AccountDropdown";
import { createTransactions, getTransaction } from "../actions/Transactions";
import parseCSV from "../actions/CSVParse";

const TransactionFileImport = () => {
  const { expenseCategories, incomeCategories, loading: loadingCategories } = useContext(CategoryContext);
  const { accounts } = useContext(AccountContext);

  const [tableData, setTableData] = useState([]);
  const [savedRows, setSavedRows] = useState([]); // Mitkä riveistä tallennetaan
  const columnNames = {
    date: { name:"Päivämäärä", required:true },
    amount: { name:"Summa", required:true },
    account: { name:"Tili", required:true },
    name: { name:"Nimi", required:false },
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
  const [dataReceived, setDataReceived] = useState(false); // Milloin tarkistetaan mitkä tapahtuman on jo ehkä lisätty tietokantaan

  const fileUploadAndParse = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Luetaan tiedosto taulukoksi
    Papa.parse(file, {
      complete: (result) => {
        setTableData(parseCSV(result.data, accounts));
        setSavedRows(Array(result.data.length).fill(true));
        setDataReceived(true);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  // Tarkistetaan mitkä tapahtumat on jo ehkä lisätty tietokantaan
  useEffect(() => {
    const findExistingRows = async () => {
      for (let i = 0; i < tableData.length; i++) {
        let newRows = savedRows;
        let tr = await getTransaction(tableData[i].date, tableData[i].amount, tableData[i].name);
        if (tr.length) {
          newRows[i] = false;
        } else {
          newRows[i] = true;
        }
        setSavedRows(newRows);
      }
    };
    
    findExistingRows();
  }, [dataReceived]);

  const handleInput = (rowIndex, col, value) => {
    const wasExpense = tableData[rowIndex]["amount"].startsWith("-");
    const newData = [...tableData];
    newData[rowIndex] = { ...newData[rowIndex], [col]: value };
    if (col == "amount" && wasExpense != value.startsWith("-")) { // Resetoidaan kategoria jos määrää muutettiin positiivisesta negatiiviseksi tai toisin päin
      newData[rowIndex]["category"] = "";
    }
    setTableData(newData);
  };

  const checkRow = (rowIndex, value) => {
    const newData = [...savedRows];
    newData[rowIndex] = value;
    setSavedRows(newData);
  };

  const saveTransactions = async (event) => {
    event.preventDefault();
    setPending(true);

    // Tallennetaan ne rivit joiden checkboxit on valittu
    const saveData = [];
    for (let i = 0; i < tableData.length; i++) {
      if (savedRows[i]) saveData.push(tableData[i]);
    }

    // Pakollisten tietojen tarkistus
    for (let i = 0; i < saveData.length; i++) {
      let row = saveData[i];
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

    await createTransactions(saveData);
    setMessage("");
    setPending(false);
    setTableData([]);
    setSavedRows([]);
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
              {/* Checkboxien sarake */}
              <th />
              {columnPositions.map((col, index) => (
                <th key={index} className="border border-gray-500 p-2">
                  {columnNames[col].name} {columnNames[col].required &&
                    <span className="fw-bold text-danger">*</span>
                  }
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Tallennetaanko rivi vai ei */}
                <td>
                  <input
                  type="checkbox"
                  checked={savedRows[rowIndex]}
                  onChange={(e) => checkRow(rowIndex, e.target.checked)} />
                </td>
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
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)}
                        disabled={!savedRows[rowIndex]} />;
                      case "amount":
                        return <input
                        type="number"
                        required
                        step=".01"
                        inputMode="decimal"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)}
                        disabled={!savedRows[rowIndex]} />;
                      case "reference_number":
                        return <input
                        type="text"
                        inputMode="numeric"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)}
                        disabled={!savedRows[rowIndex]} />; // TODO rajoitetaan input vain numeroihin
                      case "category":
                        return (
                          <select
                            required
                            disabled={loadingCategories || !savedRows[rowIndex]}
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
                        value={row["account_number"]}
                        onChange={(e) => handleInput(rowIndex, c, e)}
                        disabled={!savedRows[rowIndex]} />
                      case "name":
                      case "description":
                      default:
                        return <input
                        type="text"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)}
                        disabled={!savedRows[rowIndex]} />;
                    }
                  };
          
                  return (
                    <td key={colIndex} className="border border-gray-500 p-2">
                      {createInput(col)}
                    </td>
                  );
                })}
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