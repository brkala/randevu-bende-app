import { fakerTR } from '@faker-js/faker';
import { createTodoBuilder } from '@/features/database/seeds/builders/todo.builder';
import { MOCK_IMAGES } from '../lib/constants';
import { expect, test } from '../lib/fixtures';

test.describe('Todo Feature', () => {
  test('should show seed data', async ({ page, db, waitForHydration }) => {
    fakerTR.seed(1212);
    const testTodoId = fakerTR.string.uuid();
    const testTitle = 'Created by DB';

    await db.todo.create({
      data: createTodoBuilder().title(testTitle).id(testTodoId).build(),
    });

    try {
      await page.goto('/todos');
      await waitForHydration();
      await expect(page.getByTestId('todo-item').filter({ hasText: testTitle })).toBeVisible();
    } finally {
      await db.todo.delete({ where: { id: testTodoId } });
    }
  });

  test('should allow user to add and delete a todo', async ({
    page,
    waitForHydration,
    waitForServerFn,
  }) => {
    await page.goto('/todos');

    await waitForHydration();

    await expect(page.getByRole('heading', { name: 'Todo List' })).toBeVisible();

    const todoTitle = `Test Todo ${Date.now()}`;
    const todoText = 'This is a test content from Playwright';
    const today = new Date().toISOString().split('T')[0];

    await page.getByTestId('todo-title-input').fill(todoTitle);
    await page.getByTestId('todo-text-input').fill(todoText);
    await page.getByTestId('todo-date-input').fill(today);

    // Kırmızı 32x32 piksel PNG (Base64)
    await page.getByTestId('todo-image-input').setInputFiles({
      name: 'test-red-bg.png',
      mimeType: 'image/png',
      buffer: Buffer.from(MOCK_IMAGES.RED_PNG_32x32, 'base64'),
    });

    const responsePromise = waitForServerFn();
    await page.getByTestId('todo-add-button').click();
    await responsePromise;

    const todoItem = page.getByTestId('todo-item').filter({ hasText: todoTitle });
    await expect(todoItem).toBeVisible({ timeout: 5000 });
    await expect(todoItem.getByTestId('todo-item-title')).toHaveText(todoTitle);
    await expect(todoItem.getByTestId('todo-item-text')).toHaveText(todoText);

    // Yüklenen resmin ekranda göründüğünü doğrula
    await expect(todoItem.locator('img')).toBeVisible();

    await todoItem.getByTestId('todo-delete-button').click();

    await expect(page.getByTestId('todo-item').filter({ hasText: todoTitle })).not.toBeVisible({
      timeout: 10000,
    });
  });
});
