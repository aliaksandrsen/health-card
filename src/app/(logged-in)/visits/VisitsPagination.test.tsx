import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { VisitsPagination } from './VisitsPagination';

describe('VisitsPagination', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders page links and next navigation for the first page', () => {
    render(<VisitsPagination currentPage={1} totalPages={5} />);

    expect(
      screen.queryByLabelText(/go to previous page/i),
    ).not.toBeInTheDocument();

    const nextLink = screen.getByLabelText(/go to next page/i);
    expect(nextLink).toHaveAttribute('href', '/visits?page=2');

    Array.from({ length: 5 }, (_, index) => index + 1).forEach((pageNumber) => {
      const pageLink = screen.getByRole('link', { name: String(pageNumber) });
      expect(pageLink).toHaveAttribute('href', `/visits?page=${pageNumber}`);
    });

    const activePageLink = screen.getByRole('link', { name: '1' });
    expect(activePageLink).toHaveAttribute('aria-current', 'page');
  });
});
