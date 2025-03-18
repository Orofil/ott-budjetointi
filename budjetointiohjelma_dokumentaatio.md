# Budjetointiohjelma 💸

*Ohjelmistotuotanto II - Ryhmä 5*

## Sovelluksen käyttö

### Asennus



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

### React-sovellus

Sivuston HTML-sisältö ```index.html``` kutsuu 

Sovelluksen suoritus aloitetaan ```src/main.jsx```-tiedostosta, joka luo sovelluksen rakenteen sisältävän App-komponentin tiedostosta ```src/App.jsx```. App.jsx tarkistaa käyttäjän kirjautumisen tilan ja palauttaa ```BrowserRouter```in sovelluksen eri sivujen välistä navigaatiota varten. Se sisältää myös ```HeaderNav```-elementin eli sovelluksen otsikko- ja navigaatiopalkin.

```src/actions``` sisältää sovelluksen yhteydet tietokantaan, eli funktiot, joiden avulla sovellus voi lukea tietoa tietokannasta ja tallentaa uutta tietoa sinne.

```src/assets``` sisältää sovelluksessa käytettävät grafiikat.

```src/components``` sisältää HTML-komponentit, jotka eivät ole kokonaisia sivuja, ja joita voidaan käyttää useaan kertaan eri sivuilla tai jopa samalla sivulla.

```src/config``` sisältää sovellukseen liittyvät asetukset ja tietokantasession.

```src/constants``` sisältää vakioarvoja, kuten tilitapahtumien erottelun kulujen ja tulojen välillä.

```src/pages``` sisältää sovelluksen eri sivut, joiden välillä käyttäjä voi navigoida App.jsx-tiedostossa määritellyn ```BrowserRouter```in avulla.

#### Toiminnot (actions)



#### Komponentit (components)



#### Sivut (pages)



### Tietokanta

Tietokantapalveluna toimii Supabase, joka käyttää PostgreSQL-tietokantaa.

#### Taulut

- accounts
  - **id**
    - int8
  - user_id
    - Viiteavain auth.users-tauluun
    - uuid
  - account_number
    - text
  - account_name
    - text
  - created_at
    - timestamp
- budgets
  - **id**
    - int8
  - user_id
    - Viiteavain auth.users-tauluun
    - uuid
  - start_date
    - date
  - end_date
    - date
  - created_at
    - timestamp
  - budget_name
    - text
  - amount
    - numeric
- budgets_accounts
  - **account_id**
    - Viiteavain accounts-tauluun
    - int8
  - **budget_id**
    - Viiteavain budgets-tauluun
    - int8
- budgets_categories
  - **budget_id**
    - Viiteavain budgets-tauluun
    - int8
  - **budget_category_id**
    - Viiteavain categories-tauluun
    - int8
  - amount
    - float8
- budgets_income_transactions
  - **income_transaction_id**
    - Viiteavain income_transactions-tauluun
    - int8
  - **budget_id**
    - Viiteavain budgets-tauluun
    - int8
- budgets_expense_transactions
  - **expense_transaction_id**
    - Viiteavain expense_transactions-tauluun
    - int8
  - **budget_id**
    - Viiteavain budgets-tauluun
    - int8
- categories
  - **id**
    - int8
  - created_at
    - timestamp
  - category_name
    - text
  - user_id
    - Viiteavain auth.users-tauluun
    - uuid
  - category_type
    - numeric
    - 0 = kulujen kategoria, 1 = tulojen kategoria
- expense_transactions
  - **id**
    - int8
  - date
    - date
  - reference-number
    - numeric
  - description
    - text
  - amount
    - numeric
  - account_to
    - text
  - account_from
    - int8
  - category
    - Viiteavain categories-tauluun
    - int8
- income_transactions
  - **id**
    - int8
  - date
    - date
  - reference-number
    - numeric
  - description
    - text
  - amount
    - numeric
  - account_from
    - text
  - account_to
    - int8
  - category
    - Viiteavain categories-tauluun
    - int8