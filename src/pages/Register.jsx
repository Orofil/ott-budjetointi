import React, { useState } from "react";
import supabase from "../config/supabaseClient";
import { Link } from "react-router-dom";
import { AuthWeakPasswordError, isAuthWeakPasswordError } from "@supabase/supabase-js";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Nollataan aiemmat viestit

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (isAuthWeakPasswordError(error)) {
      setMessage("Salasana on liian lyhyt. Sen on oltava vähintään 6 merkkiä.");
      return;
    } else if (error) {
      console.error("Supabase auth signUp error:", error);
      setMessage("Tapahtui virhe, yritä uudelleen.");
      return;
    }

    setMessage("Käyttäjätili luotu! Vahvista sähköpostisi.");
    setEmailSent(true);
    setEmail(""); // Tyhjennetään sähköposti
    setPassword(""); // Tyhjennetään salasana
  };

  const resendEmail = async () => {
    const { data, error } = await supabase.auth.resendConfirmationEmail(email);

    if (error) {
      console.error("Supabase resend email error:", error);
      setMessage("Sähköpostin lähetys epäonnistui. Yritä uudelleen.");
    } else {
      setMessage("Vahvistuslinkki lähetetty uudelleen!");
    }
  };

  return (
    <div>
      <h2>Rekisteröidy</h2>
      <br />
      {message && <span>{message}</span>}

      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Sähköposti"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Salasana"
          required
        />
        <button type="submit">Luo tili</button>
      </form>

      {emailSent && (
        <div>
          <p>Jos et ole saanut vahvistuslinkkiä, pyydä se uudelleen:</p>
          <button onClick={resendEmail}>Lähetä vahvistuslinkki uudelleen</button>
        </div>
      )}

      <span>Onko sinulla jo tili?</span>
      <Link to="/login">Kirjaudu sisään</Link>
    </div>
  );
}

export default Register;
