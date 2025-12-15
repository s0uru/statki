# Bitwa Morska Online (Statki)

Projekt aplikacji internetowej realizujący klasyczną grę w statki (Battleship). Aplikacja została zbudowana w oparciu o nowoczesny framework Next.js oraz platformę Firebase, oferując pełną funkcjonalność kont użytkowników, rozgrywkę oraz rankingi.

## 🚀 Wersja Live

Aplikacja jest dostępna pod adresem:
👉 **(https://statlk.web.app)**

## 🛠 Technologie

Projekt wykorzystuje następujący stos technologiczny:

* **Framework:** Next.js  (App Router)
* **Język:** JavaScript / React 
* **Stylizacja:** Tailwind CSS 
* **Backend & Baza Danych:** Firebase (Authentication, Firestore)
* **Hosting:** Firebase Hosting

## ✨ Główne Funkcjonalności

* **Uwierzytelnianie:** Rejestracja, logowanie i wylogowywanie użytkowników (Firebase Auth).
* **Rozgrywka:** Interaktywna gra w statki (tryb Singleplayer przeciwko komputerowi).
* **Profil Użytkownika:** Możliwość edycji danych profilowych i avatara.
* **Ranking:** Globalna tablica wyników graczy zapisywana w Firestore.
* **Responsywność:** Interfejs dostosowany do urządzeń mobilnych i desktopowych.
* **Ochrona tras:** System chronionych ścieżek dostępnych tylko dla zalogowanych użytkowników.

## 📦 Uruchomienie Lokalne

Aby uruchomić projekt na własnym komputerze:

1.  **Sklonuj repozytorium:**
    ```bash
    git clone [https://github.com/twoj-nick/statki.git](https://github.com/twoj-nick/statki.git)
    cd statki
    ```

2.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```

3.  **Skonfiguruj Firebase:**
    Upewnij się, że posiadasz plik konfiguracyjny Firebase w `app/lib/firebase.js` ze swoimi kluczami API.

4.  **Uruchom serwer deweloperski:**
    ```bash
    npm run dev
    ```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## 👤 Autor

Projekt wykonany w ramach laboratorium programowania aplikacji internetowych.
