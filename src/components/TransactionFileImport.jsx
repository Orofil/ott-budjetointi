import React, { useState } from "react";
import Papa from "papaparse";
import { loadCategories } from "../actions/Categories";
import { TransactionCategory } from "../constants/TransactionCategory";

const TransactionFileImport = () => {
  const [tableData, setTableData] = useState([]);
  const [columnIndexes, setColumnIndexes] = useState(new Map());
  const updateColumnIndex = (k,v) => {
    setColumnIndexes(new Map(columnIndexes.set(k,v)));
  }
  const columns = [
    "Päivämäärä",
    "Summa",
    "Oma tili",
    "Toinen osapuoli", // TODO vähän ehkä huonot nimet vielä, jos muutetaan näitä niin muistetaan muuttaa kaikkiin kohtiin missä käytetään tässä tiedostossa
    "Viitenumero",
    "Kategoria",
    "Kuvaus"
  ];
  const [expenseCategories, setExpenseCategories] = useState();
  const [incomeCategories, setIncomeCategories] = useState();

  const fileUploadAndParse = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setExpenseCategories(await loadCategories(TransactionCategory.EXPENSE));
    setIncomeCategories(await loadCategories(TransactionCategory.INCOME));

    // Luetaan tiedosto
    Papa.parse(file, {
      complete: (result) => {
        if (result.data.length > 0) {
          for (var i = 0; i < result.data[0].length; i++) {
            // Löydetään datan halutut sarakkeet otsikkorivin nimien perusteella
            switch (result.data[0][i]) {
              case "Kirjauspäivä":
                updateColumnIndex("Päivämäärä", i);
                break;
              case "Määrä":
                updateColumnIndex("Summa", i);
                break;
              case "Maksaja":
                updateColumnIndex("Oma tili", i);
                break;
              case "Maksunsaaja":
                updateColumnIndex("Oma tili2", i);
                break;
              case "Nimi":
                updateColumnIndex("Toinen osapuoli", i);
                break;
              case "Viitenumero":
                updateColumnIndex("Viitenumero", i);
                break;
            }
          }

          // Valitaan datasta vain tarvittavat sarakkeet
          let sortedData = [];
          for (var i = 1; i < result.data.length; i++) {
            let row = result.data[i];

            let date = new Date(row[columnIndexes.get("Päivämäärä")]);
            date = date.toISOString().substring(0,10); // Ei toimi oikein enää vuonna 10000

            // Jos on erikseen maksaja ja maksunsaaja
            let account = row[columnIndexes.get("Oma tili")];
            if (!row[columnIndexes.get("Oma tili")]) {
              account = row[columnIndexes.get("Oma tili2")];
            }

            sortedData.push([
              date,
              row[columnIndexes.get("Summa")].replace(",", "."),
              account,
              row[columnIndexes.get("Toinen osapuoli")],
              row[columnIndexes.get("Viitenumero")],
              "", // TODO tähän kategoria-arvaukset
              ""
            ]);
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

  const handleInput = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex] = [...newData[rowIndex]];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  const saveTransactions = () => {
    // Tallennuspainike on poissa käytöstä kun pakollisia kenttiä ei ole täytetty
    // TODO tähän myös muut pakolliset kentät, ja puuttuvista tiedoista joku ilmoitus
    if (tableData.some((row) => row[columns.indexOf("Kategoria")] === "")) return;

    // TODO tietojen tallennus
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
            <tr>
              {/* Otsikkorivi */}
              {columns.map((col, index) => (
                <th key={index} className="border border-gray-500 p-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => {
                  const createInput = (c) => {
                    // Inputin tyyppi riippuu sarakkeen datatyypistä
                    switch (c) {
                      case "Päivämäärä":
                        return <input
                        type="date"
                        defaultValue={tableData[rowIndex][colIndex] || ""}
                        onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)} />;
                      case "Summa":
                        return <input
                        type="number"
                        step=".01"
                        inputMode="decimal"
                        defaultValue={tableData[rowIndex][colIndex] || ""}
                        onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)} />;
                      case "Viitenumero":
                        return <input
                        type="text"
                        inputMode="numeric"
                        defaultValue={tableData[rowIndex][colIndex] || ""}
                        onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)} />; // TODO tälle jokin tapa rajoittaa inputit vain numeroihin, mutta input type="number" ei välttämättä ole oikea ratkaisu tähän
                      case "Kategoria":
                        return (
                          <select onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}>
                            <option value="">Valitse kategoria</option>
                            {(tableData[rowIndex][columns.indexOf("Summa")].startsWith("-") ? expenseCategories : incomeCategories).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.category_name}
                              </option>
                            ))}
                          </select>
                        );
                      case "Nimi":
                      case "Oma tili":
                      case "Toinen osapuoli":
                      case "Kuvaus":
                      default:
                        return <input
                        type="text"
                        defaultValue={tableData[rowIndex][colIndex] || ""}
                        onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)} />;
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

      {tableData.length > 0 && (
        <button onClick={saveTransactions}>Tallenna</button>
      )}
    </div>
  );
};

export default TransactionFileImport;