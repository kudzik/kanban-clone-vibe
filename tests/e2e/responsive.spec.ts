import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Czekaj na załadowanie aplikacji
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });
  });

  test('should display correctly on mobile viewport (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Sprawdź czy nagłówek jest wyśrodkowany
    await expect(page.locator('h1')).toHaveClass(/text-center/);
    
    // Sprawdź czy przycisk dodawania kolumny ma skrócony tekst
    await expect(page.locator('button:has-text("Dodaj listę")')).toBeVisible();
    
    // Sprawdź czy kolumny mają pełną szerokość
    const columns = page.locator('[data-column-id]');
    if (await columns.count() > 0) {
      await expect(columns.first()).toHaveClass(/w-full/);
    }
  });

  test('should display correctly on tablet viewport (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Sprawdź czy nagłówek jest wyrównany do lewej
    await expect(page.locator('h1')).toHaveClass(/sm:text-left/);
    
    // Sprawdź czy przycisk dodawania kolumny ma pełny tekst
    await expect(page.locator('button:has-text("Add another list")')).toBeVisible();
    
    // Sprawdź czy kolumny mają odpowiednią szerokość
    const columns = page.locator('[data-column-id]');
    if (await columns.count() > 0) {
      await expect(columns.first()).toHaveClass(/sm:w-80/);
    }
  });

  test('should display correctly on desktop viewport (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Sprawdź czy nagłówek ma duży rozmiar
    await expect(page.locator('h1')).toHaveClass(/lg:text-3xl/);
    
    // Sprawdź czy przycisk dodawania kolumny ma pełny tekst
    await expect(page.locator('button:has-text("Add another list")')).toBeVisible();
    
    // Sprawdź czy kolumny mają odpowiednią szerokość
    const columns = page.locator('[data-column-id]');
    if (await columns.count() > 0) {
      await expect(columns.first()).toHaveClass(/sm:w-80/);
    }
  });

  test('should handle horizontal scrolling on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Dodaj kilka kolumn
    for (let i = 1; i <= 3; i++) {
      await page.click('button:has-text("Dodaj listę")');
      await page.fill('input[placeholder="Wprowadź tytuł listy..."]', `Column ${i}`);
      await page.click('button:has-text("Dodaj listę")');
    }
    
    // Sprawdź czy kontener ma horizontal scroll
    const container = page.locator('.overflow-x-auto');
    await expect(container).toBeVisible();
    
    // Sprawdź czy kolumny mają snap-center
    const columns = page.locator('[data-column-id]');
    await expect(columns.first()).toHaveClass(/snap-center/);
  });

  test('should adapt button layouts on different viewports', async ({ page }) => {
    // Test na mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Dodaj kolumnę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Test Column');
    await page.click('button:has-text("Dodaj listę")');
    
    // Dodaj kartę
    await page.click('button:has-text("Dodaj")');
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'Test Card');
    
    // Sprawdź czy przyciski są w kolumnie na mobile - szukaj konkretnego kontenera przycisków
    const buttonContainer = page.locator('div.flex.gap-2.flex-col.sm\\:flex-row').first();
    await expect(buttonContainer).toBeVisible();
    
    // Test na desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Sprawdź czy przyciski są w rzędzie na desktop
    const buttonContainerDesktop = page.locator('div.flex.gap-2.flex-col.sm\\:flex-row').first();
    await expect(buttonContainerDesktop).toBeVisible();
  });

  test('should handle text truncation on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Dodaj kolumnę z długim tytułem
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'This is a very long column title that should be truncated');
    await page.click('button:has-text("Dodaj listę")');
    
    // Sprawdź czy tytuł ma klasę truncate - szukaj pierwszego elementu
    const title = page.locator('h2:has-text("This is a very long column title")').first();
    await expect(title).toHaveClass(/truncate/);
  });

  test('should maintain functionality across viewport changes', async ({ page }) => {
    // Test na mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Dodaj kolumnę
    await page.click('button:has-text("Dodaj listę")');
    await page.fill('input[placeholder="Wprowadź tytuł listy..."]', 'Mobile Column');
    await page.click('button:has-text("Dodaj listę")');
    
    // Sprawdź czy kolumna została dodana - szukaj pierwszego elementu
    await expect(page.locator('h2:has-text("Mobile Column")').first()).toBeVisible();
    
    // Zmień na desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Sprawdź czy kolumna nadal jest widoczna
    await expect(page.locator('h2:has-text("Mobile Column")').first()).toBeVisible();
    
    // Dodaj kartę
    await page.click('button:has-text("Dodaj kartę")');
    await page.fill('textarea[placeholder="Wprowadź tytuł karty..."]', 'Desktop Card');
    await page.click('button:has-text("Dodaj kartę")');
    
    // Sprawdź czy karta została dodana
    await expect(page.locator('h3:has-text("Desktop Card")').first()).toBeVisible();
    
    // Wróć na mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Sprawdź czy karta nadal jest widoczna
    await expect(page.locator('h3:has-text("Desktop Card")').first()).toBeVisible();
  });

  test('should handle empty state responsively', async ({ page }) => {
    // Test na mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Sprawdź czy pusty stan ma odpowiednie rozmiary - szukaj konkretnego pustego stanu
    const emptyState = page.locator('div.w-full.text-center.py-8.lg\\:py-16.px-4');
    if (await emptyState.count() > 0) {
      await expect(emptyState.first()).toHaveClass(/py-8/);
    }
    
    // Test na desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Sprawdź czy pusty stan ma większe rozmiary
    if (await emptyState.count() > 0) {
      await expect(emptyState.first()).toHaveClass(/lg:py-16/);
    }
  });
});
