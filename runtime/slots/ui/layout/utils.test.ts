import { UiOperation } from '../types';
import { WidgetOperationTypes } from '../widget';
import { LayoutOperationTypes } from './types';
import { isLayoutOperation, isLayoutOptionsOperation, isLayoutReplaceOperation } from './utils';

describe('UI Layout Operation utilities', () => {
  describe('isLayoutOperation', () => {
    it('should return true for valid LayoutOperation', () => {
      const operation: UiOperation = {
        slotId: 'mock.slot.ui',
        op: LayoutOperationTypes.OPTIONS,
        options: {},
      };
      expect(isLayoutOperation(operation)).toBe(true);
    });

    it('should return false for invalid LayoutOperation', () => {
      const operation: UiOperation = {
        slotId: 'mock.slot.ui',
        op: WidgetOperationTypes.APPEND,
        id: 'mock.slot.widget',
        element: '',
      };
      expect(isLayoutOperation(operation)).toBe(false);
    });
  });

  describe('isLayoutOptionsOperation', () => {
    it('should return true for valid LayoutOptionsOperation', () => {
      const operation: UiOperation = {
        slotId: 'mock.slot.ui',
        op: LayoutOperationTypes.OPTIONS,
        options: {},
      };
      expect(isLayoutOptionsOperation(operation)).toBe(true);
    });

    it('should return false for invalid LayoutOptionsOperation', () => {
      const operation: UiOperation = {
        slotId: 'mock.slot.ui',
        op: LayoutOperationTypes.REPLACE,
        element: '',
      };
      expect(isLayoutOptionsOperation(operation)).toBe(false);
    });
  });

  describe('isLayoutReplaceOperation', () => {
    it('should return true for valid LayoutReplaceOperation', () => {
      const operation: UiOperation = {
        slotId: 'mock.slot.ui',
        op: LayoutOperationTypes.REPLACE,
        element: '',
      };
      expect(isLayoutReplaceOperation(operation)).toBe(true);
    });

    it('should return false for invalid LayoutReplaceOperation', () => {
      const operation: UiOperation = {
        slotId: 'mock.slot.ui',
        op: LayoutOperationTypes.OPTIONS,
        options: {},
      };
      expect(isLayoutReplaceOperation(operation)).toBe(false);
    });
  });
});
