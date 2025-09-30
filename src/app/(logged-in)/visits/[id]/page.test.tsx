import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getVisit } from '../actions';
import Visit from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('../actions', () => ({
  getVisit: vi.fn(),
  deleteVisit: vi.fn(),
}));

const mockedNotFound = vi.mocked(notFound);
const mockedGetVisit = vi.mocked(getVisit);

const visitProps = (id: string) =>
  ({ params: Promise.resolve({ id }) }) as Parameters<typeof Visit>[0];

const renderVisit = async (id: string) => render(await Visit(visitProps(id)));

describe('Visit page', () => {
  beforeEach(() => {
    mockedGetVisit.mockResolvedValue({
      id: 5,
      title: 'Follow-up Visit',
      content: 'Discuss upcoming lab results.',
      userId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders visit details when the visit exists', async () => {
    await renderVisit('5');

    expect(mockedGetVisit).toHaveBeenCalledWith(5);
    expect(screen.getByText('Follow-up Visit')).toBeInTheDocument();
    expect(
      screen.getByText('Discuss upcoming lab results.'),
    ).toBeInTheDocument();
  });

  it('throws notFound when the visit cannot be retrieved', async () => {
    mockedGetVisit.mockResolvedValueOnce(null);
    mockedNotFound.mockImplementation(() => {
      throw new Error('Not Found');
    });

    await expect(Visit(visitProps('404'))).rejects.toThrow('Not Found');
  });
});
