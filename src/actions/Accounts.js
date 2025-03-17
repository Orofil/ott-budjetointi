import supabase from "../config/supabaseClient";

export const loadAccounts = async () => {
  // Haetaan kirjautuneen käyttäjän tiedot
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("accounts")
    .select()
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Virhe tilien haussa:", error);
    return null;
  }
  return data;
};