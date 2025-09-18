import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerUser } from './actions';
import RegisterPage from './page';

vi.mock('./actions', () => ({
  registerUser: vi.fn(),
}));

const registerUserMock = vi.mocked(registerUser);

const getActiveFieldset = () => {
  const fieldsets = screen.getAllByRole('group');
  return fieldsets[fieldsets.length - 1];
};

describe('RegisterPage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    registerUserMock.mockReset();
    registerUserMock.mockResolvedValue(undefined);
  });

  it('renders the register form fields', () => {
    render(<RegisterPage />);

    expect(
      screen.getByText(/register for a new account\./i),
    ).toBeInTheDocument();

    const fieldset = getActiveFieldset();
    const withinFieldset = within(fieldset);

    expect(withinFieldset.getByLabelText(/email/i)).toBeInTheDocument();
    expect(withinFieldset.getByLabelText(/name/i)).toBeInTheDocument();
    expect(withinFieldset.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(
      withinFieldset.getByLabelText(/password confirm/i),
    ).toBeInTheDocument();
    expect(
      withinFieldset.getByRole('button', { name: /register/i }),
    ).toBeInTheDocument();

    const loginLink = screen.getByRole('link', { name: /sing in/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('submits registration data and shows the success state', async () => {
    render(<RegisterPage />);
    const user = userEvent.setup();

    const fieldset = getActiveFieldset();
    const withinFieldset = within(fieldset);
    const emailInput = withinFieldset.getByLabelText(/email/i);
    const nameInput = withinFieldset.getByLabelText(/name/i);
    const passwordInput = withinFieldset.getByLabelText(/^password$/i);
    const passwordConfirmInput = withinFieldset.getByLabelText(
      /password confirm/i,
    );
    const submitButton = withinFieldset.getByRole('button', {
      name: /register/i,
    });

    await user.type(emailInput, 'user@example.com');
    await user.type(nameInput, 'Test User');
    await user.type(passwordInput, 'strongPassword');
    await user.type(passwordConfirmInput, 'strongPassword');

    await user.click(submitButton);

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        name: 'Test User',
        password: 'strongPassword',
        passwordConfirm: 'strongPassword',
      });
    });

    expect(
      await screen.findByText(/your account has been created/i),
    ).toBeVisible();

    const loginLink = screen.getByRole('link', {
      name: /login to your account/i,
    });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('shows an error message when registration fails', async () => {
    registerUserMock.mockResolvedValueOnce({
      error: 'An account is already registered with this email address',
    });

    render(<RegisterPage />);
    const user = userEvent.setup();

    const fieldset = getActiveFieldset();
    const withinFieldset = within(fieldset);
    const emailInput = withinFieldset.getByLabelText(/email/i);
    const nameInput = withinFieldset.getByLabelText(/name/i);
    const passwordInput = withinFieldset.getByLabelText(/^password$/i);
    const passwordConfirmInput = withinFieldset.getByLabelText(
      /password confirm/i,
    );
    const submitButton = withinFieldset.getByRole('button', {
      name: /register/i,
    });

    await user.type(emailInput, 'user@example.com');
    await user.type(nameInput, 'Test User');
    await user.type(passwordInput, 'strongPassword');
    await user.type(passwordConfirmInput, 'strongPassword');

    await user.click(submitButton);

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalled();
    });

    expect(
      await screen.findByText(
        /an account is already registered with this email address/i,
      ),
    ).toBeVisible();
    expect(
      screen.queryByText(/your account has been created/i),
    ).not.toBeInTheDocument();
  });

  it('disables the form while submitting', async () => {
    let resolveRegister:
      | ((value: { error: string } | undefined) => void)
      | undefined;
    registerUserMock.mockImplementationOnce(
      () =>
        new Promise<{ error: string } | undefined>((resolve) => {
          resolveRegister = resolve;
        }),
    );

    render(<RegisterPage />);
    const user = userEvent.setup();

    const fieldset = getActiveFieldset();
    const withinFieldset = within(fieldset);
    const emailInput = withinFieldset.getByLabelText(/email/i);
    const nameInput = withinFieldset.getByLabelText(/name/i);
    const passwordInput = withinFieldset.getByLabelText(/^password$/i);
    const passwordConfirmInput = withinFieldset.getByLabelText(
      /password confirm/i,
    );
    const submitButton = withinFieldset.getByRole('button', {
      name: /register/i,
    });

    await user.type(emailInput, 'user@example.com');
    await user.type(nameInput, 'Test User');
    await user.type(passwordInput, 'strongPassword');
    await user.type(passwordConfirmInput, 'strongPassword');

    await user.click(submitButton);

    await waitFor(() => {
      expect(fieldset).toBeDisabled();
    });

    resolveRegister?.({ error: 'Something went wrong' });

    await waitFor(() => {
      expect(fieldset).not.toBeDisabled();
    });

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
  });
});
