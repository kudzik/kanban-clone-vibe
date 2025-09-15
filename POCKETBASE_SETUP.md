# Konfiguracja PocketBase

## Krok 1: Dostęp do panelu administracyjnego

1. Otwórz przeglądarkę i przejdź do: <http://localhost:8090/_/>
2. Utwórz konto administratora (pierwszy użytkownik)

## Krok 2: Utworzenie kolekcji "columns"

1. W panelu administracyjnym przejdź do "Collections"
2. Kliknij "New collection"
3. Ustaw nazwę: `columns`
4. Dodaj pola:
   - `title` (Text, Required, Max length: 100)
   - `order` (Number, Required, Min: 0)
5. Zapisz kolekcję

## Krok 3: Utworzenie kolekcji "cards"

1. Kliknij "New collection"
2. Ustaw nazwę: `cards`
3. Dodaj pola:
   - `title` (Text, Required, Max length: 200)
   - `column` (Relation, Required, Collection: columns, Cascade delete: true)
   - `order` (Number, Required, Min: 0)
4. Zapisz kolekcję

## Krok 4: Konfiguracja uprawnień

### Dla kolekcji "columns"

- List/Search: Public
- View: Public
- Create: Public
- Update: Public
- Delete: Public

### Dla kolekcji "cards"

- List/Search: Public
- View: Public
- Create: Public
- Update: Public
- Delete: Public

## Krok 5: Test API

Po skonfigurowaniu kolekcji, uruchom:

```bash
node test-api.js
```

## Endpointy API

### Kolumny

- GET `/api/collections/columns/records` - pobierz wszystkie kolumny
- POST `/api/collections/columns/records` - utwórz kolumnę
- PATCH `/api/collections/columns/records/{id}` - zaktualizuj kolumnę
- DELETE `/api/collections/columns/records/{id}` - usuń kolumnę

### Karty

- GET `/api/collections/cards/records` - pobierz wszystkie karty
- POST `/api/collections/cards/records` - utwórz kartę
- PATCH `/api/collections/cards/records/{id}` - zaktualizuj kartę
- DELETE `/api/collections/cards/records/{id}` - usuń kartę
- GET `/api/collections/cards/records?filter=column="column_id"` - pobierz karty dla kolumny
