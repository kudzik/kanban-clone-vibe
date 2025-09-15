# Lovablade - Kanban Task Manager

Nowoczesny menedżer zadań w stylu Kanban zbudowany z React, TypeScript i PocketBase. Aplikacja oferuje intuicyjny interfejs do zarządzania projektami z funkcjonalnościami drag-and-drop, responsywnym designem i synchronizacją danych w czasie rzeczywistym.

## 🚀 Funkcjonalności

### ✨ Główne cechy

- **Zarządzanie kolumnami** - Tworzenie, edycja i usuwanie list zadań
- **Zarządzanie kartami** - Dodawanie, edycja i usuwanie zadań
- **Drag & Drop** - Intuicyjne przeciąganie kart między kolumnami
- **Responsywny design** - Działa na wszystkich urządzeniach
- **Synchronizacja danych** - Automatyczne zapisywanie w PocketBase
- **Testy E2E** - Kompleksowe testy z Playwright

### 🎨 UI/UX

- Nowoczesny, czysty design z TailwindCSS
- Płynne animacje i przejścia
- Wizualne wskaźniki podczas przeciągania
- Intuicyjny interfejs użytkownika
- Obsługa klawiatury i dostępności

## 🛠️ Technologie

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: PocketBase
- **Drag & Drop**: @dnd-kit
- **Testy**: Playwright
- **Linting**: ESLint + TypeScript

## 📦 Instalacja

### Wymagania

- Node.js 18+
- npm lub yarn
- PocketBase (lokalnie lub zdalnie)

### Kroki instalacji

1. **Sklonuj repozytorium**

```bash
git clone https://github.com/kudzik/kanban-clone-vibe.git
cd kanban-clone-vibe
```

2. **Zainstaluj zależności**

```bash
npm install
```

3. **Skonfiguruj PocketBase**

```bash
# Pobierz PocketBase (jeśli nie masz)
# Windows
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.22.12_windows_amd64.zip -o pocketbase.zip
unzip pocketbase.zip

# Uruchom PocketBase
./pocketbase.exe serve
```

4. **Uruchom aplikację**

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`

## 🧪 Testowanie

### Uruchomienie testów E2E

```bash
# Instalacja Playwright (jeśli nie zainstalowany)
npx playwright install

# Uruchomienie testów
npm run test:e2e

# Uruchomienie testów w trybie UI
npm run test:e2e:ui
```

### Rodzaje testów

- **CRUD Operations** - Testy operacji na kolumnach i kartach
- **Drag & Drop** - Testy przeciągania i upuszczania
- **Responsive** - Testy responsywności na różnych urządzeniach
- **Integration** - Testy integracji z PocketBase

## 📁 Struktura projektu

```
src/
├── components/          # Komponenty React
│   ├── Card.tsx        # Komponent karty zadania
│   ├── Column.tsx      # Komponent kolumny
│   └── KanbanBoard.tsx # Główny komponent tablicy
├── services/           # Serwisy i API
│   └── pocketbase.ts   # Konfiguracja PocketBase
└── assets/            # Zasoby statyczne

tests/
└── e2e/               # Testy end-to-end
    ├── crud.spec.ts
    ├── drag-and-drop.spec.ts
    ├── integration.spec.ts
    └── responsive.spec.ts
```

## 🔧 Konfiguracja

### PocketBase

Aplikacja wymaga działającego serwera PocketBase. Sprawdź plik `POCKETBASE_SETUP.md` dla szczegółowej konfiguracji.

### Zmienne środowiskowe

Utwórz plik `.env.local`:

```env
VITE_POCKETBASE_URL=http://localhost:8090
```

## 📚 Dokumentacja

- [Przewodnik użytkownika](USER_GUIDE.md) - Instrukcje użytkowania
- [Dokumentacja dewelopera](DEVELOPER.md) - Szczegóły techniczne
- [Konfiguracja PocketBase](POCKETBASE_SETUP.md) - Setup backendu
- [Testy E2E](tests/e2e/README.md) - Dokumentacja testów

## 🚀 Deployment

### Build produkcyjny

```bash
npm run build
```

### Deploy na Netlify

1. Połącz repozytorium z Netlify
2. Ustaw build command: `npm run build`
3. Ustaw publish directory: `dist`
4. Skonfiguruj zmienne środowiskowe

### Deploy na GitHub Pages

```bash
npm run build
npm run deploy
```

## 🤝 Współpraca

1. Fork repozytorium
2. Utwórz branch dla nowej funkcji (`git checkout -b feature/nowa-funkcja`)
3. Commit zmian (`git commit -m 'Dodaj nową funkcję'`)
4. Push do brancha (`git push origin feature/nowa-funkcja`)
5. Otwórz Pull Request

## 📝 Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz plik [LICENSE.md](LICENSE.md) dla szczegółów.

## 🎯 Roadmap

### Wersja 1.1

- [ ] Filtrowanie i wyszukiwanie kart
- [ ] Kategorie i tagi
- [ ] Eksport/import danych
- [ ] Notifications

### Wersja 1.2

- [ ] Współpraca w czasie rzeczywistym
- [ ] Komentarze na kartach
- [ ] Załączniki
- [ ] Timeline aktywności

### Wersja 2.0

- [ ] Wielu użytkowników
- [ ] Role i uprawnienia
- [ ] Integracje z zewnętrznymi narzędziami
- [ ] API REST

## 🐛 Zgłaszanie błędów

Jeśli znajdziesz błąd, utwórz issue z następującymi informacjami:

- Opis błędu
- Kroki do reprodukcji
- Oczekiwane vs rzeczywiste zachowanie
- Zrzut ekranu (jeśli dotyczy)
- Informacje o środowisku (OS, przeglądarka, wersja)

## 💡 Pomysły na rozwój

Masz pomysł na nową funkcję? Świetnie! Utwórz issue z tagiem `enhancement` i opisz swoją propozycję.

---

**Stworzone z ❤️ używając React, TypeScript i PocketBase**
