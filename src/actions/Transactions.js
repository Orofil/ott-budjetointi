import supabase from "../config/supabaseClient";
import { TransactionCategory } from "../constants/TransactionCategory";

export const createTransaction = async (t) => {
  // Lisätään tapahtuma
  const { data, error } = await supabase.rpc("add_transaction", {
    p_date: t.date,
    p_reference_number: t.reference_number,
    p_description: t.description,
    p_amount: t.amount,
    p_account: t.account,
    p_name: t.name,
    p_category_id: t.category
  });
  if (data != null) console.log("Tapahtuma luotu, ID:", data);
  if (error != null) console.log("Virhe tapahtuman tallentamisessa:", error);
  return data;
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
};

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

export const deleteTransaction = async (type, id) => {
  // Haetaan kirjautuneen käyttäjän tiedot
  const { data: { user } } = await supabase.auth.getUser();

  // Tarkistetaan kuuluuko tapahtuma kirjautuneelle käyttäjälle
  const { error } = await supabase
    .from("all_transactions")
    .select()
    .eq("type", type.types[0])
    .eq("user_id", user.id)
    .eq("id", id);
  
  if (error) {
    console.error("Poistettavaa tapahtumaa ei löydy:", error);
    return null;
  }

  const { data, error1 } = await supabase
    .from(type == TransactionCategory.EXPENSE ? "expense_transactions" : "income_transactions")
    .delete()
    .eq("id", id)
    .select();
  
  if (error1) {
    console.error("Virhe tapahtuman poistossa:", error1);
    return null;
  }
  console.log("Tapahtuma poistettu:", data);
  return data;
}