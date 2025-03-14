import React, { useEffect, useRef, useState } from "react";
import { loadTransactions } from "../actions/Transactions";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0); // Seuraavaksi ladattavien tapahtumien indeksit kaikkien tapahtumien joukossa
  const [hasMore, setHasMore] = useState(false); // Onko tapahtumia vielä haettavana
  const [loading, setLoading] = useState(false);
  const loadingLock = useRef(false); // Lukitsee tapahtumien lataamiseen vain yhteen samanaikaiseen suoritukseen

  const PAGE_LIMIT = 20;

  const loadMore = async () => {
    if (loadingLock.current) return;
    loadingLock.current = true;
    setLoading(true);

    const data = await loadTransactions(offset, PAGE_LIMIT);
    if (data == null) {
      console.log("Tapahtumia ei löytynyt!");
      return;
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
          <li key={t.type + ":" + t.id}>
            {t.date} : {t.amount} : {t.description}
          </li>
        ))}
      </ul>

      {/* TODO testaa toimiiko */}
      {!transactions && (
        <p>Ei tilitapahtumia</p>
      )}

      {hasMore && (
        <button type="button" disabled={loading} onClick={loadMore}>Lataa lisää...</button>
      )}
    </div>
  );
}