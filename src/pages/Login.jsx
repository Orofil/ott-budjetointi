import React, { useState } from "react"; 
import supabase from "../config/supabaseClient"; 
import { Link, useNavigate } from "react-router-dom"; 

function Login() {

  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [message, setMessage] = useState("");  
  const [isEmailSent, setIsEmailSent] = useState(false);  

  // handleSubmit on funktio, joka hoitaa lomakkeen lähettämisen ja sisäänkirjautumisen
  const handleSubmit = async (event) => {
    event.preventDefault();  
    setMessage("");  

    // Yritetään kirjautua Supabase-palvelun avulla
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Jos virhe ilmenee kirjautumisen aikana, näytetään virheilmoitus 
    if (error) {
      setMessage(error.message); 

      // Jos virheilmoitus liittyy sähköpostin varmistamiseen, pyydetään käyttäjää painamaan 'lähetä uusi vahvistuslinkki'-painiketta.
      if (error.message.toLowerCase().includes("confirm")) {
        setIsEmailSent(true);
      }
      return;  
    }

    
    // Tarkistetaan, onko sähköposti vahvistettu
    if (data.user && !data.user.email_confirmed_at) {
      setMessage("Sähköpostia ei ole vahvistettu. Tarkista sähköpostisi.");
      setIsEmailSent(true);
      return;
    }

    setMessage("Kirjautuminen onnistui!");
    navigate("/dashboard");
  };

  // handleResendConfirmation lähettää vahvistuslinkin uudelleen
  const handleResendConfirmation = async () => {
    setMessage(""); // Tyhjennetään viesti ennen uutta pyyntöä
  
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false }, // Estetään uuden käyttäjän luonti
    });
  
    if (error) {
      setMessage("Vahvistuslinkin lähetys epäonnistui. Yritä uudelleen.");
    } else {
      setMessage("Vahvistuslinkki on lähetetty uudelleen. Tarkista sähköpostisi.");
    }
  };

  return (
    <div>
      <h2>Kirjaudu sisään</h2>
      <br />
      {message && <span>{message}</span>}  {/* Näytetään mahdollinen virheilmoitus tai onnistumisviesti */}

      <form onSubmit={handleSubmit}>  {/* Lomakkeen lähetyksen käsittely */}
        <input
          onChange={(e) => setEmail(e.target.value)}  // Päivitetään sähköposti-tila
          value={email}
          type="email"
          placeholder="Sähköposti"
          required  // Tämä kenttä on pakollinen
        />
        <input
          onChange={(e) => setPassword(e.target.value)}  // Päivitetään salasana-tila
          value={password}
          type="password"
          placeholder="Salasana"
          required  // Tämä kenttä on pakollinen
        />
        <button type="submit">Kirjaudu sisään</button>  {/* Lähetetään lomake */}
      </form>

      {isEmailSent && (  // Jos sähköposti ei ole vahvistettu, näytetään vaihtoehto lähettää vahvistuslinkki uudelleen
        <div>
          <p>Sähköpostisi ei ole vahvistettu. Voit pyytää uuden vahvistuslinkin.</p>
          <button onClick={handleResendConfirmation}>Lähetä uusi vahvistuslinkki</button>
        </div>
      )}

      <span>Ei vielä tiliä?</span>
      <Link to="/register">Rekisteröidy</Link>  {/* Linkki rekisteröitymissivulle, jos käyttäjällä ei ole tiliä */}
    </div>
  );
}

export default Login;