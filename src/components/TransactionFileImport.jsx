import React, { useState } from "react";
import Papa from "papaparse";
import { loadCategories } from "../actions/Categories";
import { TransactionCategory } from "../constants/TransactionCategory";
import supabase from "../config/supabaseClient";
import { Button } from "react-bootstrap";
import { loadAccounts } from "../actions/Accounts";
import AccountDropdown from "./AccountDropdown";

const TransactionFileImport = () => {
  const [tableData, setTableData] = useState([]);
  const columnNames = {
    date: "Päivämäärä",
    amount: "Summa",
    account: "Oma tili",
    name: "Toinen osapuoli", // TODO vähän ehkä huonot nimet vielä
    reference_number: "Viitenumero",
    category: "Kategoria",
    description: "Kuvaus"
  };
  const columnPositions = [ // Sarakkeet siinä järjestyksessä missä ne näytetään taulukossa
    "date",
    "amount",
    "account",
    "name",
    "reference_number",
    "category",
    "description"
  ]
  const [columnIndexes, setColumnIndexes] = useState(new Map()); // Sarakkeiden sijainnit alkuperäisessä tiedostossa // TODO näiden ei ehkä tarvitse olla useState, ja voisi olla fileUploadAndParsen sisällä
  const updateColumnIndex = (k,v) => {
    setColumnIndexes(new Map(columnIndexes.set(k,v)));
  }
  const [expenseCategories, setExpenseCategories] = useState();
  const [incomeCategories, setIncomeCategories] = useState();
  const [accounts, setAccounts] = useState();
  const [isPending, setPending] = useState();

  const fileUploadAndParse = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setExpenseCategories(await loadCategories(TransactionCategory.EXPENSE));
    setIncomeCategories(await loadCategories(TransactionCategory.INCOME));
    setAccounts(await loadAccounts());

    // Luetaan tiedosto
    Papa.parse(file, {
      complete: (result) => {
        if (result.data.length > 0) {
          for (var i = 0; i < result.data[0].length; i++) {
            // Löydetään datan halutut sarakkeet otsikkorivin nimien perusteella
            switch (result.data[0][i]) {
              case "Kirjauspäivä":
                updateColumnIndex("date", i);
                break;
              case "Määrä":
                updateColumnIndex("amount", i);
                break;
              case "Maksaja":
                updateColumnIndex("account", i);
                break;
              case "Maksunsaaja":
                updateColumnIndex("account2", i);
                break;
              case "Nimi":
                updateColumnIndex("name", i);
                break;
              case "Viitenumero":
                updateColumnIndex("reference_number", i);
                break;
            }
          }

          // Valitaan datasta vain tarvittavat sarakkeet
          let sortedData = [];
          for (var i = 1; i < result.data.length; i++) {
            let row = result.data[i];

            let date = new Date(row[columnIndexes.get("date")]);
            date = date.toISOString().substring(0,10); // Ei toimi oikein enää vuonna 10000 :)

            // Jos on erikseen maksaja ja maksunsaaja
            let account = row[columnIndexes.get("account")];
            if (!row[columnIndexes.get("account")]) {
              account = row[columnIndexes.get("account2")];
            }
            // let accountNumber = accounts.find((a) => a.account_number == accountNumber).id; // FIXME ongelma: accounts is undefined
            // if (!accountNumber) accountNumber = "";

            sortedData.push({
              date: date,
              amount: row[columnIndexes.get("amount")].replace(",", "."),
              account_number: account, // Tilikentän tekstiä varten
              account: "", // TODO tähän tulisi accountNumber ylempää
              name: row[columnIndexes.get("name")],
              reference_number: row[columnIndexes.get("reference_number")],
              category: "", // TODO tähän kategoria-arvaukset
              description: ""
            });
          }
          
          // Lajitellaan tapahtumat päivämäärän mukaan nousevaan järjestykseen
          sortedData = sortedData.sort((a, b) => {
            return a[0] - b[0];
          });
          setTableData(sortedData);
        }
      },
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
    // TODO puuttuvista tiedoista joku ilmoitus
    for (let i = 0; i < tableData.length; i++) {
      let row = tableData[i];
      if (!row.date || row.date > new Date().toISOString().substring(0,10) || !row.amount || Number(row.amount) == 0 || !row.account || !row.category) {
        setPending(false);
        return;
      }
    }

    // TODO nämä kaksi seuraavaa inserttiä pitää tehdä tietokantafunktioksi jotta ne voi molemmat peruuttaa jos jossain kohti on virhe
    const { data, error } = await supabase.from("expense_transactions").insert(tableData
      .filter((row) => (row.amount.startsWith("-")))
      .map((row) => ({
        date: row.date,
        reference_number: row.reference_number,
        description: row.description,
        amount: row.amount.toString().slice(1), // Tallennetaan tietokantaan ilman miinusta
        account_to: row.name,
        account_from: row.account,
        category_id: row.category
    })));

    if (error) {
      console.log("Tapahtumien tallennus epäonnistui:", error);
      setPending(false);
      return;
    }

    console.log(tableData
      .filter((row) => (!row.amount.startsWith("-"))));
    // TODO ei toimi
    const { data1, error1 } = await supabase.from("income_transactions").insert(tableData
      .filter((row) => (!row.amount.startsWith("-")))
      .map((row) => ({
        date: row.date,
        reference_number: row.reference_number,
        description: row.description,
        amount: row.amount,
        account_from: row.name,
        account_to: row.account,
        category_id: row.category
    })));

    if (error1) {
      console.log("Tapahtumien tallennus epäonnistui:", error1);
      setPending(false);
      return;
    }

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
        <table className="border-collapse border border-gray-500 w-full">
          <thead>
            {/* Otsikkorivi */}
            <tr>
              {columnPositions.map((col, index) => (
                <th key={index} className="border border-gray-500 p-2">
                  {columnNames[col]}
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
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)} />;
                      case "amount":
                        return <input
                        type="number"
                        step=".01"
                        inputMode="decimal"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)} />;
                      case "reference_number":
                        return <input
                        type="text"
                        inputMode="numeric"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)} />; // TODO tälle jokin tapa rajoittaa inputit vain numeroihin, mutta input type="number" ei välttämättä ole oikea ratkaisu tähän
                      case "category":
                        return (
                          <select onChange={(e) => handleInput(rowIndex, c, e.target.value)} value={row[c]}>
                            <option value=""></option>
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