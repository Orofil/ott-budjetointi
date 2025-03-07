import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { TransactionCategory } from "../constants/transactionCategory";

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
    <select disabled={loading}>
      <option value="">Valitse kategoria</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.category_name}
        </option>
      ))}
    </select>
  );
}