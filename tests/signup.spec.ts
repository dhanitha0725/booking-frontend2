import { test, expect } from '@playwright/test';

test('successful registration', async ({ page }) => {
  // Mock the API response for registration
  await page.route('**/api/Auth/register', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  );

  // Navigate to the signup page
  await page.goto('/signup');

  // Fill in the form with valid data
  await page.getByLabel('First Name').fill('John');
  await page.getByLabel('Last Name').fill('Doe');
  await page.getByLabel('Email').fill('john.doe@example.com');
  await page.getByLabel('Phone Number').fill('+1234567890');
  await page.getByLabel('Password', { exact: true }).fill('123456@Rs');
  await page.getByLabel('Confirm Password', { exact: true }).fill('123456@Rs');

  // Submit the form
  await page.getByRole('button', { name: 'Sign Up' }).click();

  // Wait for navigation to the login page
  await page.waitForURL('/login');

  // Verify the success message (assumes Login component displays it)
  await expect(
    page.getByText('Registration successful! You can now login with your credentials.')
  ).toBeVisible();
});


// Test for validation errors on empty form
test('validation errors on empty form', async ({ page }) => {
  await page.goto('/signup');
  await page.getByRole('button', { name: 'Sign Up' }).click();

  // Check for error messages from the Zod schema
  await expect(page.getByText('First name must be at least 2 characters')).toBeVisible();
  await expect(page.getByText('Last name must be at least 2 characters')).toBeVisible();
  await expect(page.getByText('Invalid email format')).toBeVisible();
  await expect(page.getByText('Invalid phone number format')).toBeVisible();
  await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();

  // Verify the page doesn't navigate
  await expect(page).toHaveURL('/signup');
});

// test for invalid email
test('invalid email', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('First Name').fill('John');
  await page.getByLabel('Last Name').fill('Doe');
  await page.getByLabel('Email').fill('invalid');
  await page.getByLabel('Phone Number').fill('+1234567890');
  await page.getByLabel('Password', { exact: true }).fill('123456@Rs'); 
  await page.getByLabel('Confirm Password', { exact: true }).fill('123456@Rs'); 
  
  // Click the button and wait for validation
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  // Look for the error state on the email field itself
  const emailField = page.getByLabel('Email');
  
  // Check if the email field has the error attribute
  await expect(emailField).toHaveAttribute('aria-invalid', 'true');
  
  // Find the helper text element that accompanies the email field 
  const helperText = page.locator('label:has-text("Email")').locator('xpath=../..').locator('.MuiFormHelperText-root');
  await expect(helperText).toBeVisible();
  
  // Verify we're still on the signup page
  await expect(page).toHaveURL('/signup');
});

// test for invalid password mismatch
test('password mismatch', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('First Name').fill('John');
  await page.getByLabel('Last Name').fill('Doe');
  await page.getByLabel('Email').fill('john.doe@example.com');
  await page.getByLabel('Phone Number').fill('+1234567890');
  await page.getByLabel('Password', { exact: true }).fill('123456@Rs'); 
  await page.getByLabel('Confirm Password', { exact: true }).fill('different'); 
  await page.getByRole('button', { name: 'Sign Up' }).click();

  await expect(page.getByText('Passwords do not match')).toBeVisible();
  await expect(page).toHaveURL('/signup');
});