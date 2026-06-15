# Checklista Testów Akceptacyjnych (Manual QA)

Poniższa tabela przedstawia scenariusze testowe wykonane przed finalnym wydaniem aplikacji w celu weryfikacji kryteriów akceptacji (Acceptance Criteria) zdefiniowanych w zadaniach (Issues).

| ID | Scenariusz testowy | Kroki testowe | Oczekiwany rezultat | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TA-01** | Poprawna rejestracja nowego konta | 1. Wybierz opcję "Zarejestruj się".<br>2. Wpisz unikalny e-mail i silne hasło.<br>3. Kliknij "Utwórz konto". | System tworzy konto w bazie danych, hasło jest hashowane, a użytkownik zostaje przekierowany do ekranu logowania. | **PASS** |
| **TA-02** | Logowanie i zapis sesji | 1. Wpisz poprawne dane konta z testu TA-01.<br>2. Kliknij "Zaloguj". | Użytkownik zostaje wpuszczony do aplikacji. Token JWT zostaje zapisany w bezpiecznej pamięci urządzenia (Secure Store). | **PASS** |
| **TA-03** | Tworzenie nowej grupy | 1. Kliknij ikonę "+" na ekranie głównym.<br>2. Wpisz nazwę grupy (np. "Góry 2026").<br>3. Zatwierdź. | Grupa pojawia się na liście, a system generuje unikalny 6-cyfrowy kod dostępu. | **PASS** |
| **TA-04** | Kopiowanie kodu grupy do schowka | 1. Wejdź w nowo utworzoną grupę.<br>2. Kliknij ikonę "Kopiuj" obok kodu grupy. | System wyświetla komunikat o sukcesie. Kod znajduje się w schowku systemowym telefonu i można go wkleić np. w Messengerze. | **PASS** |
| **TA-05** | Dodawanie wydatku z aparatem (Równo) | 1. Kliknij "Dodaj wydatek".<br>2. Wpisz kwotę 120 PLN, tytuł "Obiad".<br>3. Kliknij "Zrób zdjęcie", nadaj uprawnienia i wykonaj zdjęcie paragonu.<br>4. Wybierz opcję "Podziel po równo". | Wydatek zapisuje się w bazie. Miniaturka zdjęcia jest widoczna na liście transakcji grupy. Kwota została podzielona po równo na członków grupy. | **PASS** |
| **TA-06** | Weryfikacja bilansu dłużników | 1. Przejdź do zakładki "Bilanse" wewnątrz grupy z testu TA-05. | System poprawnie rozlicza groszowe zaokrąglenia i wyświetla informację, ile dokładnie pozostali członkowie grupy są winni płatnikowi. | **PASS** |
