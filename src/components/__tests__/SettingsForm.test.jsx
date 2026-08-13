import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SettingsForm from '../SettingsForm';
import { vi, describe, test, expect } from 'vitest';

describe('SettingsForm', () => {
  test('shows required field errors on submit', async () => {
    render(<SettingsForm />);
    // submit the form programmatically (Save is disabled while invalid)
    fireEvent.submit(document.querySelector('form'));

    expect(await screen.findByText(/Full name must be at least 2 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/Enter a valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Phone number must be 10-11 digits/i)).toBeInTheDocument();
  });

  test('shows invalid email error', async () => {
    render(<SettingsForm />);
    const fullName = screen.getByLabelText(/full name/i);
    const phone = screen.getByLabelText(/phone number/i);
    const email = screen.getByLabelText(/email/i);
    const saveBtn = screen.getByRole('button', { name: /save/i });

    await userEvent.type(fullName, 'Alice');
    await userEvent.type(phone, '1234567890');
    await userEvent.type(email, 'bad-email');

    // Save is disabled for invalid form; submit programmatically
    fireEvent.submit(document.querySelector('form'));

    expect(await screen.findByText(/Enter a valid email address/i)).toBeInTheDocument();
  });

  test('submits successfully and shows success message', async () => {
    render(<SettingsForm />);

    const fullName = screen.getByLabelText(/full name/i);
    const phone = screen.getByLabelText(/phone number/i);
    const email = screen.getByLabelText(/email/i);
    const bio = screen.getByLabelText(/bio/i);
    const saveBtn = screen.getByRole('button', { name: /save/i });

    await userEvent.type(fullName, 'Alice Example');
    await userEvent.type(phone, '1234567890');
    await userEvent.type(email, 'alice@example.com');
    await userEvent.type(bio, 'Hello!');

    // Submit form programmatically (the Save button is disabled while invalid/submitting)
    fireEvent.submit(document.querySelector('form'));

    // While saving, button should be disabled
    expect(saveBtn).toBeDisabled();

    // Wait for the fakeSave timeout to resolve
    await new Promise((r) => setTimeout(r, 1100));

    // Wait for the success message
    expect(await screen.findByText(/Profile saved successfully/i)).toBeInTheDocument();
  });
});
