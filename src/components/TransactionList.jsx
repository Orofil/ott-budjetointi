import React, { useEffect, useRef, useState } from "react";
import { loadTransactions } from "../actions/Transactions";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0); // Seuraavaksi ladattavien tapahtumien indeksit kaikkien tapahtumien joukossa
  const [hasMore, setHasMore] = useState(true); // Onko tapahtumia vielä haettavana
  const [loading, setLoading] = useState(false);
  const loadingLock = useRef(false); // Lukitsee tapahtumien lataamiseen vain yhteen samanaikaiseen suoritukseen

  const PAGE_LIMIT = 1; // TODO väliaikainen arvo, tästä tehdään ehkä 20-50

  const loadMore = async () => {
    if (loadingLock.current) return;
    loadingLock.current = true;
    setLoading(true);

    const data = await loadTransactions(offset, PAGE_LIMIT);
    if (data == null) {
      console.log("Tapahtumia ei löytynyt!");
    };

    if (data.length > PAGE_LIMIT) {
      setTransactions((prev) => [...prev, ...data.slice(0, -1)]);
      setHasMore(true);
    } else {
      setTransactions((prev) => [...prev, ...data]);
      setHasMore(false);
    }
    setOffset((prev) => prev + PAGE_LIMIT);
    setLoading(false);
    loadingLock.current = false;
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div>
      <ul>
        {transactions.map((t) => (
          <li key={t.transaction_id}>
            {t.date} : {t.amount} : {t.description}
          </li>
        ))}
      </ul>

      {hasMore && (
        <button type="button" disabled={loading} onClick={loadMore}>Lataa lisää...</button>
      )}
    </div>
  );
}