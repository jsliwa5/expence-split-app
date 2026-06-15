# User Stories – Aplikacja „Splits"

Poniżej znajduje się lista 20 user stories pokrywających pełny zakres funkcjonalności aplikacji mobilnej **Splits** (podział wydatków grupowych). Każda historia zawiera: identyfikator, opis w formacie standardowym, kryteria akceptacji oraz przypisanie do sprintu.

---

## Sprint 1 — MVP (Rejestracja, Logowanie, Grupy, Wydatki podstawowe)

---

### US-01 · Rejestracja nowego konta

> **Jako** nowy użytkownik,
> **chcę** utworzyć konto podając adres e-mail i hasło,
> **aby** uzyskać dostęp do funkcji dzielenia wydatków.

**Kryteria akceptacji:**
- Formularz rejestracji waliduje poprawność formatu e-mail.
- Hasło musi spełniać minimalne wymagania bezpieczeństwa (min. 6 znaków).
- System nie pozwala na rejestrację z już istniejącym adresem e-mail.
- Po pomyślnej rejestracji hasło jest hashowane przed zapisem w bazie danych.
- Użytkownik zostaje przekierowany na ekran logowania z komunikatem o sukcesie.

---

### US-02 · Logowanie do aplikacji

> **Jako** zarejestrowany użytkownik,
> **chcę** zalogować się podając e-mail i hasło,
> **aby** uzyskać dostęp do swoich grup i wydatków.

**Kryteria akceptacji:**
- Po podaniu poprawnych danych system generuje token JWT i zapisuje go w bezpiecznej pamięci urządzenia (Secure Store).
- Błędne dane logowania skutkują wyświetleniem czytelnego komunikatu o błędzie.
- Po zalogowaniu użytkownik trafia na ekran główny (Dashboard).
- Sesja użytkownika jest podtrzymywana między uruchomieniami aplikacji (token jest persystentny).

---

### US-03 · Wylogowanie z aplikacji

> **Jako** zalogowany użytkownik,
> **chcę** móc się wylogować,
> **aby** zabezpieczyć swoje dane przed nieautoryzowanym dostępem.

**Kryteria akceptacji:**
- Po wylogowaniu token JWT zostaje usunięty z pamięci urządzenia.
- Użytkownik zostaje przekierowany na ekran logowania.
- Próba powrotu do ekranów aplikacji bez ponownego logowania jest blokowana.

---

### US-04 · Tworzenie nowej grupy rozliczeniowej

> **Jako** zalogowany użytkownik,
> **chcę** utworzyć nową grupę rozliczeniową z wybraną nazwą,
> **aby** organizować wspólne wydatki z konkretnymi osobami (np. z wyjazdu, ze współlokatorami).

**Kryteria akceptacji:**
- Użytkownik podaje nazwę grupy w formularzu i zatwierdza.
- System tworzy grupę i generuje unikalny 6-cyfrowy kod dostępu.
- Nowa grupa pojawia się na liście grup na ekranie głównym (Dashboard).
- Twórca grupy jest automatycznie dodawany jako jej członek.

---

### US-05 · Dołączanie do istniejącej grupy za pomocą kodu

> **Jako** zalogowany użytkownik,
> **chcę** dołączyć do istniejącej grupy wpisując unikalny kod,
> **aby** współdzielić wydatki ze znajomymi, którzy już utworzyli grupę.

**Kryteria akceptacji:**
- Formularz pozwala wpisać 6-cyfrowy kod grupy.
- Po wpisaniu poprawnego kodu użytkownik zostaje dodany do grupy.
- Wpisanie nieprawidłowego kodu skutkuje czytelnym komunikatem o błędzie.
- Nowo dodany członek widzi pełną historię wydatków grupy.

---

### US-06 · Przeglądanie listy swoich grup

> **Jako** zalogowany użytkownik,
> **chcę** widzieć na ekranie głównym listę wszystkich grup, do których należę,
> **aby** szybko przejść do wybranej grupy rozliczeniowej.

**Kryteria akceptacji:**
- Dashboard wyświetla karty z nazwami grup.
- Każda karta zawiera nazwę grupy i liczbę członków.
- Kliknięcie karty przenosi do ekranu szczegółów grupy.
- Jeśli użytkownik nie ma żadnych grup, wyświetlany jest odpowiedni komunikat zachęcający do utworzenia lub dołączenia.

---

### US-07 · Dodawanie wydatku z równym podziałem

> **Jako** członek grupy,
> **chcę** dodać nowy wydatek (tytuł, kwota) i podzielić go równo na wszystkich członków grupy,
> **aby** automatycznie obliczyć, ile każdy jest winien.

**Kryteria akceptacji:**
- Formularz wymaga podania tytułu i kwoty wydatku.
- Kwota jest dzielona równo między wszystkich członków grupy.
- System poprawnie obsługuje zaokrąglenia groszowe (np. 100 zł / 3 osoby).
- Wydatek pojawia się na liście transakcji grupy z datą, tytułem i kwotą.
- Płatnik jest oznaczony jako osoba, która poniosła koszt.

---

### US-08 · Przeglądanie historii wydatków grupy

> **Jako** członek grupy,
> **chcę** przeglądać chronologiczną listę wszystkich wydatków w grupie,
> **aby** mieć wgląd w pełną historię wspólnych kosztów.

**Kryteria akceptacji:**
- Lista wydatków wyświetla: tytuł, kwotę, datę i osobę płacącą.
- Wydatki są posortowane od najnowszego do najstarszego.
- Kliknięcie wydatku otwiera jego szczegóły (w tym ewentualne zdjęcie paragonu).

---

### US-09 · Podgląd bilansów (kto komu ile jest winien)

> **Jako** członek grupy,
> **chcę** widzieć aktualne bilanse rozliczeniowe,
> **aby** dokładnie wiedzieć, ile pieniędzy jestem winien lub ile mi się należy.

**Kryteria akceptacji:**
- Zakładka „Bilanse" wyświetla uproszczoną listę długów (np. „Anna → Marek: 45,33 PLN").
- Algorytm minimalizuje liczbę przelewów potrzebnych do wyrównania długów.
- Bilanse aktualizują się automatycznie po dodaniu nowego wydatku.
- Kwoty uwzględniają groszowe zaokrąglenia.

---

### US-10 · Usuwanie wydatku

> **Jako** członek grupy, który dodał wydatek,
> **chcę** mieć możliwość usunięcia błędnie dodanego wydatku,
> **aby** bilanse grupy odzwierciedlały rzeczywisty stan rozliczeń.

**Kryteria akceptacji:**
- Opcja usunięcia jest dostępna w szczegółach wydatku.
- Po usunięciu bilanse grupy zostają automatycznie przeliczone.
- System prosi o potwierdzenie przed usunięciem (zapobieganie przypadkowemu usunięciu).

---

### US-11 · Edycja istniejącego wydatku

> **Jako** członek grupy, który dodał wydatek,
> **chcę** móc edytować jego tytuł, kwotę lub sposób podziału,
> **aby** poprawić ewentualne pomyłki bez konieczności usuwania i ponownego tworzenia.

**Kryteria akceptacji:**
- Formularz edycji jest wstępnie wypełniony aktualnymi danymi wydatku.
- Po zapisie zmian bilanse grupy zostają automatycznie przeliczone.
- Zmieniony wydatek zachowuje swoją pierwotną datę dodania.

---

## Sprint 2 — Funkcje rozszerzone (Natywne API, UX, Powiadomienia)

---

### US-12 · Skanowanie paragonu aparatem

> **Jako** członek grupy dodający wydatek,
> **chcę** zrobić zdjęcie paragonu za pomocą aparatu w telefonie,
> **aby** dołączyć wizualny dowód zakupu do wydatku.

**Kryteria akceptacji:**
- Przycisk „Zrób zdjęcie" otwiera natywny interfejs aparatu (Camera API).
- Aplikacja prosi o uprawnienie do kamery przy pierwszym użyciu.
- Zdjęcie jest automatycznie przesyłane i zapisywane w chmurze.
- Miniaturka zdjęcia jest widoczna na liście transakcji i w szczegółach wydatku.

---

### US-13 · Niestandardowy podział wydatku (kwotowy)

> **Jako** członek grupy,
> **chcę** ręcznie określić, ile dokładnie każda osoba powinna zapłacić za dany wydatek,
> **aby** uwzględnić sytuacje, gdy nie wszyscy zamawiali to samo (np. w restauracji).

**Kryteria akceptacji:**
- Formularz dodawania wydatku oferuje opcję „Podział niestandardowy".
- Użytkownik przypisuje kwotę do każdego członka grupy ręcznie.
- Suma kwot niestandardowych musi być równa łącznej kwocie wydatku (walidacja).
- Bilanse są aktualizowane na podstawie niestandardowego podziału.

---

### US-14 · Niestandardowy podział wydatku (procentowy)

> **Jako** członek grupy,
> **chcę** podzielić wydatek procentowo między wybranych członków,
> **aby** elastycznie rozdzielić koszty (np. 60/40 między dwie osoby).

**Kryteria akceptacji:**
- Formularz pozwala przypisać procent udziału każdemu członkowi.
- Suma procentów musi wynosić dokładnie 100% (walidacja).
- System oblicza kwoty na podstawie procentów i poprawnie obsługuje zaokrąglenia.

---

### US-15 · Kopiowanie kodu grupy do schowka

> **Jako** twórca lub członek grupy,
> **chcę** jednym kliknięciem skopiować kod grupy do schowka systemowego,
> **aby** łatwo przesłać go znajomym przez komunikator (np. Messenger, WhatsApp).

**Kryteria akceptacji:**
- Ikona „Kopiuj" jest widoczna obok kodu grupy na ekranie szczegółów.
- Po kliknięciu kod trafia do schowka systemowego telefonu.
- Wyświetla się krótki toast/snackbar z potwierdzeniem „Kod skopiowany!".
- Skopiowany kod można wkleić w dowolnej aplikacji.

---

### US-16 · Otrzymywanie powiadomień push o nowych wydatkach

> **Jako** członek grupy,
> **chcę** otrzymywać powiadomienia push na ekranie blokady telefonu, gdy ktoś doda nowy wydatek do mojej grupy,
> **aby** być na bieżąco z nowymi zobowiązaniami finansowymi bez otwierania aplikacji.

**Kryteria akceptacji:**
- Powiadomienie pojawia się na ekranie blokady i w centrum powiadomień Androida.
- Powiadomienie zawiera informację: kto zapłacił, ile i w jakiej grupie.
- Kliknięcie powiadomienia otwiera aplikację na ekranie danej grupy.
- Użytkownik może wyrazić lub cofnąć zgodę na powiadomienia (uprawnienia systemu).

---

### US-17 · Obsługa trybu offline (brak internetu)

> **Jako** użytkownik w miejscu bez zasięgu,
> **chcę**, aby aplikacja wyświetlała zrozumiały komunikat o braku połączenia zamiast się zawieszać,
> **aby** wiedzieć, że operacja nie powiodła się z powodu sieci, i spróbować ponownie później.

**Kryteria akceptacji:**
- Przy braku połączenia z serwerem aplikacja wyświetla komunikat: „Brak połączenia z siecią. Spróbuj ponownie później."
- Aplikacja nie ulega awarii ani nie zamraża się.
- Już załadowane dane (listy grup, wydatki) pozostają widoczne w trybie tylko do odczytu.

---

### US-18 · Ciemny motyw (Dark Mode)

> **Jako** użytkownik aplikacji,
> **chcę** korzystać z aplikacji w ciemnym motywie graficznym,
> **aby** zmniejszyć zmęczenie oczu przy korzystaniu wieczorem i oszczędzić baterię na ekranach OLED.

**Kryteria akceptacji:**
- Cała aplikacja jest utrzymana w spójnym ciemnym motywie (paleta Slate `#0F172A`).
- Tekst i elementy interaktywne mają odpowiedni kontrast zgodny ze standardami dostępności.
- Motyw jest stosowany globalnie — żadna strona nie wyświetla się w jasnym trybie.

---

### US-19 · Walidacja formularzy i obsługa błędów

> **Jako** użytkownik wypełniający formularz (rejestracja, logowanie, dodawanie wydatku),
> **chcę** widzieć czytelne komunikaty o błędach walidacji przy nieprawidłowo wypełnionych polach,
> **aby** szybko naprawić błędy i dokończyć operację.

**Kryteria akceptacji:**
- Puste pola wymagane są oznaczane komunikatem o konieczności uzupełnienia.
- Nieprawidłowy format e-mail jest sygnalizowany (np. „Podaj poprawny adres e-mail").
- Kwota wydatku musi być liczbą większą od 0.
- Komunikaty błędów są wyświetlane bezpośrednio przy danym polu formularza.

---

### US-20 · Rejestracja tokena FCM do powiadomień push

> **Jako** zalogowany użytkownik,
> **chcę**, aby aplikacja automatycznie rejestrowała mój token urządzenia (FCM) na serwerze,
> **aby** backend mógł wysyłać mi spersonalizowane powiadomienia push o nowych wydatkach.

**Kryteria akceptacji:**
- Po zalogowaniu aplikacja pobiera token FCM z Firebase Cloud Messaging.
- Token jest wysyłany do backendu i zapisywany w bazie przy profilu użytkownika.
- Przy zmianie tokena (np. reinstalacja) nowy token jest automatycznie aktualizowany.
- Backend używa zapisanego tokena do adresowania powiadomień push.

---

## Podsumowanie

| Sprint | User Stories | Zakres |
|:---|:---|:---|
| **Sprint 1 (MVP)** | US-01 – US-11 | Rejestracja, logowanie, wylogowanie, CRUD grup, CRUD wydatków, bilanse |
| **Sprint 2 (Rozszerzenia)** | US-12 – US-20 | Skaner paragonów, podział niestandardowy, powiadomienia push, Dark Mode, obsługa offline, walidacja |

> **Łącznie: 20 User Stories** pokrywających pełny cykl życia aplikacji — od pierwszego uruchomienia, przez codzienne użytkowanie, po zaawansowane funkcje natywne smartfona.
