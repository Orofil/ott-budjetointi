import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { TransactionCategory } from "../constants/TransactionCategory";

export default function CategoryDropdown({ categoryType }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExpenseCategories = async () => {
      // Jatketaan vain jos kategorian tyyppi löytyy TransactionCategorysta
      if (!Object.values(TransactionCategory).includes(categoryType)) {
        return;
      }
      
      // Haetaan kaikki kategoriat
      // TODO hae vain kirjautuneen käyttäjän kategoriat ja is_default kategoriat
      // const { data, error } = await supabase.from(categoryType).select("*")
      //   .or(`is_default.eq.TRUE,user_id.eq${userID}`);
      setLoading(true);
      const { data, error } = await supabase.from(categoryType).select("*");
      if (error) {
        console.error("Error getting categories:", error);
      } else {
        setCategories(data);
      }
      setLoading(false);
    };

    loadExpenseCategories();
  }, [categoryType]); // Päivitetään kun categoryType muuttuu

  return (
    <select disabled={loading} name="category">
      <option value="">Valitse kategoria</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.category_name}
        </option>
      ))}
    </select>
  );
}