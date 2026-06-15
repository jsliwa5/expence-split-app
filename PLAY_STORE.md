# Materiały Wykonawcze Google Play & Specyfikacja Produktowa

**Autor:** `konfederakf` (Product Lead)

Niniejszy dokument zawiera komplet materiałów marketingowych, formalnych oraz specyfikację wydań przygotowaną pod kątem publikacji aplikacji "Splits" w sklepie Google Play Console.

---

## 1. Strategia Produktowa: MVP vs Funkcje Dodatkowe

Projekt został podzielony na fazę podstawową (Minimum Viable Product), pozwalającą na stabilne działanie rdzenia aplikacji, oraz fazę rozszerzoną, integrującą natywne sensory smartfona.

| Funkcja | Status w projekcie | Opis i realizacja |
| :--- | :--- | :--- |
| **Autoryzacja (Auth)** | **MVP (Sprint 1)** | Bezpieczna rejestracja i logowanie użytkowników za pomocą tokenów JWT. |
| **Zarządzanie grupami** | **MVP (Sprint 1)** | Tworzenie grup rozliczeniowych i generowanie unikalnych kodów dostępu. |
| **Podział podstawowy** | **MVP (Sprint 1)** | Dodawanie wydatków kwotowych i automatyczny, równy podział kosztów na członków grupy. |
| **Skaner paragonów** | **Rozszerzenie (Sprint 2)** | Funkcja natywna: Wykorzystanie Camera API do robienia zdjęć paragonów i zapisu w chmurze. |
| **Powiadomienia Push** | **Rozszerzenie (Sprint 2)** | Funkcja natywna: Automatyczne notyfikacje o nowych długach na ekranie blokady. |
| **Zaawansowane UI** | **Rozszerzenie (Sprint 2)** | Integracja motywu Dark Mode oraz obsługa trybu offline/błędów sieciowych. |

---

## 2. Dane Metadane do Google Play Console

### Tytuł aplikacji (App Title)
> **Splits – Łatwy Podział Wydatków**

### Krótki opis (Short Description)
> Łatwy podział wydatków ze znajomymi. Skanuj paragony i kontroluj wspólny budżet!

### Pełny opis (Full Description)
Masz dość ręcznego liczenia, kto komu jest dłużny po wspólnym wyjeździe, wyjściu do restauracji czy zakupach do wspólnego mieszkania? Poznaj **Splits** – nowoczesną aplikację mobilną, która zrobi to za Ciebie w kilka sekund!

Stwórz grupę, zaproś znajomych za pomocą szybkiego kodu i zapomnij o niezręcznych rozmowach o pieniądzach. Aplikacja oferuje automatyczny, sprawiedliwy podział kosztów (w tym precyzyjną obsługę groszowych zaokrągleń) oraz opcję niestandardowego podziału, jeśli ktoś zamówił droższe danie. 

Dzięki pełnej integracji z aparatem Twojego telefonu możesz błyskawicznie dołączyć zdjęcie paragonu jako dowód zakupu. System powiadomień Push natychmiast poinformuje dłużników o nowym rachunku, a zoptymalizowany algorytm bilansów (Balances) wskaże najprostszą drogę do wyrównania długów minimalną liczbą przelewów. 

Rozliczaj się sprytnie, bez stresu i skomplikowanych arkuszy kalkulacyjnych. Pobierz Splits i miej wspólne finanse pod kontrolą!

### Słowa kluczowe (Keywords / Tags)
`podział wydatków`, `wspólne rachunki`, `rozliczenia grupowe`, `kalkulator wydatków`, `skaner paragonów`, `budżet znajomi`, `kto ile wisie`, `finanse mobilne`, `manager wydatków`

---

## 3. Specyfikacja Materiałów Graficznych (Asset Delivery)

Przygotowano wytyczne dla zasobów graficznych zgodnie z wymaganiami technicznymi Google Play Store:

1. **Ikona aplikacji (App Icon):** Format PNG, 512x512 px, max 1MB. Projekt przedstawia minimalistyczny, fioletowy symbol podziału na ciemnym tle.
2. **Grafika promująca (Feature Graphic):** Format PNG, 1024x500 px. Baner reklamowy z logotypem aplikacji wykorzystujący kolory przewodnie Design Systemu (fiolet i głęboki grafit).
3. **Zrzuty ekranu (Screenshots):** Zestaw 4 zrzutów ekranu w rozdzielczości smartfona (portret, proporcje 16:9 / 19.5:9) prezentujący:
   * Ekran główny z listą aktywnych grup.
   * Widok szczegółów grupy z historią wydatków.
   * Formularz dodawania wydatku z widocznym podglądem zdjęcia z aparatu.
   * Ekran bilansów końcowych (kto komu oddaje pieniądze).
