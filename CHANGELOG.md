# Changelog – Historia zmian projektu "Splits"

Wszystkie istotne zmiany i kamienie milowe w rozwoju aplikacji mobilnej Splits.

## [2.0.0] - Sprint 2 (Core Features & Native APIs) - 2026-06-15
### Dodano
* **Funkcja Natywna 1:** Integracja z Camera API – moduł robienia zdjęć paragonów i zapisywania ich w chmurze (`salsa`).
* **Funkcja Natywna 2:** System powiadomień push powiadamiający dłużników o zaległościach finansowych (`jsliwa5`, `salsa`).
* Niestandardowy podział wydatków w formularzu (kwotowy/procentowy) (`salsa`).
* Funkcja kopiowania unikalnego kodu grupy do schowka systemowego (`salsa`).
* Obsługa stanów awaryjnych aplikacji (tryb offline, brak internetu, błędy walidacji) (`salsa`).
* **Design System:** Implementacja globalnego motywu Dark Mode i ujednolicenie UI (`konfederakf`, `salsa`).

### Zmieniono / Poprawiono
* Wdrożenie produkcyjne bazy danych oraz backendu API na platformę chmurową z użyciem Docker-compose (`jsliwa5`).
* Optymalizacja algorytmu wyliczania bilansów końcowych w grupach (`jsliwa5`).

---

## [1.0.0] - Sprint 1 (MVP - Minimum Viable Product) - 2026-05-31
### Dodano
* Architektura bazy danych i podstawowe modele relacyjne dla użytkowników, grup i wydatków (`jsliwa5`).
* System rejestracji i logowania użytkowników z autoryzacją opartą o tokeny JWT (`jsliwa5`).
* Endpointy API dla operacji CRUD na grupach i podstawowych wydatkach (`jsliwa5`).
* **Projekt UX/UI:** Przygotowanie pełnej dokumentacji wymagań, User Stories oraz makiet interfejsu w Figmie (`konfederakf`).
* Szkielet aplikacji mobilnej w React Native / Expo (`salsa`).
* Integracja frontendu z API backendu w zakresie logowania i tworzenia grup (`salsa`).
