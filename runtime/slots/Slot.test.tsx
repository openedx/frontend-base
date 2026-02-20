import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useContext } from 'react';
import { useLayoutForSlotId } from './layout/hooks';
import Slot from './Slot';
import SlotContext from './SlotContext';
import { getSiteConfig, setSiteConfig } from '../config';
import { WidgetOperationTypes } from '.';

jest.mock('./layout/hooks');

describe('Slot component', () => {
  it('renders with default layout', () => {
    (useLayoutForSlotId as jest.Mock).mockReturnValue(null);
    const { container } = render(<MemoryRouter><Slot id="test-slot.ui" /></MemoryRouter>);
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

const TestSlot = () => <Slot id="new-slot.ui" idAliases={['old-slot.ui']} />;

describe('Slot component with site config operations', () => {
  beforeEach(() => {
    (useLayoutForSlotId as jest.Mock).mockReturnValue(null);
  });

  afterEach(() => {
    setSiteConfig({ ...getSiteConfig(), apps: [] });
  });

  it('renders widgets configured under the primary slot id', async () => {
    setSiteConfig({
      ...getSiteConfig(),
      apps: [{ appId: 'test-app', slots: [{ slotId: 'new-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget1', element: <div>Primary Widget</div> }] }],
    });
    const { findByText } = render(<MemoryRouter><TestSlot /></MemoryRouter>);
    await findByText('Primary Widget');
  });

  it('renders widgets configured under an alias slot id', async () => {
    setSiteConfig({
      ...getSiteConfig(),
      apps: [{ appId: 'test-app', slots: [{ slotId: 'old-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget1', element: <div>Alias Widget</div> }] }],
    });
    const { findByText } = render(<MemoryRouter><TestSlot /></MemoryRouter>);
    await findByText('Alias Widget');
  });
});
