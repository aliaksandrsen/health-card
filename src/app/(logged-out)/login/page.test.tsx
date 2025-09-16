import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginWithCredentials } from './actions';
import LoginPage from './page';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock('./actions', () => ({
  loginWithCredentials: vi.fn(),
}));

const loginWithCredentialsMock = vi.mocked(loginWithCredentials);

const getActiveFieldset = () => {
  const fieldsets = screen.getAllByRole('group');
  return fieldsets[fieldsets.length - 1];
};

describe('LoginPage', () => {
  beforeEach(() => {
    push.mockClear();
    loginWithCredentialsMock.mockReset();
    loginWithCredentialsMock.mockResolvedValue(undefined);
  });

  it('renders the login form fields', () => {
    render(<LoginPage />);

    expect(screen.getByText(/sign in to your account/i)).toBeDefined();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();

    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('submits credentials and redirects on success', async () => {
    render(<LoginPage />);
    const user = userEvent.setup();

    const fieldset = getActiveFieldset();
    const withinFieldset = within(fieldset);
    const emailInput = withinFieldset.getByLabelText(/email/i);
    const passwordInput = withinFieldset.getByLabelText(/password/i);
    const submitButton = withinFieldset.getByRole('button', {
      name: /sign in/i,
    });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'strongPassword');

    await user.click(submitButton);

    await waitFor(() => {
      expect(loginWithCredentialsMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'strongPassword',
      });
    });

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/');
    });
  });

  it('shows an error message when login fails', async () => {
    loginWithCredentialsMock.mockResolvedValueOnce({
      error: 'Incorrect email or password',
    });

    const user = userEvent.setup();

    render(<LoginPage />);

    const fieldset = getActiveFieldset();
    const withinFieldset = within(fieldset);
    const emailInput = withinFieldset.getByLabelText(/email/i);
    const passwordInput = withinFieldset.getByLabelText(/password/i);
    const submitButton = withinFieldset.getByRole('button', {
      name: /sign in/i,
    });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'strongPassword');

    await user.click(submitButton);

    await waitFor(() => {
      expect(loginWithCredentialsMock).toHaveBeenCalled();
    });

    expect(
      await screen.findByText(/incorrect email or password/i),
    ).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });

  it('disables the form while submitting', async () => {
    let resolveLogin:
      | ((value: { error: string } | undefined) => void)
      | undefined;
    loginWithCredentialsMock.mockImplementationOnce(
      () =>
        new Promise<{ error: string } | undefined>((resolve) => {
          resolveLogin = resolve;
        }),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    const fieldset = getActiveFieldset();
    const withinFieldset = within(fieldset);
    const emailInput = withinFieldset.getByLabelText(/email/i);
    const passwordInput = withinFieldset.getByLabelText(/password/i);
    const submitButton = withinFieldset.getByRole('button', {
      name: /sign in/i,
    });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'strongPassword');

    await user.click(submitButton);

    await waitFor(() => {
      expect(fieldset).toBeDisabled();
    });

    resolveLogin?.(undefined);

    await waitFor(() => {
      expect(fieldset).not.toBeDisabled();
    });
  });
});
