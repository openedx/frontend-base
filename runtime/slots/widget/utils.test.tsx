import React from 'react';
import { WidgetOperationTypes } from './types';
import { createWidgets } from './utils';

// Mock WidgetProvider to just render children, avoiding context dependencies.
jest.mock('./WidgetProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock condition checking to always pass.
jest.mock('../utils', () => ({
  isSlotOperationConditionSatisfied: () => true,
}));

const slotId = 'test-slot';

function makeAppendOp(id: string, label: string, role?: string) {
  return {
    slotId,
    id,
    role,
    op: WidgetOperationTypes.APPEND as const,
    element: <div>{label}</div>,
  };
}

describe('createWidgets', () => {
  it('returns a renderable ReactNode array', () => {
    const widgets = createWidgets([
      makeAppendOp('w1', 'One'),
      makeAppendOp('w2', 'Two'),
    ]);

    expect(widgets).toHaveLength(2);
    expect(Array.isArray(widgets)).toBe(true);
  });

  describe('byId', () => {
    it('returns only widgets matching the given ID', () => {
      const widgets = createWidgets([
        makeAppendOp('w1', 'One'),
        makeAppendOp('w2', 'Two'),
        makeAppendOp('w3', 'Three'),
      ]);

      const result = widgets.byId('w2');
      expect(result).toHaveLength(1);
    });

    it('returns empty array when no widgets match', () => {
      const widgets = createWidgets([
        makeAppendOp('w1', 'One'),
      ]);

      expect(widgets.byId('nonexistent')).toHaveLength(0);
    });
  });

  describe('withoutId', () => {
    it('returns all widgets except the given ID', () => {
      const widgets = createWidgets([
        makeAppendOp('w1', 'One'),
        makeAppendOp('w2', 'Two'),
        makeAppendOp('w3', 'Three'),
      ]);

      const result = widgets.withoutId('w2');
      expect(result).toHaveLength(2);
    });
  });

  describe('byRole', () => {
    it('returns only widgets matching the given role', () => {
      const widgets = createWidgets([
        makeAppendOp('w1', 'One', 'sidebar'),
        makeAppendOp('w2', 'Two', 'main'),
        makeAppendOp('w3', 'Three', 'sidebar'),
      ]);

      const result = widgets.byRole('sidebar');
      expect(result).toHaveLength(2);
    });

    it('does not include widgets without a role', () => {
      const widgets = createWidgets([
        makeAppendOp('w1', 'One', 'sidebar'),
        makeAppendOp('w2', 'Two'),
      ]);

      expect(widgets.byRole('sidebar')).toHaveLength(1);
    });
  });

  describe('withoutRole', () => {
    it('returns all widgets except those with the given role', () => {
      const widgets = createWidgets([
        makeAppendOp('w1', 'One', 'sidebar'),
        makeAppendOp('w2', 'Two', 'main'),
        makeAppendOp('w3', 'Three', 'sidebar'),
      ]);

      const result = widgets.withoutRole('sidebar');
      expect(result).toHaveLength(1);
    });

    it('includes widgets without a role', () => {
      const widgets = createWidgets([
        makeAppendOp('w1', 'One', 'sidebar'),
        makeAppendOp('w2', 'Two'),
      ]);

      expect(widgets.withoutRole('sidebar')).toHaveLength(1);
    });
  });
});
