import { test, expect } from '@playwright/test';

test.describe('CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Czekaj na załadowanie aplikacji
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
  });

  test('should add a new column', async ({ page }) => {
    const timestamp = Date.now();
    const columnName = `Test Column ${timestamp}`;
    
    // Kliknij przycisk dodawania kolumny
    await page.click('button:has-text("Dodaj listę")');
    
    // Wprowadź tytuł kolumny
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', columnName);
    
    // Kliknij przycisk "Dodaj listę"
    await page.click('button:has-text("Dodaj listę")');
    
    // Sprawdź czy kolumna została dodana
    await expect(page.locator(`h2:has-text("${columnName}")`)).toBeVisible();
  });

  test('should edit column title', async ({ page }) => {
    // Dodaj kolumnę do edycji
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Original Title');
    await page.click('button:has-text("Dodaj listę")');
    
    // Kliknij na tytuł kolumny aby edytować
    await page.click('h2:has-text("Original Title")');
    
    // Wprowadź nowy tytuł
    await page.fill('input[value="Original Title"]', 'Edited Title');
    await page.press('input[value="Edited Title"]', 'Enter');
    
    // Sprawdź czy tytuł został zmieniony
    await expect(page.locator('h2:has-text("Edited Title")')).toBeVisible();
  });

  test('should delete column with confirmation', async ({ page }) => {
    // Dodaj kolumnę do usunięcia
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'To Delete');
    await page.click('button:has-text("Dodaj listę")');
    
    // Kliknij przycisk usuwania kolumny
    await page.click('button[title="Usuń kolumnę"]');
    
    // Potwierdź usunięcie
    await page.click('button:has-text("Usuń")');
    
    // Sprawdź czy kolumna została usunięta
    await expect(page.locator('h2:has-text("To Delete")')).not.toBeVisible();
  });

  test('should add a new card to column', async ({ page }) => {
    // Dodaj kolumnę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Test Column');
    await page.click('button:has-text("Dodaj listę")');
    
    // Kliknij przycisk dodawania karty
    await page.click('button:has-text("Dodaj kartę")');
    
    // Wprowadź tytuł karty
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'Test Card');
    
    // Kliknij przycisk "Dodaj kartę"
    await page.click('button:has-text("Dodaj kartę")');
    
    // Sprawdź czy karta została dodana
    await expect(page.locator('h3:has-text("Test Card")')).toBeVisible();
  });

  test('should edit card title', async ({ page }) => {
    // Dodaj kolumnę i kartę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Test Column');
    await page.click('button:has-text("Dodaj listę")');
    
    await page.click('button:has-text("Dodaj kartę")');
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'Original Card');
    await page.click('button:has-text("Dodaj kartę")');
    
    // Kliknij na kartę aby edytować
    await page.click('h3:has-text("Original Card")');
    
    // Wprowadź nowy tytuł
    await page.fill('textarea', 'Edited Card');
    await page.press('textarea', 'Enter');
    
    // Sprawdź czy tytuł został zmieniony
    await expect(page.locator('h3:has-text("Edited Card")')).toBeVisible();
  });

  test('should delete card with confirmation', async ({ page }) => {
    // Dodaj kolumnę i kartę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Test Column');
    await page.click('button:has-text("Dodaj listę")');
    
    await page.click('button:has-text("Dodaj kartę")');
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'To Delete Card');
    await page.click('button:has-text("Dodaj kartę")');
    
    // Hover nad kartą aby pokazać przyciski akcji
    await page.hover('h3:has-text("To Delete Card")');
    
    // Kliknij przycisk usuwania karty
    await page.click('button[title="Usuń kartę"]');
    
    // Potwierdź usunięcie
    await page.click('button:has-text("Usuń")');
    
    // Sprawdź czy karta została usunięta
    await expect(page.locator('h3:has-text("To Delete Card")')).not.toBeVisible();
  });

  test('should cancel adding column', async ({ page }) => {
    // Kliknij przycisk dodawania kolumny
    await page.click('button:has-text("Dodaj listę")');
    
    // Wprowadź tytuł
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Test Column');
    
    // Kliknij anuluj
    await page.click('button:has-text("Anuluj")');
    
    // Sprawdź czy formularz został zamknięty
    await expect(page.locator('input[placeholder="Wprowadź tytuł listy..."]')).not.toBeVisible();
  });

  test('should cancel adding card', async ({ page }) => {
    // Dodaj kolumnę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Test Column');
    await page.click('button:has-text("Dodaj listę")');
    
    // Kliknij przycisk dodawania karty
    await page.click('button:has-text("Dodaj kartę")');
    
    // Wprowadź tytuł
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'Test Card');
    
    // Kliknij anuluj
    await page.click('button:has-text("Anuluj")');
    
    // Sprawdź czy formularz został zamknięty
    await expect(page.locator('textarea[placeholder="Wprowadź tytuł karty..."]')).not.toBeVisible();
  });
});
