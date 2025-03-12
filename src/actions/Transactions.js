import supabase from "../config/supabaseClient";
import { TransactionCategory } from "../constants/TransactionCategory";

export const createTransaction = async (currentState, formData) => {
  if (formData == null) return;

  console.log(formData);
  const type = formData.get("type");
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
  
  // Haetaan kirjautuneen käyttäjän tiedot
  const { data: { user } } = await supabase.auth.getUser();

  // Lisätään tapahtuma
  const { data, error } = await supabase.rpc("add_transaction", {
    p_user_id: user.id,
    p_date: date,
    p_reference_number: referenceNumber,
    p_description: description,
    p_amount: (type == TransactionCategory.EXPENSE ? "-" : "") + amount,
    p_account_from: (type == TransactionCategory.EXPENSE ? account : payeePayer),
    p_account_to: (type == TransactionCategory.EXPENSE ? payeePayer : account),
    p_category_id: category
  });

  if (data != null) console.log("Tapahtuma luotu, ID:", data);
  if (error != null) {
    console.log("Virhe tapahtuman tallentamisessa:", error);
    message = "Virhe tapahtuman tallentamisessa";
  }
  return message;
};

export const loadTransactions = async (offset, pageLimit) => {
  // Haetaan kirjautuneen käyttäjän tiedot
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("transaction")
    .select()
    .eq("user_id", user.id)
    .range(offset, offset + pageLimit);
  
  if (error) {
    console.error("Virhe tapahtumien haussa:", error);
    return null;
  }
  return data;
};