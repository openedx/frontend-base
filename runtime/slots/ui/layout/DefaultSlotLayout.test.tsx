import { render } from '@testing-library/react';
import { useWidgets } from '../widget/hooks';
import DefaultSlotLayout from './DefaultSlotLayout';

// Mock the useWidgets hook
jest.mock('../widget/hooks', () => ({
  useWidgets: jest.fn(),
}));

describe('DefaultSlotLayout', () => {
  it('renders widgets returned by useWidgets hook', () => {
    const mockWidgets = [
      <div key="widget1">Widget One</div>,
      <div key="widget2">Widget Two</div>,
    ];
    (useWidgets as jest.Mock).mockReturnValue(mockWidgets);

    const { getByText } = render(<DefaultSlotLayout />);

    expect(getByText('Widget One')).toBeInTheDocument();
    expect(getByText('Widget Two')).toBeInTheDocument();
  });

  it('renders empty when no widgets are returned', () => {
    (useWidgets as jest.Mock).mockReturnValue([]);

    const { container } = render(<DefaultSlotLayout />);

    expect(container).toBeEmptyDOMElement();
  });
});
