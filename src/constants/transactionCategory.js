export const TransactionCategory = Object.freeze({
  EXPENSE: { id: "0", types: [0] },
  INCOME: { id: "1", types: [1] },
  ALL: { id: "2", types: [0, 1] }
});

export const findTransactionCategory = (id) => {
  return Object.values(TransactionCategory).find(obj => obj.id === id);
}