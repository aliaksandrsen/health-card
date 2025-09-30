import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { VisitPreviewCard } from './VisitPreviewCard';

const mockVisit = {
  id: 42,
  title: 'Follow-up appointment',
  content: 'Discuss test results and adjust medication.',
  createdAt: new Date(2024, 0, 15),
};

afterEach(() => {
  cleanup();
});

describe('VisitPreviewCard', () => {
  it('renders visit details with the default link', () => {
    render(<VisitPreviewCard visit={mockVisit} />);

    const link = screen.getByRole('link', {
      name: /follow-up appointment/i,
    });

    expect(link).toHaveAttribute('href', `/visits/${mockVisit.id}`);

    expect(within(link).getByText(`January 15, 2024`)).toBeInTheDocument();
    expect(within(link).getByText(mockVisit.content)).toBeInTheDocument();
  });

  it('uses an override href and tolerates empty content', () => {
    render(
      <VisitPreviewCard
        visit={{ ...mockVisit, content: null }}
        href="/visits/custom"
      />,
    );

    const link = screen.getByRole('link', {
      name: /follow-up appointment/i,
    });

    expect(link).toHaveAttribute('href', '/visits/custom');
  });
});
