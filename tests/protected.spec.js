const { test, expect } = require('@playwright/test');

test('should redirect unauthenticated user to login page', async ({ page }) => {
  // 1. Próbujemy wejść bezpośrednio na chronioną stronę
  await page.goto('http://localhost:3000/user/profile');

  // 2. Sprawdzamy, czy URL zmienił się na stronę logowania
  // Twoja aplikacja (layout.js w folderze protected) dodaje parametr returnUrl
  // więc sprawdzamy, czy URL zawiera "/user/signin"
  await expect(page).toHaveURL(/.*\/user\/signin/);

  // 3. Opcjonalnie sprawdzamy czy w URL jest parametr powrotu
  // (zależy jak dokładnie działa Twoje przekierowanie)
  // await expect(page).toHaveURL(/returnUrl/);
});