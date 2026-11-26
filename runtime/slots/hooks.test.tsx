import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { getSiteConfig, setSiteConfig } from '../config';
import { useSlotOperations } from './hooks';
import SlotContext from './SlotContext';
import { WidgetOperationTypes } from './widget';

const enclosingSlotId = 'enclosing-slot.ui';
const otherSlotId = 'other-slot.ui';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <SlotContext.Provider value={{ id: enclosingSlotId, idAliases: ['enclosing-alias.ui'], children: <div>Default content</div> }}>
      {children}
    </SlotContext.Provider>
  );
}

describe('useSlotOperations', () => {
  beforeEach(() => {
    setSiteConfig({
      ...getSiteConfig(),
      apps: [{
        appId: 'test-app',
        slots: [
          { slotId: 'enclosing-alias.ui', op: WidgetOperationTypes.APPEND, id: 'alias-widget', element: <div>Alias</div> },
          { slotId: otherSlotId, op: WidgetOperationTypes.APPEND, id: 'other-widget', element: <div>Other</div> },
        ],
      }],
    });
  });

  afterEach(() => {
    setSiteConfig({ ...getSiteConfig(), apps: [] });
  });

  it('includes the default content and aliases of the enclosing slot when asked for it', () => {
    const { result } = renderHook(() => useSlotOperations(enclosingSlotId), { wrapper });
    expect(result.current.map(operation => 'id' in operation && operation.id)).toEqual(['defaultContent', 'alias-widget']);
  });

  it('ignores the default content and aliases of the enclosing slot when asked for another slot', () => {
    const { result } = renderHook(() => useSlotOperations(otherSlotId), { wrapper });
    expect(result.current.map(operation => 'id' in operation && operation.id)).toEqual(['other-widget']);
  });
});
