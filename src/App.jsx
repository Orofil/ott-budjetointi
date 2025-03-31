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
import EditCategories from "./pages/EditCategories";
import HeaderNav from "./components/HeaderNav";
import { CategoryProvider } from "./context/CategoryContext";
import { AccountProvider } from "./context/AccountContext";
import { BudgetProvider } from "./context/BudgetContext";
import { UserProvider } from "./context/UserContext"; 
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <UserProvider>
      <BudgetProvider>
        <AccountProvider>
          <CategoryProvider>
            <BrowserRouter>
              <Container fluid className="p-0">
                <HeaderNav />
                <Row className="min-vh-100">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/transaction-import" element={<TransactionImport />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/create-budget" element={<CreateBudgetPage />} />
                    <Route path="/editCategories" element={<EditCategories />} />
                  </Routes>
                </Row>
              </Container>
            </BrowserRouter>
          </CategoryProvider>
        </AccountProvider>
      </BudgetProvider>
    </UserProvider>
  );
}

export default App;
