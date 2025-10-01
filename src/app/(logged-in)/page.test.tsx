import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getRecentVisits } from './actions';
import Home from './page';

vi.mock('./actions', () => ({
  getRecentVisits: vi.fn(),
}));

const getRecentVisitsMock = vi.mocked(getRecentVisits);

const mockVisits = [
  {
    id: 1,
    title: 'Routine Check-up',
    content: 'General wellness check.',
    createdAt: new Date('2024-01-10T10:00:00Z'),
    updatedAt: new Date('2024-01-10T10:00:00Z'),
    userId: 1,
  },
  {
    id: 2,
    title: 'Lab Results Review',
    content: 'Discuss lab findings.',
    createdAt: new Date('2024-02-05T15:30:00Z'),
    updatedAt: new Date('2024-02-05T15:30:00Z'),
    userId: 2,
  },
];

describe('Home page', () => {
  beforeEach(() => {
    getRecentVisitsMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the empty visits fallback when there are no visits', async () => {
    getRecentVisitsMock.mockResolvedValueOnce([]);

    const page = await Home();
    render(page);

    expect(getRecentVisitsMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/no visits yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /schedule your first visit/i }),
    ).toBeInTheDocument();
  });

  it('renders visit preview cards when visits are returned', async () => {
    getRecentVisitsMock.mockResolvedValueOnce(mockVisits);

    const page = await Home();
    render(page);

    expect(getRecentVisitsMock).toHaveBeenCalledTimes(1);

    const routineVisitLink = screen.getByRole('link', {
      name: /routine check-up/i,
    });
    expect(routineVisitLink).toHaveAttribute('href', '/visits/1');
    expect(screen.getByText('General wellness check.')).toBeInTheDocument();
    expect(screen.getByText('January 10, 2024')).toBeInTheDocument();

    const labVisitLink = screen.getByRole('link', {
      name: /lab results review/i,
    });
    expect(labVisitLink).toHaveAttribute('href', '/visits/2');
    expect(screen.getByText('Discuss lab findings.')).toBeInTheDocument();
    expect(screen.getByText('February 5, 2024')).toBeInTheDocument();

    expect(screen.queryByText(/no visits yet/i)).not.toBeInTheDocument();
  });
});
