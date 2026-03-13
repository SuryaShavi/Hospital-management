import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../../frontend/src/app/services/api';
import Login from '../../frontend/src/app/pages/Login';

// simple mock for localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Authentication utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('login API helper stores token on success', async () => {
    const fakeResponse = { token: 'abc', id: 1, name: 'Test', email: 't@t.com', role: 'ADMIN' };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    } as any);

    const { data, error } = await api.authApi.login({ email: 't@t.com', password: 'pass' });
    expect(error).toBeUndefined();
    expect(data).toEqual(fakeResponse);
    expect(localStorage.getItem('auth_token')).toBe('abc');
  });

  test('logout clears storage', () => {
    localStorage.setItem('auth_token', 'abc');
    localStorage.setItem('auth_user', JSON.stringify({}));
    api.authApi.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });
});

// Basic smoke test for Login page interactions

describe('Login page interactions', () => {
  test('submitting form calls api.login', async () => {
    const loginSpy = jest.spyOn(api.authApi, 'login').mockResolvedValue({ data: { token: 'x', id: 1, name: '', email: '', role: 'ADMIN' } });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(loginSpy).toHaveBeenCalled();
  });
});
