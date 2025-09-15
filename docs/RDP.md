# Tablica Kanban – Dokument Wymagań Produktowych (PRD)

## Przegląd

Jednoplanszowy menedżer zadań w stylu Kanban z czystym, nowoczesnym interfejsem użytkownika i płynnymi interakcjami typu „przeciągnij i upuść”. Aplikacja zostanie zbudowana z wykorzystaniem **Vite**, **React**, **dnd-kit**, **Tailwind CSS** oraz **PocketBase** jako darmowego backendu z lokalną bazą danych i opcjonalnym hostingiem.

---

## Cele

- Umożliwić użytkownikom zarządzanie zadaniami na jednej tablicy Kanban bez logowania.
- Obsługa podstawowych operacji CRUD dla kolumn i kart.
- Zapewnienie płynnej i intuicyjnej funkcjonalności przeciągania i upuszczania.
- Przechowywanie danych lokalnie lub przez darmowy backend (PocketBase).
- Responsywny i przyjazny dla urządzeń mobilnych interfejs.

---

## Stos technologiczny

| Warstwa        | Technologia           | Uwagi |
|----------------|------------------------|-------|
| Frontend       | Vite + React + TypeScript | Szybki bundler, nowoczesny DX |
| Drag & Drop    | dnd-kit                | Modularny, lekki |
| Stylowanie     | Tailwind CSS           | Utility-first, szybki styling |
| Backend        | PocketBase             | Darmowy backend z REST API i lokalną bazą SQLite |
| Hosting        | Netlify / GitHub Pages | Darmowe opcje dla SPA |

---

## Funkcje

### 1. Kolumny

- Wyświetlanie wielu kolumn (domyślnie: „Do zrobienia”, „W trakcie”, „Zrobione”)
- Dodawanie nowych kolumn
- Zmiana nazwy kolumn
- Usuwanie kolumn (z potwierdzeniem)
- Zmiana kolejności kolumn poprzez przeciąganie

### 2. Karty

- Wyświetlanie kart zadań w kolumnach
- Dodawanie nowych kart do dowolnej kolumny
- Edycja tytułów kart bezpośrednio w miejscu
- Usuwanie kart
- Sortowanie kart w obrębie kolumny
- Przenoszenie kart między kolumnami

### 3. Drag & Drop

- Płynne i dostępne interakcje typu drag-and-drop
- Wizualne wskaźniki stanu przeciągania (np. cień, podświetlenie)

### 4. Przechowywanie danych

- Wszystkie dane (kolumny i karty) zapisywane lokalnie lub przez PocketBase
- Synchronizacja w czasie rzeczywistym **nie jest wymagana**

### 5. Design i UX

- Responsywny układ dla urządzeń mobilnych i komputerów
- Czysta, nowoczesna estetyka
- Płynne przejścia w interfejsie

---

## Zakres wykluczony

- Obsługa wielu tablic
- Konta użytkowników i logowanie
- Współpraca w czasie rzeczywistym
- Metadane kart (np. terminy, etykiety)

---

## Model danych (PocketBase)

### Kolekcja: columns

| Pole         | Typ        | Uwagi                     |
|--------------|------------|---------------------------|
| `id`         | string     | Generowane automatycznie |
| `title`      | string     | Nazwa kolumny             |
| `order`      | number     | Pozycja na tablicy        |
| `created`    | datetime   | Data utworzenia           |

### Kolekcja: cards

| Pole         | Typ        | Uwagi                             |
|--------------|------------|-----------------------------------|
| `id`         | string     | Generowane automatycznie          |
| `column`     | relation   | Relacja do `columns`              |
| `title`      | string     | Tytuł karty                       |
| `order`      | number     | Pozycja w kolumnie                |
| `created`    | datetime   | Data utworzenia                   |

---
