import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VisitNotFound from './not-found';

describe('VisitNotFound', () => {
  it('renders the messaging and actions', () => {
    render(<VisitNotFound />);

    const heading = screen.getByText('Visit Not Found');
    const missingVisitMessage = screen.getByText(
      /we looked everywhere but couldn't locate the visit you're trying to view/i,
    );
    const guidanceMessage = screen.getByText(
      /double-check the url or return to the visits overview/i,
    );

    expect(heading).toBeInTheDocument();
    expect(missingVisitMessage).toBeInTheDocument();
    expect(guidanceMessage).toBeInTheDocument();

    const backLink = screen.getByRole('link', { name: /back to visits/i });
    expect(backLink).toHaveAttribute('href', '/visits');

    const createLink = screen.getByRole('link', {
      name: /create new visit/i,
    });
    expect(createLink).toHaveAttribute('href', '/visits/new');
  });
});
