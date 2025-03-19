import React, { useState } from "react";
import Papa from "papaparse";
import { useCategories } from "../actions/Categories";
import { Button } from "react-bootstrap";
import { useAccounts } from "../actions/Accounts";
import AccountDropdown from "./AccountDropdown";
import { createTransactions } from "../actions/Transactions";

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
  const { expenseCategories, incomeCategories, loading } = useCategories();
  const { accounts, addAccount } = useAccounts();
  const [isPending, setPending] = useState(false);

  const fileUploadAndParse = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
              case "Summa":
                updateColumnIndex("amount", i);
                break;
              case "Maksaja": // TODO S-pankilla tämä on tulojen tapauksessa se "nimi" ja saajan nimi on oma tili
                updateColumnIndex("account", i);
                break;
              case "Maksunsaaja":
                updateColumnIndex("account2", i);
                break;
              case "Nimi":
              case "Saajan nimi":
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

            // Ohitetaan tyhjät rivit ja varaukset
            if (!row[columnIndexes.get("date")] || row[columnIndexes.get("date")] == "Varaus") {
              continue;
            }

            let date;
            const dateRegex = /^(\d+)\.(\d+)\.(\d+)$/; // dd.mm.yyyy-muoto
            const match = row[columnIndexes.get("date")].match(dateRegex);
            if (match) {
              const day = parseInt(match[1]);
              const month = parseInt(match[2]) - 1;
              const year = parseInt(match[3]);
              date = new Date(year, month, day);
            } else {
              date = new Date(row[columnIndexes.get("date")]);
            }
            date = date.toISOString().substring(0,10); // Ei toimi oikein enää vuonna 10000 :)

            // Jos on erikseen maksaja ja maksunsaaja
            let account = row[columnIndexes.get("account")];
            if (!row[columnIndexes.get("account")]) {
              account = row[columnIndexes.get("account2")];
            }
            let accountNumber = accounts.find(a => a.account_number == account)?.id || "";
            
            // Hyväksytään vain numerot viitenumeroksi
            let reference_number;
            const numberRegex = /^\d+$/;
            if (row[columnIndexes.get("reference_number")].match(numberRegex)) {
              reference_number = row[columnIndexes.get("reference_number")];
            } else {
              reference_number = "";
            }

            sortedData.push({
              date: date,
              amount: row[columnIndexes.get("amount")].replace(",", "."),
              account_number: account, // Tilikentän tekstiä varten
              account: accountNumber, // TODO tähän tulisi accountNumber ylempää
              name: row[columnIndexes.get("name")],
              reference_number: reference_number,
              category: "", // TODO tähän kategoria-arvaukset
              description: ""
            });
          }
          
          // Lajitellaan tapahtumat päivämäärän mukaan nousevaan järjestykseen
          sortedData = sortedData.sort((a, b) => {
            return a.date > b.date;
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

    await createTransactions(tableData);

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
                        type="number"
                        value={row[c]}
                        onChange={(e) => handleInput(rowIndex, c, e.target.value)} />; // TODO input type="number" ei välttämättä ole oikea ratkaisu tähän, vaan ehkä text jossa rajoitetaan teksti vain numeroihin
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