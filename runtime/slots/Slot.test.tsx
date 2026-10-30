import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useContext } from 'react';
import { useLayoutForSlotId } from './layout/hooks';
import Slot from './Slot';
import SlotContext from './SlotContext';
import { getSiteConfig, setSiteConfig } from '../config';
import { SlotOperation, useWidgetOptions, WidgetOperationTypes } from '.';

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

function AliasedWidget() {
  const { label } = useWidgetOptions();
  return <div>{typeof label === 'string' ? label : 'Aliased'}</div>;
}

describe('Slot component with operations targeting a widget id alias', () => {
  const slotId = 'new-slot.ui';
  const widgets: SlotOperation[] = [
    { slotId, op: WidgetOperationTypes.APPEND, id: 'aliased-widget', idAliases: ['widget-alias'], component: AliasedWidget },
    { slotId, op: WidgetOperationTypes.APPEND, id: 'other-widget', element: <div>Other</div> },
  ];

  beforeEach(() => {
    (useLayoutForSlotId as jest.Mock).mockReturnValue(null);
  });

  afterEach(() => {
    setSiteConfig({ ...getSiteConfig(), apps: [] });
  });

  async function renderSlotWith(operation: SlotOperation) {
    setSiteConfig({
      ...getSiteConfig(),
      apps: [{ appId: 'test-app', slots: [...widgets, operation] }],
    });
    const { container, findByText } = render(<MemoryRouter><TestSlot /></MemoryRouter>);
    await findByText('Other');
    return container;
  }

  function renderedWidgetTexts(container: HTMLElement) {
    return Array.from(container.querySelectorAll('div')).map(div => div.textContent);
  }

  it('INSERT_AFTER places the widget after the aliased widget', async () => {
    const container = await renderSlotWith({ slotId, op: WidgetOperationTypes.INSERT_AFTER, id: 'inserted', relatedId: 'widget-alias', element: <div>Inserted</div> });
    expect(renderedWidgetTexts(container)).toEqual(['Aliased', 'Inserted', 'Other']);
  });

  it('INSERT_BEFORE places the widget before the aliased widget', async () => {
    const container = await renderSlotWith({ slotId, op: WidgetOperationTypes.INSERT_BEFORE, id: 'inserted', relatedId: 'widget-alias', element: <div>Inserted</div> });
    expect(renderedWidgetTexts(container)).toEqual(['Inserted', 'Aliased', 'Other']);
  });

  it('REPLACE renders the widget in place of the aliased widget', async () => {
    const container = await renderSlotWith({ slotId, op: WidgetOperationTypes.REPLACE, id: 'replacement', relatedId: 'widget-alias', element: <div>Replacement</div> });
    expect(renderedWidgetTexts(container)).toEqual(['Replacement', 'Other']);
  });

  it('REMOVE drops the aliased widget', async () => {
    const container = await renderSlotWith({ slotId, op: WidgetOperationTypes.REMOVE, relatedId: 'widget-alias' });
    expect(renderedWidgetTexts(container)).toEqual(['Other']);
  });

  it('OPTIONS reaches the aliased widget through useWidgetOptions', async () => {
    const container = await renderSlotWith({ slotId, op: WidgetOperationTypes.OPTIONS, relatedId: 'widget-alias', options: { label: 'From alias' } });
    expect(renderedWidgetTexts(container)).toEqual(['From alias', 'Other']);
  });
});
