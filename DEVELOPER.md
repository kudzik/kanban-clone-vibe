# Dokumentacja Dewelopera - Lovablade

## 🏗️ Architektura aplikacji

### Struktura komponentów

```
KanbanBoard (główny kontener)
├── Column[] (lista kolumn)
│   ├── Card[] (lista kart w kolumnie)
│   └── AddCardButton
└── AddColumnButton
```

### Model danych

#### Column

```typescript
interface Column {
  id: string;
  title: string;
  order: number;
  created: string;
  updated: string;
}
```

#### Card

```typescript
interface Card {
  id: string;
  title: string;
  column: string; // ID kolumny
  order: number;
  created: string;
  updated: string;
}
```

## 🔧 Konfiguracja środowiska

### Wymagania systemowe

- Node.js 18+
- npm 9+ lub yarn 1.22+
- PocketBase 0.22+

### Setup deweloperski

1. **Klonowanie i instalacja**

```bash
git clone https://github.com/kudzik/kanban-clone-vibe.git
cd kanban-clone-vibe
npm install
```

2. **Konfiguracja PocketBase**

```bash
# Pobierz PocketBase
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.22.12_windows_amd64.zip -o pocketbase.zip
unzip pocketbase.zip

# Uruchom PocketBase
./pocketbase.exe serve --http=127.0.0.1:8090
```

3. **Konfiguracja bazy danych**

```bash
# Uruchom skrypt inicjalizacji
node init-default-data.js
```

4. **Uruchomienie aplikacji**

```bash
npm run dev
```

## 📁 Szczegółowa struktura projektu

```
src/
├── components/
│   ├── KanbanBoard.tsx     # Główny komponent zarządzający stanem
│   ├── Column.tsx          # Komponent kolumny z drag&drop
│   └── Card.tsx            # Komponent karty z edycją inline
├── services/
│   └── pocketbase.ts       # Konfiguracja i metody API
├── App.tsx                 # Główny komponent aplikacji
├── main.tsx               # Entry point
└── index.css              # Globalne style

tests/
└── e2e/
    ├── crud.spec.ts       # Testy operacji CRUD
    ├── drag-and-drop.spec.ts # Testy przeciągania
    ├── integration.spec.ts # Testy integracji
    ├── responsive.spec.ts  # Testy responsywności
    └── README.md          # Dokumentacja testów

pb_migrations/             # Migracje PocketBase
├── 1757942062_created_culumns.js
├── 1757942172_created_cards.js
└── ...

pb_data/                  # Dane PocketBase (ignorowane w git)
├── data.db
├── logs.db
└── storage/
```

## 🔌 API i serwisy

### PocketBase Service (`src/services/pocketbase.ts`)

```typescript
// Konfiguracja
const pb = new PocketBase('http://127.0.0.1:8090');

// Metody API
export const pocketbaseService = {
  // Kolumny
  getColumns: () => pb.collection('columns').getFullList(),
  createColumn: (data) => pb.collection('columns').create(data),
  updateColumn: (id, data) => pb.collection('columns').update(id, data),
  deleteColumn: (id) => pb.collection('columns').delete(id),
  
  // Karty
  getCards: () => pb.collection('cards').getFullList(),
  createCard: (data) => pb.collection('cards').create(data),
  updateCard: (id, data) => pb.collection('cards').update(id, data),
  deleteCard: (id) => pb.collection('cards').delete(id),
};
```

### Kolekcje PocketBase

#### Kolekcja `columns`

```javascript
{
  "id": "string",
  "title": "string (required)",
  "order": "number (required)",
  "created": "datetime",
  "updated": "datetime"
}
```

#### Kolekcja `cards`

```javascript
{
  "id": "string",
  "title": "string (required)",
  "column": "string (required, relation to columns)",
  "order": "number (required)",
  "created": "datetime",
  "updated": "datetime"
}
```

## 🎨 System stylowania

### TailwindCSS

Aplikacja używa TailwindCSS z niestandardową konfiguracją:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
}
```

### Klasy CSS

- **Kolumny**: `bg-gray-100`, `border-gray-300`, `rounded-lg`
- **Karty**: `bg-white`, `shadow-sm`, `hover:shadow-md`
- **Przyciski**: `bg-blue-500`, `hover:bg-blue-600`, `text-white`
- **Formularze**: `border-gray-300`, `focus:border-blue-500`, `focus:ring-blue-500`

## 🧪 Testowanie

### Struktura testów E2E

```typescript
// Przykład testu
test('should create new column', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Dodaj listę")');
  await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Test Column');
  await page.click('button:has-text("Dodaj listę")');
  await expect(page.locator('h2:has-text("Test Column")')).toBeVisible();
});
```

### Uruchamianie testów

```bash
# Wszystkie testy
npm run test:e2e

# Konkretny plik testowy
npx playwright test tests/e2e/crud.spec.ts

# Testy w trybie UI
npm run test:e2e:ui

# Testy w trybie debug
npx playwright test --debug
```

### Konfiguracja Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## 🔄 Drag & Drop

### Implementacja z @dnd-kit

```typescript
// KanbanBoard.tsx
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  
  if (over && active.id !== over.id) {
    // Logika aktualizacji kolejności
    updateOrder(active.id, over.id);
  }
};
```

### Obsługiwane operacje

- Przeciąganie kolumn (zmiana kolejności)
- Przeciąganie kart w obrębie kolumny
- Przeciąganie kart między kolumnami
- Wizualne wskaźniki podczas przeciągania

## 🚀 Build i deployment

### Build produkcyjny

```bash
npm run build
```

### Analiza bundle

```bash
npm run build -- --analyze
```

### Preview build

```bash
npm run preview
```

### Deploy na Netlify

1. Połącz repozytorium
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables:
   - `VITE_POCKETBASE_URL`: URL PocketBase

### Deploy na Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🐛 Debugging

### Narzędzia deweloperskie

- React Developer Tools
- PocketBase Admin UI (<http://localhost:8090/_/>)
- Browser DevTools
- Playwright Inspector

### Logi i monitoring

```typescript
// Przykład logowania
console.log('Column created:', newColumn);
console.error('API Error:', error);
```

### Typowe problemy

1. **PocketBase nie odpowiada**
   - Sprawdź czy serwer działa na porcie 8090
   - Sprawdź CORS settings w PocketBase

2. **Drag & Drop nie działa**
   - Sprawdź czy @dnd-kit jest poprawnie zainstalowany
   - Sprawdź konfigurację DndContext

3. **Testy E2E failują**
   - Upewnij się, że aplikacja działa na localhost:5173
   - Sprawdź czy PocketBase jest uruchomiony

## 📊 Performance

### Optymalizacje

- Lazy loading komponentów
- Memoization z React.memo
- Debounced API calls
- Virtual scrolling (dla dużych list)

### Metryki

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🔒 Bezpieczeństwo

### Best practices

- Walidacja danych po stronie klienta i serwera
- Sanityzacja inputów użytkownika
- HTTPS w produkcji
- CORS configuration w PocketBase

### Zmienne środowiskowe

```env
VITE_POCKETBASE_URL=http://localhost:8090
VITE_APP_ENV=development
```

## 📈 Monitoring i analytics

### Error tracking

```typescript
// Przykład error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Wysłanie do serwisu monitoringu
  }
}
```

### Performance monitoring

```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🤝 Contributing

### Workflow

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Run linting and tests
6. Create pull request

### Code style

- ESLint + Prettier
- TypeScript strict mode
- Conventional commits
- Jest/Playwright tests

### Pull request template

```markdown
## Opis zmian
- [ ] Dodano nową funkcjonalność
- [ ] Naprawiono błąd
- [ ] Zaktualizowano dokumentację

## Testy
- [ ] Testy jednostkowe
- [ ] Testy E2E
- [ ] Testy manualne

## Checklist
- [ ] Kod jest zgodny ze stylem
- [ ] Dokumentacja została zaktualizowana
- [ ] Testy przechodzą
```

---

**Dokumentacja aktualizowana na bieżąco z rozwojem projektu**
