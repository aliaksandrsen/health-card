import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../actions', () => ({
  signOutAction: vi.fn(),
}));

import { signOutAction } from '../actions';
import { SignOutButton } from './SignOutButton';

const signOutActionMock = vi.mocked(signOutAction);

describe('SignOutButton', () => {
  beforeEach(() => {
    signOutActionMock.mockClear();
  });

  it('calls signOutAction when the button is clicked', async () => {
    render(<SignOutButton />);
    const user = userEvent.setup();

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');

    await user.click(button);

    expect(signOutActionMock).toHaveBeenCalledTimes(1);
  });
});
