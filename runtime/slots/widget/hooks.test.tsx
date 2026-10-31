import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import * as slotHooks from '../hooks';
import { useSortedWidgetOperations, useWidgetOptions, useWidgetOptionsForId } from './hooks';
import { WidgetInsertAfterOperation, WidgetInsertBeforeOperation, WidgetOperationTypes, WidgetOptionsOperation } from './types';
import WidgetContext from './WidgetContext';

jest.mock('../hooks'); // mocks the useSlotOperations hook

const slotId = 'test-slot.ui';

describe('useSortedWidgetOperations', () => {
  // The widget is declared under its new id with the old id as an alias.
  const declaresWidget: WidgetInsertAfterOperation = {
    slotId,
    op: WidgetOperationTypes.INSERT_AFTER,
    id: 'new-widget',
    idAliases: ['old-widget'],
    relatedId: 'anchor',
    element: <div>New</div>,
  };
  const insertAfterAlias: WidgetInsertAfterOperation = { slotId, op: WidgetOperationTypes.INSERT_AFTER, id: 'after-alias', relatedId: 'old-widget', element: <div /> };
  const insertBeforeAlias: WidgetInsertBeforeOperation = { slotId, op: WidgetOperationTypes.INSERT_BEFORE, id: 'before-alias', relatedId: 'old-widget', element: <div /> };
  const insertAfterId: WidgetInsertAfterOperation = { slotId, op: WidgetOperationTypes.INSERT_AFTER, id: 'after-id', relatedId: 'new-widget', element: <div /> };
  const insertBeforeId: WidgetInsertBeforeOperation = { slotId, op: WidgetOperationTypes.INSERT_BEFORE, id: 'before-id', relatedId: 'new-widget', element: <div /> };
  const targetingWidget = [insertAfterAlias, insertBeforeAlias, insertAfterId, insertBeforeId];

  it('sorts INSERT_AFTER and INSERT_BEFORE targeting the alias or the id after the operation declaring the widget', () => {
    (slotHooks.useSlotOperations as jest.Mock).mockReturnValue([...targetingWidget, declaresWidget]);
    const { result } = renderHook(() => useSortedWidgetOperations(slotId));
    expect(result.current).toEqual([declaresWidget, ...targetingWidget]);
  });

  it('keeps declaration order among operations targeting the alias and the id, as with one shared relatedId', () => {
    const reversed = [...targetingWidget].reverse();
    (slotHooks.useSlotOperations as jest.Mock).mockReturnValue([...reversed, declaresWidget]);
    const { result } = renderHook(() => useSortedWidgetOperations(slotId));
    expect(result.current).toEqual([declaresWidget, ...reversed]);
  });
});

describe('useWidgetOptionsForId', () => {
  const forAlias: WidgetOptionsOperation = { slotId, op: WidgetOperationTypes.OPTIONS, relatedId: 'old-widget', options: { fromAlias: true } };
  const forId: WidgetOptionsOperation = { slotId, op: WidgetOperationTypes.OPTIONS, relatedId: 'new-widget', options: { fromId: true } };
  const forOther: WidgetOptionsOperation = { slotId, op: WidgetOperationTypes.OPTIONS, relatedId: 'other-widget', options: { fromOther: true } };

  beforeEach(() => {
    (slotHooks.useSlotOperations as jest.Mock).mockReturnValue([forAlias, forId, forOther]);
  });

  it('merges OPTIONS declared against the id and against an alias', () => {
    const { result } = renderHook(() => useWidgetOptionsForId(slotId, 'new-widget', ['old-widget']));
    expect(result.current).toEqual({ fromAlias: true, fromId: true });
  });

  it('merges only OPTIONS declared against the id when there are no aliases', () => {
    const { result } = renderHook(() => useWidgetOptionsForId(slotId, 'new-widget'));
    expect(result.current).toEqual({ fromId: true });
  });
});

describe('useWidgetOptions', () => {
  it('merges OPTIONS against the widget id and the aliases read from WidgetContext', () => {
    const forAlias: WidgetOptionsOperation = { slotId, op: WidgetOperationTypes.OPTIONS, relatedId: 'old-widget', options: { fromAlias: true } };
    const forId: WidgetOptionsOperation = { slotId, op: WidgetOperationTypes.OPTIONS, relatedId: 'new-widget', options: { fromId: true } };
    (slotHooks.useSlotOperations as jest.Mock).mockReturnValue([forAlias, forId]);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <WidgetContext.Provider value={{ slotId, widgetId: 'new-widget', widgetIdAliases: ['old-widget'] }}>
        {children}
      </WidgetContext.Provider>
    );
    const { result } = renderHook(() => useWidgetOptions(), { wrapper });
    expect(result.current).toEqual({ fromAlias: true, fromId: true });
  });
});
