import supabase from "../config/supabaseClient";
import { TransactionCategory, findTransactionCategory } from "../constants/TransactionCategory";

export const createTransaction = async (currentState, formData) => {
  if (formData == null) return;

  console.log(formData);
  const type = findTransactionCategory(formData.get("type"));
  const amount = formData.get("amount");
  const payeePayer = formData.get("payee-payer");
  const date = formData.get("date");
  const account = formData.get("account");
  const category = formData.get("category");
  const referenceNumber = formData.get("reference-number");
  const description = formData.get("description");
  let message = null;
  if (!type) {
    message = "Tapahtuman tyyppi puuttuu";
  } else if (!amount) {
    message = "Summa puuttuu";
  } else if (!payeePayer) {
    message = "Saaja/Maksaja puuttuu";
  } else if (!date) {
    message = "Päivämäärä puuttuu";
  } else if (!account) {
    message = "Tili puuttuu";
  } else if (!category) {
    message = "Kategoria puuttuu";
  } else if (amount == 0) {
    message = "Summa ei voi olla nolla";
  }
  if (message) {
    return message;
  }
  
  // Lisätään tapahtuma
  const { data, error } = await supabase.rpc("add_transaction", {
    p_date: date,
    p_reference_number: referenceNumber,
    p_description: description,
    p_amount: amount,
    p_account: account,
    p_name: payeePayer,
    p_category_id: category
  });

  if (data != null) console.log("Tapahtuma luotu, ID:", data);
  if (error != null) {
    console.log("Virhe tapahtuman tallentamisessa:", error);
    message = "Virhe tapahtuman tallentamisessa";
  }
  return message;
};

export const createTransactions = async (transactions) => {
  if (transactions == null) return;

  // TODO tätä varten pitää tehdä tietokantafunktio jotta nämä voi kaikki peruuttaa jos jossain kohti on virhe
  for (let i = 0; i < transactions.length; i++) {
    let tr = transactions[i];
    const { data, error } = await supabase.rpc("add_transaction", {
      p_date: tr.date,
      p_reference_number: tr.reference_number === "" ? null : Number(tr.reference_number),
      p_description: tr.description,
      p_amount: tr.amount,
      p_account: tr.account,
      p_name: tr.name,
      p_category_id: tr.category
    });
  
    if (data != null) console.log("Tapahtuma luotu, ID:", data);
    if (error != null) {
      console.log("Virhe tapahtuman tallentamisessa:", error);
      return;
    }
  }
}

export const loadTransactions = async (offset, pageLimit) => {
  // Haetaan kirjautuneen käyttäjän tiedot
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("all_transactions")
    .select()
    .eq("user_id", user.id)
    .range(offset, offset + pageLimit);
  
  if (error) {
    console.error("Virhe tapahtumien haussa:", error);
    return null;
  }
  return data;
};