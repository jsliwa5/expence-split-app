# Polityka Prywatności aplikacji mobilnej "Splits"

**Ostatnia aktualizacja:** Czerwiec 2026

Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych użytkowników korzystających z aplikacji mobilnej "Splits" (zwanej dalej "Aplikacją").

## 1. Administrator Danych
Aplikacja ma charakter wyłącznie edukacyjny i akademicki.

## 2. Zbierane Dane i Cel Przetwarzania
Aplikacja przetwarza jedynie dane niezbędne do realizacji jej funkcji biznesowych (podział wydatków grupowych):
* **Dane rejestracyjne:** Adres e-mail oraz zahashowane hasło (wykorzystywane wyłącznie do uwierzytelniania użytkownika w systemie za pomocą tokenów JWT).
* **Dane operacyjne:** Nazwy grup, kwoty wydatków oraz identyfikatory transakcji potrzebne do obliczania bilansów.

## 3. Uprawnienia Systemowe (Natywne funkcje smartfona)
W celu poprawnego działania funkcji natywnych, Aplikacja prosi użytkownika o dostęp do:
* **Aparatu fotograficznego (Camera API):** Wykorzystywany wyłącznie w celu wykonania zdjęcia paragonu i załączenia go do szczegółów wydatku. Zdjęcia są przechowywane na bezpiecznym serwerze produkcyjnym.
* **Powiadomień systemowych (Push Notifications):** Wykorzystywane do wysyłania komunikatów o nowych wydatkach lub zmianach bilansu dłużników.

## 4. Bezpieczeństwo Danych
Wszystkie połączenia z API backendu są szyfrowane za pomocą protokołu HTTPS. Hasła użytkowników są bezpiecznie hashowane przed zapisem w bazie danych, a tokeny autoryzacyjne na urządzeniu mobilnym są przechowywane w bezpiecznej pamięci systemowej (Secure Store). Dane nie są udostępniane firmom trzecim ani wykorzystywane w celach marketingowych.

## 5. Kontakt
W sprawach związanych z działaniem aplikacji oraz prywatnością danych, użytkownicy mogą kontaktować się poprzez oficjalne repozytorium projektu na platformie GitHub.
