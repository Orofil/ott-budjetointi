import React, { useEffect, useRef, useState } from "react";
import { loadTransactions } from "../actions/Transactions";
import { Button, Container, Modal, Stack } from "react-bootstrap";
import TransactionListItem from "./TransactionListItem";
import TransactionEditView from "./TransactionEditView";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0); // Seuraavaksi ladattavien tapahtumien indeksit kaikkien tapahtumien joukossa
  const [hasMore, setHasMore] = useState(false); // Onko tapahtumia vielä haettavana
  const [loading, setLoading] = useState(false);
  const loadingLock = useRef(false); // Lukitsee tapahtumien lataamiseen vain yhteen samanaikaiseen suoritukseen
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState();

  const PAGE_LIMIT = 20;

  const loadMore = async () => {
    if (loadingLock.current) return;
    loadingLock.current = true;
    setLoading(true);

    const data = await loadTransactions(offset, PAGE_LIMIT);
    if (!data.length) {
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

  const selectTransaction = (data) => {
    setSelectedData(data);
    setShowModal(true);
  }

  return (
    <Container className="my-4 mx-auto w-100" style={{ maxWidth: "60em" }}>
      <Stack gap={2}>
        {transactions.map((t) => (
          <TransactionListItem
          key={t.type + ":" + t.id}
          transaction={t}
          onClick={() => selectTransaction(t)} />
        ))}
      </Stack>

      {!transactions.length && (
        <p className="fst-italic text-center">Ei pankkitapahtumia</p>
      )}

      {hasMore && (
        <Button
          type="button"
          className="my-4 w-100"
          disabled={loading}
          onClick={loadMore}
        >
          Lataa lisää...
        </Button>
      )}

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Muokkaa pankkitapahtumaa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TransactionEditView data={selectedData} onSubmit={success => {
            if (success) setShowModal(false);
          }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}