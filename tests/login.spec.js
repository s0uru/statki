const { test, expect } = require('@playwright/test');

test('should login successfully and show profile link', async ({ page }) => {
  // 1. Wejdź od razu na stronę logowania
  await page.goto('http://localhost:3000/user/signin');

  // 2. Wypełnij formularz (podaj tu SWOJE dane testowe)
  // Używamy input[name="..."] bo takie atrybuty masz w formularzu
  await page.fill('input[name="email"]', 'jakubpietrusiakk@gmail.com'); 
  await page.fill('input[name="password"]', 'qwerty');

  // 3. Kliknij przycisk logowania
  await page.click('button[type="submit"]');

  // 4. Oczekuj przekierowania na stronę główną (zgodnie z logiką w signin/page.js)
  await expect(page).toHaveURL('http://localhost:3000/');

  // 5. Sprawdź, czy w Sidebarze pojawił się link "Twój Profil"
  // (Pojawia się on tylko dla zalogowanych użytkowników)
  await expect(page.getByRole('link', { name: 'Twój Profil' })).toBeVisible();
});