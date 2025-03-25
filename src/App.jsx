import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./config/supabaseClient";
import { Container, Row } from "react-bootstrap";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TransactionImport from "./pages/TransactionImport";
import Budgets from "./pages/BudgetPage";
import CreateBudgetPage from "./pages/CreateBudget";
import Settings from "./pages/Settings";
import HeaderNav from "./components/HeaderNav";
import { CategoryProvider } from "./actions/Categories";
import { AccountProvider } from "./actions/Accounts";
import { BudgetProvider } from "./actions/Budgets";


function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Asetetaan kuuntelija, joka reagoi autentikointitapahtumiin (esim. kirjautuminen, uloskirjautuminen)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          // Jos käyttäjä on kirjautunut sisään
          if (!session.user.email_confirmed_at) {
            // Jos käyttäjän sähköpostiosoite ei ole vahvistettu
            setMessage("Vahvista sähköpostiosoitteesi."); // Ilmoitetaan käyttäjälle sähköpostin vahvistuksesta
            setUser(null); // Estetään pääsy Dashboardiin, kunnes sähköposti on vahvistettu
          } else {
            setUser(session.user); // Asetetaan käyttäjän tiedot tilaan
            setMessage(""); // Tyhjennetään mahdollinen viesti
          }
        } else {
          setUser(null); // Jos käyttäjä on uloskirjautunut, nollataan käyttäjätila
          setMessage(""); // Tyhjennetään mahdollinen viesti uloskirjautumisen jälkeen
        }
      }
    );

    // Palautetaan puhdistusfunktio, joka poistaa kuuntelijan, kun komponentti poistuu käytöstä
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <BudgetProvider>
    <AccountProvider>
    <CategoryProvider>
    <BrowserRouter>
      <Container fluid className="p-0">
        <HeaderNav />

        {/* Pääsisältöalue */}
        <Row className="min-vh-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transaction-import" element={<TransactionImport />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/create-budget" element={<CreateBudgetPage />} />
            <Route path="/settings" element={<Settings/>} />

            {/* Suojattu reitti */}
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />} // Jos käyttäjä on kirjautunut sisään, näytetään Dashboard, muuten ohjataan kirjautumissivulle
            />
          </Routes>

          {message && <div className="message">{message}</div>}
        </Row>
      </Container>
    </BrowserRouter>
    </CategoryProvider>
    </AccountProvider>
    </BudgetProvider>
  );
}

export default App;
