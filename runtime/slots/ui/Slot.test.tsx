import { render } from '@testing-library/react';
import { useContext } from 'react';
import { useLayoutForSlotId } from './layout/hooks';
import Slot from './Slot';
import SlotContext from './SlotContext';

jest.mock('./layout/hooks');

describe('Slot component', () => {
  it('renders with default layout', () => {
    (useLayoutForSlotId as jest.Mock).mockReturnValue(null);
    const { container } = render(<Slot id="test-slot.ui" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('successfully passes the slot ID through a SlotContext', () => {
    function IdPrintingLayout() {
      const { id } = useContext(SlotContext);
      return <div>Slot ID: {id}</div>;
    }
    (useLayoutForSlotId as jest.Mock).mockReturnValue(IdPrintingLayout);
    const { getByText } = render(<Slot id="test-slot.ui" />);
    expect(getByText('Slot ID: test-slot.ui')).toBeInTheDocument();
  });

  it('renders with a component override layout', () => {
    const CustomLayoutComponent = () => <div>Custom Layout Component</div>;
    (useLayoutForSlotId as jest.Mock).mockReturnValue(CustomLayoutComponent);
    const { getByText } = render(<Slot id="test-slot.ui" />);
    expect(getByText('Custom Layout Component')).toBeInTheDocument();
  });

  it('renders with an element override layout', () => {
    const CustomLayoutElement = <div>Custom Layout Element</div>;
    (useLayoutForSlotId as jest.Mock).mockReturnValue(null);
    const { getByText } = render(<Slot id="test-slot.ui" layout={CustomLayoutElement} />);
    expect(getByText('Custom Layout Element')).toBeInTheDocument();
  });
});
