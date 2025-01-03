import { getConfig } from '../config';
import { SlotOperation } from './types';
import { WidgetOperationTypes } from './ui';
import { getSlotOperations } from './utils';

jest.mock('../config');

describe('getSlotOperations', () => {
  it('should return an empty array if no apps are configured', () => {
    (getConfig as jest.Mock).mockReturnValue({ apps: [] });
    const result = getSlotOperations('test-slot.ui');
    expect(result).toEqual([]);
  });

  it('should return an empty array if no slots are present in apps', () => {
    (getConfig as jest.Mock).mockReturnValue({ apps: [{ slots: [] }] });
    const result = getSlotOperations('test-slot.ui');
    expect(result).toEqual([]);
  });

  it('should return an empty array if no matching slotId is found', () => {
    const mockSlots: SlotOperation[] = [{ slotId: 'other-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget1', element: '' }];
    (getConfig as jest.Mock).mockReturnValue({ apps: [{ slots: mockSlots }] });
    const result = getSlotOperations('test-slot.ui');
    expect(result).toEqual([]);
  });

  it('should return the correct slot operations for a given slotId', () => {
    const mockSlots: SlotOperation[] = [
      { slotId: 'test-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget1', element: '' },
      { slotId: 'test-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget2', element: '' },
      { slotId: 'other-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget3', element: '' },
    ];
    (getConfig as jest.Mock).mockReturnValue({ apps: [{ slots: mockSlots }] });
    const result = getSlotOperations('test-slot.ui');
    expect(result).toEqual([
      { slotId: 'test-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget1', element: '' },
      { slotId: 'test-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget2', element: '' },
    ]);
  });

  it('should handle multiple apps with slots correctly', () => {
    (getConfig as jest.Mock).mockReturnValue({
      apps: [
        {
          slots: [
            { slotId: 'test-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget1', element: '' },
          ]
        },
        {
          slots: [
            { slotId: 'test-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget2', element: '' },
            { slotId: 'other-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget3', element: '' },
          ]
        }
      ]
    });
    const result = getSlotOperations('test-slot.ui');
    expect(result).toEqual([
      { slotId: 'test-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget1', element: '' },
      { slotId: 'test-slot.ui', op: WidgetOperationTypes.APPEND, id: 'widget2', element: '' },
    ]);
  });
});
