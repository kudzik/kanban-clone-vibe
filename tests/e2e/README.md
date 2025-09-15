# Testy E2E - Kanban Board

Ten katalog zawiera testy end-to-end (E2E) dla aplikacji Kanban Board, napisane przy użyciu Playwright.

## Struktura testów

- `crud.spec.ts` - Testy operacji CRUD (Create, Read, Update, Delete)
- `drag-and-drop.spec.ts` - Testy funkcjonalności przeciągania i upuszczania
- `responsive.spec.ts` - Testy responsywności na różnych urządzeniach
- `integration.spec.ts` - Testy integracji z PocketBase

## Uruchamianie testów

### Wszystkie testy

```bash
npm run test:e2e
```

### Testy z interfejsem użytkownika

```bash
npm run test:e2e:ui
```

### Testy w trybie headed (z widoczną przeglądarką)

```bash
npm run test:e2e:headed
```

### Testy na konkretnych urządzeniach

```bash
# Mobile
npm run test:e2e:mobile

# Tablet
npm run test:e2e:tablet

# Desktop
npm run test:e2e:desktop

# Wszystkie urządzenia
npm run test:e2e:all-devices
```

## Konfiguracja urządzeń

Testy są skonfigurowane dla następujących urządzeń i viewportów:

### Desktop

- **Chromium Desktop**: 1920x1080
- **Firefox Desktop**: 1920x1080
- **WebKit Desktop**: 1920x1080
- **Large Desktop**: 2560x1440

### Tablet

- **iPad Pro**: 1024x1366 (portrait)
- **iPad Pro Landscape**: 1366x1024 (landscape)

### Mobile

- **Pixel 5**: 393x851 (portrait)
- **iPhone 12**: 390x844 (portrait)
- **Pixel 5 Landscape**: 851x393 (landscape)
- **iPhone SE**: 375x667 (portrait)

## Funkcjonalności testowane

### CRUD Operations

- ✅ Dodawanie kolumn
- ✅ Edycja tytułów kolumn
- ✅ Usuwanie kolumn z potwierdzeniem
- ✅ Dodawanie kart
- ✅ Edycja tytułów kart
- ✅ Usuwanie kart z potwierdzeniem
- ✅ Anulowanie operacji

### Drag and Drop

- ✅ Przeciąganie kolumn (zmiana kolejności)
- ✅ Przeciąganie kart w kolumnie
- ✅ Przeciąganie kart między kolumnami
- ✅ Wizualne wskaźniki podczas przeciągania
- ✅ Drag overlay
- ✅ Responsywność drag and drop

### Responsywność

- ✅ Wyświetlanie na mobile (375x667)
- ✅ Wyświetlanie na tablet (768x1024)
- ✅ Wyświetlanie na desktop (1920x1080)
- ✅ Horizontal scrolling na mobile
- ✅ Adaptacja layoutów przycisków
- ✅ Truncation tekstu na małych ekranach
- ✅ Zachowanie funkcjonalności przy zmianie viewport

### Integracja z PocketBase

- ✅ Ładowanie danych z bazy
- ✅ Persystencja danych po odświeżeniu
- ✅ Obsługa błędów sieci
- ✅ Synchronizacja między kartami przeglądarki
- ✅ Operacje współbieżne
- ✅ Zachowanie integralności danych
- ✅ Obsługa dużych zbiorów danych

## Wymagania

- Node.js 18+
- PocketBase uruchomiony na localhost:8090
- Aplikacja React uruchomiona na localhost:5173

## Struktura raportów

Testy generują następujące raporty:

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/results.xml`

## Debugowanie

### Uruchomienie testów w trybie debug

```bash
npx playwright test --debug
```

### Sprawdzenie testów w trybie headed

```bash
npx playwright test --headed
```

### Generowanie trace dla analizy

```bash
npx playwright test --trace on
```

## Najlepsze praktyki

1. **Data-testid**: Używamy `data-testid` do identyfikacji elementów
2. **Wait for selectors**: Czekamy na załadowanie elementów przed interakcją
3. **Viewport testing**: Testujemy na różnych rozmiarach ekranów
4. **Error handling**: Sprawdzamy obsługę błędów i edge cases
5. **Performance**: Testujemy z dużymi zbiorami danych
6. **Cross-browser**: Testujemy na różnych przeglądarkach
