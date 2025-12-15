const { test, expect } = require('@playwright/test');

test('has link to login page', async ({ page }) => {
  // 1. Otwórz stronę główną (adres lokalny)
  await page.goto('http://localhost:3000/');

  // 2. Symulacja kliknięcia w link "Logowanie" w sidebarze
  // Używamy getByRole, aby znaleźć link o nazwie "Logowanie"
  await page.getByRole('link', { name: 'Logowanie' }).click();

  // 3. Sprawdzenie, czy URL zmienił się na stronę logowania
  await expect(page).toHaveURL('http://localhost:3000/user/signin');

  // 4. Sprawdzenie, czy na stronie logowania jest nagłówek h2 z tekstem "Zaloguj się do konta"
  // (Taki tekst masz w pliku app/(public)/user/signin/page.js)
  await expect(page.locator('h2')).toContainText('Zaloguj się do konta');
});