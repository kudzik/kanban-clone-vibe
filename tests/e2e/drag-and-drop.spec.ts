import { test, expect } from '@playwright/test';

test.describe('Drag and Drop Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Czekaj na załadowanie aplikacji
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
    
    // Dodaj testowe kolumny i karty
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Column 1');
    await page.click('button:has-text("Dodaj listę")');
    
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Column 2');
    await page.click('button:has-text("Dodaj listę")');
    
    // Dodaj karty do pierwszej kolumny
    await page.click('button:has-text("Dodaj kartę")');
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'Card 1');
    await page.click('button:has-text("Dodaj kartę")');
    
    await page.click('button:has-text("Dodaj kartę")');
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'Card 2');
    await page.click('button:has-text("Dodaj kartę")');
  });

  test('should drag and drop column to reorder', async ({ page }) => {
    // Znajdź kolumny
    const column1 = page.locator('h2:has-text("Column 1")').locator('..');
    const column2 = page.locator('h2:has-text("Column 2")').locator('..');
    
    // Sprawdź początkową kolejność
    const columns = page.locator('[data-column-id]');
    await expect(columns.nth(0)).toContainText('Column 1');
    await expect(columns.nth(1)).toContainText('Column 2');
    
    // Przeciągnij Column 1 na pozycję Column 2
    await column1.dragTo(column2);
    
    // Sprawdź czy kolejność została zmieniona
    await expect(columns.nth(0)).toContainText('Column 2');
    await expect(columns.nth(1)).toContainText('Column 1');
  });

  test('should drag and drop card within same column', async ({ page }) => {
    // Znajdź karty
    const card1 = page.locator('h3:has-text("Card 1")').locator('..');
    const card2 = page.locator('h3:has-text("Card 2")').locator('..');
    
    // Sprawdź początkową kolejność
    const cards = page.locator('[data-card-id]');
    await expect(cards.nth(0)).toContainText('Card 1');
    await expect(cards.nth(1)).toContainText('Card 2');
    
    // Przeciągnij Card 1 na pozycję Card 2
    await card1.dragTo(card2);
    
    // Sprawdź czy kolejność została zmieniona
    await expect(cards.nth(0)).toContainText('Card 2');
    await expect(cards.nth(1)).toContainText('Card 1');
  });

  test('should drag and drop card between columns', async ({ page }) => {
    // Znajdź kartę i drugą kolumnę
    const card1 = page.locator('h3:has-text("Card 1")').locator('..');
    const column2 = page.locator('h2:has-text("Column 2")').locator('..');
    
    // Sprawdź że karta jest w pierwszej kolumnie
    await expect(column2.locator('h3:has-text("Card 1")')).not.toBeVisible();
    
    // Przeciągnij kartę do drugiej kolumny
    await card1.dragTo(column2);
    
    // Sprawdź czy karta została przeniesiona
    await expect(column2.locator('h3:has-text("Card 1")')).toBeVisible();
  });

  test('should show drag overlay during drag operation', async ({ page }) => {
    // Znajdź kolumnę
    const column1 = page.locator('h2:has-text("Column 1")').locator('..');
    
    // Rozpocznij przeciąganie
    await column1.hover();
    await page.mouse.down();
    
    // Sprawdź czy overlay jest widoczny
    await expect(page.locator('.opacity-90')).toBeVisible();
    
    // Zakończ przeciąganie
    await page.mouse.up();
  });

  test('should show visual feedback during drag over', async ({ page }) => {
    // Znajdź kolumnę i kartę
    const card1 = page.locator('h3:has-text("Card 1")').locator('..');
    const column2 = page.locator('h2:has-text("Column 2")').locator('..');
    
    // Rozpocznij przeciąganie karty nad kolumnę
    await card1.hover();
    await page.mouse.down();
    await column2.hover();
    
    // Sprawdź czy kolumna ma ring highlight
    await expect(column2).toHaveClass(/ring-2/);
    
    // Zakończ przeciąganie
    await page.mouse.up();
  });

  test('should maintain drag and drop functionality on mobile viewport', async ({ page }) => {
    // Ustaw viewport na mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Znajdź kartę i drugą kolumnę
    const card1 = page.locator('h3:has-text("Card 1")').locator('..');
    const column2 = page.locator('h2:has-text("Column 2")').locator('..');
    
    // Sprawdź że karta jest w pierwszej kolumnie
    await expect(column2.locator('h3:has-text("Card 1")')).not.toBeVisible();
    
    // Przeciągnij kartę do drugiej kolumny (touch simulation)
    await card1.dragTo(column2);
    
    // Sprawdź czy karta została przeniesiona
    await expect(column2.locator('h3:has-text("Card 1")')).toBeVisible();
  });

  test('should handle drag and drop on tablet viewport', async ({ page }) => {
    // Ustaw viewport na tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Znajdź kolumny
    const column1 = page.locator('h2:has-text("Column 1")').locator('..');
    const column2 = page.locator('h2:has-text("Column 2")').locator('..');
    
    // Sprawdź początkową kolejność
    const columns = page.locator('[data-column-id]');
    await expect(columns.nth(0)).toContainText('Column 1');
    await expect(columns.nth(1)).toContainText('Column 2');
    
    // Przeciągnij Column 1 na pozycję Column 2
    await column1.dragTo(column2);
    
    // Sprawdź czy kolejność została zmieniona
    await expect(columns.nth(0)).toContainText('Column 2');
    await expect(columns.nth(1)).toContainText('Column 1');
  });
});
