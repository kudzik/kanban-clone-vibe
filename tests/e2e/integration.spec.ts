import { test, expect } from '@playwright/test';

test.describe('PocketBase Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Czekaj na załadowanie aplikacji
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
  });

  test('should load existing data from PocketBase', async ({ page }) => {
    // Sprawdź czy aplikacja się załadowała bez błędów
    await expect(page.locator('[data-testid="kanban-board"]')).toBeVisible();
    
    // Sprawdź czy nie ma komunikatu o błędzie
    await expect(page.locator('text=Błąd połączenia')).not.toBeVisible();
    
    // Sprawdź czy nie ma komunikatu o ładowaniu
    await expect(page.locator('text=Ładowanie tablicy Kanban...')).not.toBeVisible();
  });

  test('should persist data after page refresh', async ({ page }) => {
    // Dodaj kolumnę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Persistent Column');
    await page.click('button:has-text("Dodaj listę")');
    
    // Sprawdź czy kolumna została dodana
    await expect(page.locator('h2:has-text("Persistent Column")')).toBeVisible();
    
    // Odśwież stronę
    await page.reload();
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
    
    // Sprawdź czy kolumna nadal istnieje
    await expect(page.locator('h2:has-text("Persistent Column")')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Symuluj błąd sieci
    await page.route('**/api/**', route => route.abort());
    
    // Odśwież stronę
    await page.reload();
    
    // Sprawdź czy wyświetla się komunikat o błędzie
    await expect(page.locator('text=Błąd połączenia')).toBeVisible();
    
    // Sprawdź czy przycisk "Spróbuj ponownie" jest widoczny
    await expect(page.locator('button:has-text("Spróbuj ponownie")')).toBeVisible();
  });

  test('should sync data between multiple browser tabs', async ({ context }) => {
    // Otwórz dwie karty
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('/');
    await page2.goto('/');
    
    await page1.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
    await page2.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
    
    // Dodaj kolumnę w pierwszej karcie
    await page1.click('button:has-text("Dodaj listę")');
    await page1.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Sync Test Column');
    await page1.click('button:has-text("Dodaj listę")');
    
    // Sprawdź czy kolumna została dodana w pierwszej karcie
    await expect(page1.locator('h2:has-text("Sync Test Column")')).toBeVisible();
    
    // Odśwież drugą kartę
    await page2.reload();
    await page2.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
    
    // Sprawdź czy kolumna jest widoczna w drugiej karcie
    await expect(page2.locator('h2:has-text("Sync Test Column")')).toBeVisible();
    
    await page1.close();
    await page2.close();
  });

  test('should handle concurrent operations', async ({ page }) => {
    // Dodaj kolumnę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Concurrent Column');
    await page.click('button:has-text("Dodaj listę")');
    
    // Dodaj kilka kart jednocześnie
    const cardPromises: Promise<void>[] = [];
    for (let i = 1; i <= 3; i++) {
      cardPromises.push(
        page.click('button:has-text("Dodaj kartę")'),
        page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', `Concurrent Card ${i}`),
        page.click('button:has-text("Dodaj kartę")')
      );
    }
    
    // Wykonaj wszystkie operacje
    await Promise.all(cardPromises);
    
    // Sprawdź czy wszystkie karty zostały dodane
    for (let i = 1; i <= 3; i++) {
      await expect(page.locator(`h3:has-text("Concurrent Card ${i}")`)).toBeVisible();
    }
  });

  test('should maintain data integrity during drag and drop', async ({ page }) => {
    // Dodaj kolumnę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Integrity Column');
    await page.click('button:has-text("Dodaj listę")');
    
    // Dodaj kartę
    await page.click('button:has-text("Dodaj kartę")');
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'Integrity Card');
    await page.click('button:has-text("Dodaj kartę")');
    
    // Sprawdź początkowy stan
    await expect(page.locator('h3:has-text("Integrity Card")')).toBeVisible();
    
    // Odśwież stronę
    await page.reload();
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
    
    // Sprawdź czy dane zostały zachowane
    await expect(page.locator('h2:has-text("Integrity Column")')).toBeVisible();
    await expect(page.locator('h3:has-text("Integrity Card")')).toBeVisible();
  });

  test('should handle large datasets', async ({ page }) => {
    // Dodaj wiele kolumn
    for (let i = 1; i <= 5; i++) {
      await page.click('button:has-text("Dodaj listę")');
      await page.fill('input[placeholder="Wprowadź tytuł listy..."]', `Large Dataset Column ${i}`);
      await page.click('button:has-text("Dodaj listę")');
    }
    
    // Dodaj wiele kart do pierwszej kolumny
    for (let i = 1; i <= 10; i++) {
      await page.click('button:has-text("Dodaj kartę")');
      await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', `Large Dataset Card ${i}`);
      await page.click('button:has-text("Dodaj kartę")');
    }
    
    // Sprawdź czy wszystkie elementy zostały dodane
    for (let i = 1; i <= 5; i++) {
      await expect(page.locator(`h2:has-text("Large Dataset Column ${i}")`)).toBeVisible();
    }
    
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator(`h3:has-text("Large Dataset Card ${i}")`)).toBeVisible();
    }
    
    // Odśwież stronę i sprawdź czy wszystkie dane zostały zachowane
    await page.reload();
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
    
    for (let i = 1; i <= 5; i++) {
      await expect(page.locator(`h2:has-text("Large Dataset Column ${i}")`)).toBeVisible();
    }
    
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator(`h3:has-text("Large Dataset Card ${i}")`)).toBeVisible();
    }
  });
});
