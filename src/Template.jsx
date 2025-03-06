import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Template() {
  return (
    <div>
      {/* Yläpalkki */}
      <div className="topbar">
        <h1>Budjetointityökalu</h1>
        {/*Profiilikuva yläkulmassa, linkki profiilisivulle?*/}
        <Link to="/" className="user">
          A
        </Link>
      </div>
      <div className="container">
        {/* Sivupalkki/Navigaatio, linkit eivät nyt johda minnekkään */}
        <div className="sidebar">
          <a></a>
          <Link to="/">Kotisivu</Link>
          <Link to="/">Tapahtumien tuonti</Link>
          <Link to="/">Budjettien hallinta</Link>
          <Link to="/">Asetukset</Link>
        </div>

        {/* Pääsisältöalue */}
        <div className="main-content">
          <p>Tähän sisältö.</p>
        </div>
      </div>
    </div>
  );
}

export default Template;
