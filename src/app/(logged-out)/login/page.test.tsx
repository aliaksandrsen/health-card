import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from './page';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock('../actions', () => ({
  loginWithCredentials: vi.fn().mockResolvedValue(undefined),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('renders the login form fields', () => {
    render(<LoginPage />);

    expect(screen.getByText(/sign in to your account/i)).toBeDefined();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute(
      'href',
      '/register',
    );
  });
});
