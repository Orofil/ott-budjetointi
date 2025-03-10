import React, { useEffect, useState } from "react";
import { loadTransactions } from "../actions/Transactions";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0); // Seuraavaksi ladattavien tapahtumien indeksit kaikkien tapahtumien joukossa
  const [hasMore, setHasMore] = useState(true); // Onko tapahtumia vielä haettavana
  const [loading, setLoading] = useState(false);

  const PAGE_LIMIT = 1; // TODO väliaikainen arvo, tästä tehdään ehkä 20-50

  const loadMore = async () => {
    setLoading(true);

    console.log("Offset alussa:", offset); // TEMP
    const data = await loadTransactions(offset, PAGE_LIMIT);

    setTransactions((prev) => [...prev, ...data.slice(0, -1)]);
    setOffset((prev) => prev + PAGE_LIMIT);
    setHasMore(data[-1] != null);
    setLoading(false);
    console.log("Offset lopussa:", offset); // TEMP
    /*
    FIXME offsetin arvo ei päivity, ja tämä funktio suoritetaan jostain syystä monta kertaa vaikka sen pitäisi suorittua vain kerran sivun latautuessa ja sitten "Lataa lisää"-painikkeella
    Taitaa aiheuttaa ongelmia kun funktio on async, koska tulostusten perusteella sitä suoritetaan 2x rinnakkain
    */
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