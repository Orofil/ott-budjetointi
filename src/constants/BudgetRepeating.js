export const BudgetRepeating = Object.freeze({
  WEEKLY: { value: "weekly", text: "Viikoittain" },
  MONTHLY: { value: "monthly", text: "Kuukausittain" },
  QUARTERLY: { value: "quarterly", text: "Neljännesvuosittain" },
  BIANNUALLY: { value: "biannually", text: "Puolivuosittain" },
  ANNUALLY: { value: "annually", text: "Vuosittain" }
});

export const findBudgetRepeating = (value) => {
  return Object.values(BudgetRepeating).find(obj => obj.value === value);
};