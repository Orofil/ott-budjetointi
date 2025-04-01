# Budjetointiohjelma 💸

*Ohjelmistotuotanto II - Ryhmä 5*

## Sovelluksen käyttö

### Asennus


1. Lataa projektin tiedostot koneellesi
2. Avaa komentokehote ja siirry kansioon, jossa projektisi on
3. Suorita ```npm install``` ([Node.js](https://nodejs.org/en) vaaditaan)
4. Suorita ```npm run dev```
5. Avaa komentokehotteeseen ilmestynyt osoite, joka alkaa ```http://localhost:```...

Jatkossa riittää tehdä vain vaiheet 2, 4 ja 5. Jos sovellusta on päivitetty eikä se enää avaudu, suorita ```npm install``` ja kokeile uudestaan.


### Käyttäminen

Sovellus avautuu kirjautumissivulle. Valitse "Rekisteröidy" jos sinulla ei ole vielä tiliä, ja muussa tapauksessa "Kirjaudu sisään".

Rekisteröityessä syötä sähköposti ja salasana joita haluat käyttää sovellukseen kirjautuessa. **Älä käytä sellaista salasanaa, jota käytät jo muualla!** Vähimmäispituus salasanalle on kuusi merkkiä. Ohjelma ilmoittaa jos rekisteröinti onnistuu, ja sähköpostiisi tulee linkki, joka sinun tulee avata tunnin sisällä rekisteröitymisestä, jotta tili luodaan.

#### Etusivu

Kirjauduttuasi sisään saavut budjetointiohjelman etusivulle.



## Kehittäjille

### Sovelluksen kehityskäyttö

1. Kloonaa repositorio tai lataa sen tiedostot
2. Avaa komentorivi ladatussa kansiossa
3. Suorita ```npm install``` ([Node.js](https://nodejs.org/en) vaaditaan)
4. Suorita ```npm run dev```
5. Avaa komentokehotteeseen ilmestynyt osoite, joka alkaa ```http://localhost:```...

Jatkossa riittää tehdä vain vaiheet 2, 4 ja 5. Jos sovellusta on päivitetty eikä se enää avaudu, suorita ```npm install``` ja kokeile uudestaan.

---

### React-sovellus

Sivuston HTML-sisältö ```index.html``` kutsuu skriptin ```/src/main.jsx```, joka luo sovelluksen (```<App />```) ```<div id="root">```-elementtiin.

Tiedosto ```src/App.jsx``` sisältää sovelluksen rakenteen. App.jsx tarkistaa käyttäjän kirjautumisen tilan ja palauttaa ```BrowserRouter```in sovelluksen eri sivujen välistä navigaatiota varten. Oletussivu on [```<Home />```](#kotisivu--home) ```UserProvider```, ```BudgetProvider``` yms. ympäröivät BrowserRouteria, jotta [kontekstit](#kontekstit-context) ovat käytettävissä sovelluksen osissa. App.jsx sisältää myös [```HeaderNav```](#otsikkorivi-ja-navigaatio--headernav)-elementin eli sovelluksen otsikko- ja navigaatiopalkin.

<br>

```src/actions``` sisältää erilaisia toimintoja. Monet sovelluksen toiminnoista on kirjoitettu osaksi komponentteja tai sivuja, mutta osa on erikseen täällä kansiossa.

```src/assets``` sisältää sovelluksessa käytettävät grafiikat.

```src/components``` sisältää HTML-komponentit, jotka eivät ole kokonaisia sivuja, ja joita voidaan käyttää useaan kertaan eri sivuilla tai jopa samalla sivulla.

```src/config``` sisältää sovellukseen liittyvät asetukset ja tietokantasession.

```src/constants``` sisältää vakioarvoja, kuten tilitapahtumien erottelun kulujen ja tulojen välillä.

```src/context``` sisältää "konteksteja"; tiedostoja, jotka kommunikoivat tietokannan kanssa ja säilövät tietokantaobjekteja sovelluksen käyttöön.

```src/pages``` sisältää sovelluksen eri sivut, joiden välillä käyttäjä voi navigoida App.jsx-tiedostossa määritellyn ```BrowserRouter```in avulla.

#### Sivut (pages)

##### Kotisivu – Home

Sovelluksen ensimmäinen sivu. Sisältää linkit [rekisteröitymiseen](#rekisteröityminen--register) ja [kirjautumiseen](#kirjautuminen--login).

##### Budgettisivu – BudgetPage



##### Budjetin luonti – CreateBudget



##### Etusivu – Dashboard



##### Kirjautuminen – Login



##### Rekisteröityminen – Register



##### Asetukset – Settings



##### Pankkitapahtumien luonti – TransactionImport



#### Toiminnot (actions)



#### Komponentit (components)

##### Tilivalikko – AccountDropdown



##### Ensimmäisen tilin luonti – AccountSelectionModule



##### Budjettiluettelon alkio – BudgetListItem



##### Otsikkorivi ja navigaatio – HeaderNav



##### Kirjautuneen käyttäjän ohjaus – ProtectedRoute



##### Pankkitapahtuman muokkausnäkymä – TransactionEditView



##### Pankkitapahtuman CSV-tiedoston vienti – TransactionFileImport



##### Pankkitapahtumaluettelo – TransactionList



##### Pankkitapahtumaluettelon alkio – TransactionListItem



#### Kontekstit (context)



---

### Tietokanta

Tietokantapalveluna toimii Supabase, joka käyttää PostgreSQL-tietokantaa.

#### Taulut

Taulukoiden pääavaimet on merkitty lihavoinnilla, ja kenttien tietotyypit on merkitty kursivoinnilla. Pääavaimet ovat automaattisesti pakollisia, joten niiden pakollisuutta ei ole erikseen kirjoitettu.

##### Käyttäjätilit – ```auth.users```

```auth```-skeeman ```users```-taulu on Supabasen autentikointijärjestelmän automaattisesti luotu taulu, johon jokainen rekisteröitynyt käyttäjä tallennetaan. Taulun kenttää ```id``` käytetään useassa taulussa kentässä ```user_id``` käyttäjän tunnistamiseen.

##### Tilit – ```accounts```

Älä sekoita käyttäjätileihin, jotka tallennetaan tauluun auth.users.

Pankkitili, jolla on tilinumero ja valinnainen nimi sekä käyttäjätili, joka omistaa pankkitilin.

- **id**
  - *int8*
  - Pääavain
- user_id
  - *uuid*
  - Viiteavain [```auth.users```](#käyttäjätilit---authusers)-tauluun
  - Pakollinen
- account_number
  - *text*
  - Pakollinen
- account_name
  - *text*
- created_at
  - *timestamp*

##### Budjetit – ```budgets```

Budjetti, jolla on omistajan käyttäjätili, rahamäärä, jonka saavuttamista sovellus tarkkailee, ja alku- ja loppupäivä tai toistumisväli. Budjetilla on lisäksi valinnainen nimi.

Vain joko kentät ```start_date``` ja ```end_date``` tai kenttä ```repeating``` täytetään. Jompi kumpi on pakko täyttää, mutta tietokanta ei kuitenkaan estä laittamasta molemmille arvoa tai jättämästä molempia tyhjäksi.

Budjettiin liittyvät myös taulut [```budgets_accounts```](#budjettien-tilit--budgets_accounts), [```budgets_categories```](#budjettien-kategoriat--budgets_categories), [```budgets_income_transactions```](#budjettien-tulot--budgets_income_transactions) ja , [```budgets_expense_transactions```](#budjettien-menot--budgets_expense_transactions).

- **id**
  - *int8*
  - Pääavain
- user_id
  - *uuid*
  - Viiteavain [```auth.users```](#käyttäjätilit---authusers)-tauluun
  - Pakollinen
- start_date
  - *date*
- end_date
  - *date*
- created_at
  - *timestamp*
  - Automaattinen arvo: ```now()```
- budget_name
  - *text*
- amount
  - *numeric*
  - Pakollinen
- repeating
  - *text*

##### Budjettien tilit – ```budgets_accounts```

Budjetin tarkkailemat pankkitilit, eli tilit joiden tapahtumat lasketaan mukaan budjetin kuluihin ja tuloihin. Näihin tapahtumiin vaikuttavat myös [budjettien kategoriat](#budjettien-kategoriat--budgets_categories).

- **account_id**
  - *int8*
  - Pääavain
  - Viiteavain [```accounts```](#tilit--accounts)-tauluun
- **budget_id**
  - *int8*
  - Pääavain
  - Viiteavain [```budgets```](#budjetit--budgets)-tauluun

##### Budjettien kategoriat – ```budgets_categories```

Budjetin tarkkailemat kategoriat, eli kategoriat joiden tapahtumat lasketaan mukaan budjetin kuluihin ja tuloihin. Näihin tapahtumiin vaikuttavat myös [budjettien tilit](#budjettien-tilit--budgets_accounts).

- **budget_id**
  - *int8*
  - Pääavain
  - Viiteavain [```budgets```](#budjetit--budgets)-tauluun
- **budget_category_id**
  - *int8*
  - Pääavain
  - Viiteavain [```categories```](#kategoriat--categories)-tauluun

##### Budjettien tulot – ```budgets_income_transactions```

Budjetin tuloihin vaikuttavat tapahtumat. Nämä voi saada suoraan tulojen taulusta, mutta ne tallennetaan tänne nopeampaa hakua varten. Tämän taulun sisältöä päivitetään budjetin päivitykseen liittyvillä funktioilla ja triggereillä.

- **income_transaction_id**
  - *int8*
  - Pääavain
  - Viiteavain [```income_transactions```](#tulot--income_transactions)-tauluun
- **budget_id**
  - *int8*
  - Pääavain
  - Viiteavain [```budgets```](#budjetit--budgets)-tauluun

##### Budjettien kulut – ```budgets_expense_transactions```

Budjetin kuluihin vaikuttavat tapahtumat. Nämä voi saada suoraan kulujen taulusta, mutta ne tallennetaan tänne nopeampaa hakua varten. Tämän taulun sisältöä päivitetään budjetin päivitykseen liittyvillä funktioilla ja triggereillä.

- **expense_transaction_id**
  - *int8*
  - Pääavain
  - Viiteavain [```expense_transactions```](#kulut--expense_transactions)-tauluun
- **budget_id**
  - *int8*
  - Pääavain
  - Viiteavain [```budgets```](#budjetit--budgets)-tauluun

##### Kategoriat – ```categories```

Pankkitapahtuman kategoria, jolla on tyyppi (kulu tai tulo), nimi ja omistajan käyttäjätili.

- **id**
  - *int8*
  - Pääavain
- created_at
  - *timestamp*
  - Pakollinen
  - Automaattinen arvo: ```now()```
- category_name
  - *text*
  - Pakollinen
- user_id
  - *uuid*
  - Viiteavain [```auth.users```](#käyttäjätilit---authusers)-tauluun
  - Pakollinen
- category_type
  - *numeric*
  - Pakollinen
  - 0 = kulujen kategoria, 1 = tulojen kategoria

##### Kulut – ```expense_transactions```

Kululla on päivämäärä, rahamäärä, kategoria ja tili, jolta kulu on maksettu. Lisäksi valinnaisia kenttiä ovat kulun viitenumero, saaja (josta käytetään sovelluksessa myös nimeä "Nimi") ja kulun tekstikuvaus.

Kulun omistava käyttäjätili määritetään esimerkiksi hakemalla tili taulusta [```accounts```](#tilit--accounts).

- **id**
  - *int8*
  - Pääavain
- date
  - *date*
  - Pakollinen
- reference-number
  - *numeric*
- description
  - *text*
- amount
  - *numeric*
  - Pakollinen
- account_to
  - *text*
- account_from
  - *int8*
  - Viiteavain [```accounts```](#tilit--accounts)-tauluun
  - Pakollinen
- category
  - *int8*
  - Viiteavain [```categories```](#kategoriat--categories)-tauluun
  - Pakollinen

##### Tulot – ```income_transactions```

Tulolla on päivämäärä, rahamäärä, kategoria ja tili, jolle tulo on maksettu. Lisäksi valinnaisia kenttiä ovat tulon viitenumero, maksaja (josta käytetään sovelluksessa myös nimeä "Nimi") ja tulon tekstikuvaus.

Tulon omistava käyttäjätili määritetään esimerkiksi hakemalla tili taulusta [```accounts```](#tilit--accounts).

- **id**
  - *int8*
  - Pääavain
- date
  - *date*
  - Pakollinen
- reference-number
  - *numeric*
- description
  - *text*
- amount
  - *numeric*
  - Pakollinen
- account_from
  - *text*
- account_to
  - *int8*
  - Viiteavain [```accounts```](#tilit--accounts)-tauluun
  - Pakollinen
- category
  - *int8*
  - Viiteavain [```categories```](#kategoriat--categories)-tauluun
  - Pakollinen

#### Funktiot ja triggerit

