import React, { useEffect, useRef, useState } from "react";
import { loadTransactions } from "../actions/Transactions";
import { Stack } from "react-bootstrap";
import TransactionContainer from "./TransactionContainer";

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
      <Stack gap={2} className="mx-auto w-100" style={{ maxWidth: "60em" }}>
        {transactions.map((t) => (
          <TransactionContainer key={t.type + ":" + t.id} transaction={t} /> // TODO onClick ja modal
        ))}
      </Stack>

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