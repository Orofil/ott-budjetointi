import React, { useEffect, useState } from "react";
import { loadCategories } from "../actions/Categories";

export default function CategoryDropdown({ categoryType }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      let c = await loadCategories(categoryType);
      if (c != null) setCategories(c);
      setLoading(false);
    };
    fetchCategories();
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