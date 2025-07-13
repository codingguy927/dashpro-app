// tests/bulk-actions.spec.js
const { test, expect } = require('@playwright/test');

test('Bulk select, export and delete on /clients', async ({ page, browser }) => {
  await page.goto('/clients');
  // 1) Select all on page
  await page.check('input[aria-label="Select all clients on page"]');
  // 2) Export CSV
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export 2 CSV'),
  ]);
  const path = await download.path();
  const content = await download.text();
  expect(content).toContain('id,name,email');  
  // 3) Delete selected
  await page.click('text=Delete 2');
  await expect(page.locator('tbody tr')).toHaveCount(0);
});
