function parseCSV(data, accounts) {
  if (data.length > 0) {
    let result = [];
    let columns;
    // Arvioidaan datan muoto otsikkorivin perusteella
    let headerRow = data[0];
    if (headerRow[1] === "Määrä") { // Nordea
      columns = {
        date: 0,
        amount: 1,
        account: 2,
        account2: 3,
        name: 4,
        reference_number: 6
      };
    } else if (headerRow[1] === "Maksupäivä") { // S-Pankki
      columns = {
        date: 0,
        amount: 2,
        payer: 4,
        payee: 5,
        account: 6,
        reference_number: 8
      };
    } else if (headerRow[1] === "Arvopäivä") { // Osuuspankki
      columns = {
        date: 0,
        amount: 2,
        name: 5,
        reference_number: 8
      };
    } else {
      console.log("Tuntematon datamuoto CSV:ssä");
      return;
    }

    // Luetaan riveiltä tarvittava data
    for (var i = 1; i < data.length; i++) {
      let row = data[i];
  
      // Ohitetaan tyhjät rivit ja varaukset
      if (!row[columns.date] || row[columns.date] === "Varaus") {
        continue;
      }
  
      let date;
      const dateRegex = /^(\d+)\.(\d+)\.(\d+)$/; // dd.mm.yyyy-muoto
      const match = row[columns.date].match(dateRegex);
      if (match) {
        const day = parseInt(match[1]) + 1;
        const month = parseInt(match[2]) - 1;
        const year = parseInt(match[3]);
        date = new Date(year, month, day);
      } else {
        date = new Date(row[columns.date]);
      }
      date = date.toISOString().substring(0,10); // Ei toimi oikein enää vuonna 10000 :)
  
      let amount = row[columns.amount].replace(",", ".");

      let accountNumber = "";
      let name;
      if (columns.payer) { // Oma nimi ja toisen osapuolen nimi vaihtavat paikkoja kuluissa ja tuloissa
        if (row[columns.amount].startsWith("-")) {
          name = row[columns.payee];
        } else {
          name = row[columns.payer];
          accountNumber = row[columns.account];
        }
      } else {
        // Account2 on sitä varten jos kuluissa ja tuloissa on oma tili eri sarakkeissa
        if (columns.account) {
          accountNumber = row[columns.account] ? row[columns.account] : row[columns.account2];
        }
        name = row[columns.name];
      }
      let accountID = accounts.find(a => a.account_number == accountNumber)?.id || "";
      
      let reference_number = row[columns.reference_number];
      if (reference_number.startsWith("ref=")) { // Jos alussa on "ref="
        reference_number = reference_number.slice(reference_number.indexOf("=") + 1);
      }
      // Hyväksytään vain numerot viitenumeroksi
      const numberRegex = /^\d+$/;
      if (!reference_number.match(numberRegex)) {
        reference_number = "";
      }
  
      result.push({
        date: date,
        amount: amount,
        account_number: accountNumber, // Tilikentän tekstiä varten
        account: accountID,
        name: name,
        reference_number: reference_number,
        category: "", // TODO tähän kategoria-arvaukset
        description: ""
      });
    }
    
    // Lajitellaan tapahtumat päivämäärän mukaan nousevaan järjestykseen
    result = result.sort((a, b) => {
      return a.date > b.date;
    });
    return result;
  }
  return null;
};

export default parseCSV;