# Splits – System Zarządzania Wydatkami Grupowymi

Aplikacja mobilna stworzona w ramach projektu akademickiego, służąca do sprawiedliwego i automatycznego rozliczania wspólnych wydatków grupowych (np. podczas wyjazdów, wspólnego mieszkania czy wyjść do restauracji). 

Aplikacja automatycznie przelicza bilanse, obsługuje zaokrąglenia groszowe, a dzięki wykorzystaniu funkcji natywnych pozwala na dołączanie zdjęć paragonów oraz wysyła powiadomienia Push do dłużników.

---

## Główne Funkcje (MVP + Rozszerzenia Natywne)

### Minimum Viable Product (Core)
* **Autoryzacja (Auth):** Bezpieczna rejestracja i logowanie użytkowników oparte o tokeny JWT.
* **Zarządzanie grupami:** Tworzenie grup rozliczeniowych i generowanie unikalnych kodów dostępu dla znajomych.
* **Podział podstawowy:** Dodawanie wydatków kwotowych i automatyczny, równy podział kosztów na wszystkich członków.

### Funkcje Natywne Smartfona (Rozszerzenia)
1. **Skaner paragonów (Aparat & Galeria):** Wykorzystanie natywnego Camera API (poprzez Expo Image Picker) do robienia zdjęć paragonów i przypisywania ich jako dowód zakupu (`receiptUrl`).
2. **Powiadomienia Push:** Integracja z Firebase Cloud Messaging (FCM). System automatycznie wysyła notyfikacje na ekran blokady smartfona w momencie dodania nowego wydatku lub przypomnienia o długu.

---

## Stos Technologiczny (Tech Stack)

### Frontend
* Język: TypeScript
* Framework: React Native + Expo (Expo Router)
* Komunikacja: Axios (REST API)

### Backend
* Język: Java
* Framework: Spring Boot (Spring Web, Spring Security)
* Baza danych: SQL (zarządzana przez migracje Flyway)
* Konteneryzacja: Docker & Docker Compose

---

## Struktura Projektu

```text
.
├── splits/               # Serwer backendowy (Java / Spring Boot)
│   ├── src/main/java/    # Kod źródłowy API (Controllers, Commands, Handlers)
│   ├── src/resources/    # Konfiguracja (application.yml) oraz migracje DB (db/migration)
│   ├── Dockerfile        # Instrukcja budowania kontenera backendu
│   └── pom.xml           # Zależności i konfiguracja Mavena
├── mobile/               # Aplikacja mobilna (React Native / Expo)
│   ├── app/              # Ekrany i routing aplikacji (Expo Router)
│   ├── src/              # Logika, API serwisy, konteksty i motyw graficzny
│   └── package.json      # Skrypty i zależności Node.js
├── CHANGELOG.md          # Pełna historia zmian i wydań w projekcie
├── TESTS.md              # Dokumentacja przeprowadzonych testów integracyjnych
├── PRIVACY_POLICY.md     # Polityka prywatności wymagana przez Google Play
└── PLAY_STORE.md         # Specyfikacja publikacji i materiały graficzne
```
# Instrukcja uruchomienia i wdrożenia systemu Splits
---

## Wymagania wstępne

Przed rozpoczęciem procedury instalacyjnej należy upewnić się, że w systemie operacyjnym zainstalowane są następujące narzędzia:
* Node.js (wersja v18 lub nowsza) oraz menedżer pakietów npm
* Java OpenJDK 17
* Docker oraz Docker Compose
* Klient systemu kontroli wersji Git

---

## 1. Konfiguracja i uruchomienie serwera backendowego

Moduł serwerowy znajduje się w podkatalogu `splits`. Odpowiada za implementację logiki biznesowej, autoryzację użytkowników (JWT), obsługę powiadomień oraz ewolucję schematu relacyjnej bazy danych za pomocą Flyway.

### Krok 1: Uruchomienie bazy danych
Backend wykorzystuje relacyjną bazę danych SQL, uruchamianą w izolowanym kontenerze Docker.
1. Otwórz terminal systemowy i przejdź do głównego katalogu backendu:
   ```bash
   cd splits
   ```
2. Uruchom kontener z bazą danych w tle za pomocą polecenia:
   ```bash
   docker-compose up -d
   ```

*Uwaga: Podczas startu bazy danych mechanizm Flyway automatycznie wykona skrypty migracyjne z katalogu `src/main/resources/db/migration` w kolejności chronologicznej:*
* `V1__init_schema.sql` (Inicjalizacja schematu bazy danych)
* `V2__create_expenses.sql` (Utworzenie struktur dla wydatków)
* `V3__add_fcm_token_to_users.sql` (Dodanie obsługi tokenów powiadomień FCM)
* `V4__add_phone_number_to_users.sql` (Rozszerzenie profilu użytkownika o numer telefonu)
* `V5__add_receipt_url_to_expenses.sql` (Dodanie kolumny na adres URL zdjęcia paragonu)

### Krok 2: Uruchomienie aplikacji Spring Boot
1. W tym samym katalogu (`splits`) wykonaj skrypt buildera Maven w celu pobrania zależności i startu serwera:
   ```bash
   ./mvnw spring-boot:run
   ```
2. Po pomyślnej kompilacji serwer rozpocznie nasłuchiwanie zapytań HTTP na domyślnym porcie `8080`.
3. Interaktywna dokumentacja API oraz interfejs testowy Swagger UI są dostępne lokalnie pod adresem:
   `http://localhost:8080/swagger-ui.html`

---

## 2. Konfiguracja i uruchomienie aplikacji mobilnej

Moduł kliencki znajduje się w katalogu `mobile` i bazuje na architekturze routera plikowego dostarczanego przez Expo Router.

### Krok 1: Instalacja zależności Node.js
1. Otwórz nowy terminal i przejdź do katalogu projektu mobilnego:
   ```bash
   cd mobile
   ```
2. Zainstaluj wymagane pakiety i zależności zdefiniowane w pliku konfiguracyjnym:
   ```bash
   npm install
   ```

### Krok 2: Konfiguracja zmiennych środowiskowych
Aplikacja mobilna wymaga wskazania adresu sieciowego serwera API do poprawnej komunikacji z backendem za pomocą biblioteki Axios.
1. W katalogu głównym folderu `mobile` utwórz nowy plik tekstowy o nazwie `.env`.
2. Zdefiniuj adres URL backendu w poniższym formacie:
   ```text
   EXPO_PUBLIC_API_URL=http://localhost:8080
   ```
   *Wskazówka deweloperska: Jeżeli aplikacja będzie testowana na fizycznym telefonie podłączonym do tej samej sieci lokalnej Wi-Fi co komputer, wartość `localhost` należy zastąpić lokalnym adresem IP komputera (np. `http://192.168.1.5:8080`).*

### Krok 3: Uruchomienie serwera deweloperskiego Expo
1. Wystartuj proces Expo CLI przy pomocy komendy:
   ```bash
   npx expo start
   ```
2. Po zakończeniu indeksowania pakietów, w oknie terminala zostanie wyświetlony interaktywny panel kontrolny oraz kod QR.

### Krok 4: Weryfikacja i testy na urządzeniach
* **Fizyczny smartfon (Android / iOS):** Zainstaluj bezpłatną aplikację narzędziową Expo Go ze sklepu Google Play lub App Store. Zeskanuj kod QR wyświetlony w terminalu za pomocą wbudowanego aparatu (iOS) lub bezpośrednio przez interfejs aplikacji Expo Go (Android).
* **Emulator urządzenia Android:** Upewnij się, że wirtualne urządzenie w programie Android Studio (AVD) jest poprawnie uruchomione, a następnie naciśnij klawisz `a` w terminalu z uruchomionym procesem Expo.

---

## 3. Architektura wdrożenia produkcyjnego (DevOps)

Repozytorium zawiera elementy konfiguracji przygotowane pod kątem automatyzacji potoków wdrożeniowych oraz konteneryzacji środowiska produkcyjnego:
* `Dockerfile`: Wielofazowa instrukcja budowania obrazu aplikacji (Multi-stage build), minimalizująca rozmiar finalnego kontenera poprzez usunięcie narzędzi deweloperskich i kodu źródłowego po zakończeniu procesu kompilacji kodu Java.
* `env.env`: Plik szablonu konfiguracyjnego służący do bezpiecznego wstrzykiwania zmiennych środowiskowych oraz kluczy uwierzytelniających (np. JWT secret, Firebase SDK Admin token) na platformach hostingowych typu Render.
