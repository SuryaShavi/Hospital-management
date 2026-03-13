import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../frontend/src/app/pages/Login';
import Register from '../../frontend/src/app/pages/Register';

/**
 * Generic smoke tests for forms: required fields and error messages.
 * Actual implementations may need to mock network calls.
 */

describe('Form validation', () => {
  test('login shows validation errors for empty fields', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // login page uses "Sign In" text on submit
    const submit = screen.getByRole('button', { name: /sign\s?in|login/i });
    fireEvent.click(submit);
    expect(screen.queryByText(/email is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/password is required/i)).toBeInTheDocument();
  });

  test('register shows validation errors for missing data', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    // register page uses "Create Account" button text
    const submit = screen.getByRole('button', { name: /create\s?account|register/i });
    fireEvent.click(submit);
    expect(screen.queryByText(/name is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/email is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/password is required/i)).toBeInTheDocument();
  });
});
