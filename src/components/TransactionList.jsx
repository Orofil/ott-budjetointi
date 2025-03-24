import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Modal, Stack } from "react-bootstrap";
import TransactionListItem from "./TransactionListItem";
import TransactionEditView from "./TransactionEditView";
import { useTransactions } from "../actions/Transactions";

export default function TransactionList() {
  const { loadedTransactions, loadTransactions } = useTransactions();
  const [offset, setOffset] = useState(0); // Seuraavaksi ladattavien tapahtumien indeksit kaikkien tapahtumien joukossa // TODO nämä Transactions-tiedostoon
  const [hasMore, setHasMore] = useState(false); // Onko tapahtumia vielä haettavana
  const [loading, setLoading] = useState(false);
  const loadingLock = useRef(false); // Lukitsee tapahtumien lataamiseen vain yhteen samanaikaiseen suoritukseen
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState();

  const PAGE_LIMIT = 20;

  const loadMore = async () => {
    if (loadingLock.current) return;
    loadingLock.current = true;
    
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
        <p className="fst-italic text-center">Ei tilitapahtumia</p>
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
          <Modal.Title>Muokkaa tilitapahtumaa</Modal.Title>
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