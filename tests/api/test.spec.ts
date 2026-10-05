import { test, expect } from '@playwright/test'
test('Validar respuesta de API mediante Snapshot', async ({ request }) => {
  const response = await request.get('https://dummyjson.com/products/1');
  const body = await response.json();

  // Playwright comparará este JSON contra un archivo baseline guardado automáticamente
  expect(body).toMatchSnapshot('user-profile-response.json');
});