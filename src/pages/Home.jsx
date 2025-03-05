import React from "react";
import { Link } from "react-router-dom"; 

function Home() {
  return (
    <div>
      <h1>Tervetuloa budjetointisovellukseen</h1> 
      <Link to="/register">Rekisteröidy</Link>
      <br />
      <Link to="/login">Kirjaudu sisään</Link>
    </div>
  );
}

export default Home;