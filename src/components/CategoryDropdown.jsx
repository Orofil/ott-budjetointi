import React from "react";
import { useCategories } from "../actions/Categories";
import { TransactionCategory } from "../constants/TransactionCategory";

export default function CategoryDropdown({ categoryType }) {
  const { expenseCategories, incomeCategories, loading } = useCategories();

  return (
    <select disabled={loading} name="category">
      <option value="">Valitse kategoria</option>
      {(categoryType == TransactionCategory.EXPENSE ? expenseCategories : incomeCategories).map((c) => (
        <option key={c.id} value={c.id}>
          {c.category_name}
        </option>
      ))}
    </select>
  );
}