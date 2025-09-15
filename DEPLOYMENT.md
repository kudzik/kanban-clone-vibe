# Deployment Guide - Lovablade Kanban

## 🚀 Opcje Deploymentu

### 1. GitHub Pages (Zalecane)

Aplikacja jest skonfigurowana do automatycznego deploymentu na GitHub Pages.

#### Wymagania:
- Repozytorium publiczne na GitHub
- Włączone GitHub Pages w ustawieniach repozytorium
- GitHub Actions workflow (już skonfigurowany)

#### Kroki:
1. Przejdź do Settings → Pages w swoim repozytorium GitHub
2. Wybierz "GitHub Actions" jako źródło
3. Każdy push do brancha `main` automatycznie zbuduje i wdroży aplikację

#### URL aplikacji:
```
https://[username].github.io/[repository-name]
```

### 2. Vercel

#### Kroki:
1. Zainstaluj Vercel CLI: `npm i -g vercel`
2. Uruchom: `vercel`
3. Postępuj zgodnie z instrukcjami

#### Alternatywnie:
1. Połącz repozytorium GitHub z Vercel
2. Wybierz folder `dist` jako build directory
3. Ustaw build command: `npm run build`

### 3. Netlify

#### Kroki:
1. Zainstaluj Netlify CLI: `npm i -g netlify-cli`
2. Uruchom: `netlify deploy --prod --dir=dist`
3. Postępuj zgodnie z instrukcjami

#### Alternatywnie:
1. Połącz repozytorium GitHub z Netlify
2. Ustaw build command: `npm run build`
3. Ustaw publish directory: `dist`

### 4. Lokalny serwer

#### Kroki:
1. Zbuduj aplikację: `npm run build`
2. Uruchom serwer preview: `npm run preview`
3. Aplikacja będzie dostępna na `http://localhost:4173`

## 🔧 Konfiguracja PocketBase

### Opcja 1: Lokalny PocketBase
1. Uruchom `pocketbase.exe serve` w katalogu projektu
2. Aplikacja będzie używać lokalnego API

### Opcja 2: PocketBase Cloud
1. Zarejestruj się na [pocketbase.io](https://pocketbase.io)
2. Utwórz nowy projekt
3. Zaktualizuj URL w `src/services/pocketbase.ts`

### Opcja 3: VPS/Hosting
1. Skopiuj `pocketbase.exe` na serwer
2. Uruchom jako usługę systemową
3. Skonfiguruj domenę i SSL

## 📋 Checklist Deploymentu

- [ ] ✅ Build produkcyjny działa (`npm run build`)
- [ ] ✅ Testy przechodzą (`npm run test:e2e`)
- [ ] ✅ PocketBase jest dostępne
- [ ] ✅ GitHub Actions workflow jest aktywny
- [ ] ✅ GitHub Pages jest włączone
- [ ] ✅ Aplikacja jest dostępna publicznie

## 🐛 Troubleshooting

### Problem: Aplikacja nie ładuje się
- Sprawdź czy PocketBase jest uruchomione
- Sprawdź konsole przeglądarki pod kątem błędów
- Zweryfikuj URL API w konfiguracji

### Problem: GitHub Actions nie działa
- Sprawdź czy repozytorium ma uprawnienia do GitHub Pages
- Sprawdź logi w zakładce Actions
- Zweryfikuj czy wszystkie zależności są zainstalowane

### Problem: Build nie przechodzi
- Sprawdź czy wszystkie testy przechodzą lokalnie
- Zweryfikuj konfigurację TypeScript
- Sprawdź czy wszystkie pliki są commitowane

## 📊 Monitoring

### Metryki do monitorowania:
- Czas ładowania aplikacji
- Dostępność PocketBase API
- Błędy JavaScript w przeglądarce
- Użycie zasobów serwera

### Narzędzia:
- Google Analytics (dla metryk użytkowania)
- Sentry (dla monitorowania błędów)
- Uptime monitoring (dla dostępności)

## 🔄 Aktualizacje

### Automatyczne:
- GitHub Actions automatycznie wdroży nowe zmiany po push do `main`

### Manualne:
1. Zbuduj lokalnie: `npm run build`
2. Przetestuj: `npm run preview`
3. Commit i push: `git add . && git commit -m "Update" && git push`
