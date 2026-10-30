import React from 'react';
import { WidgetAppendOperation, WidgetList, WidgetOperation, WidgetOperationTypes } from './types';
import { createWidgets } from './utils';

// Mock WidgetProvider to just render children, avoiding context dependencies.
jest.mock('./WidgetProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const slotId = 'test-slot';

function identifiedIds(widgets: WidgetList) {
  return widgets.identified.map(w => w.id);
}

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

  describe('identified', () => {
    it('exposes the underlying IdentifiedWidget array', () => {
      const widgets = createWidgets([
        makeAppendOp('w1', 'One', 'sidebar'),
        makeAppendOp('w2', 'Two', 'main'),
        makeAppendOp('w3', 'Three'),
      ]);

      expect(widgets.identified).toHaveLength(3);
      expect(widgets.identified[0]).toEqual(
        expect.objectContaining({ id: 'w1', role: 'sidebar' })
      );
      expect(widgets.identified[1]).toEqual(
        expect.objectContaining({ id: 'w2', role: 'main' })
      );
      expect(widgets.identified[2]).toEqual(
        expect.objectContaining({ id: 'w3', role: undefined })
      );
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

  describe('operations targeting a widget id alias', () => {
    const aliasedWidget: WidgetAppendOperation = { slotId, op: WidgetOperationTypes.APPEND, id: 'aliased-widget', idAliases: ['widget-alias'], element: <div>Aliased</div> };
    const otherWidget: WidgetAppendOperation = { slotId, op: WidgetOperationTypes.APPEND, id: 'other-widget', element: <div>Other</div> };

    function applyToAliasedWidgets(operation: WidgetOperation) {
      return createWidgets([aliasedWidget, otherWidget, operation]);
    }

    it('INSERT_AFTER places the widget after the aliased widget', () => {
      const widgets = applyToAliasedWidgets({ slotId, op: WidgetOperationTypes.INSERT_AFTER, id: 'inserted', relatedId: 'widget-alias', element: <div /> });
      expect(identifiedIds(widgets)).toEqual(['aliased-widget', 'inserted', 'other-widget']);
    });

    it('INSERT_BEFORE places the widget before the aliased widget', () => {
      const widgets = applyToAliasedWidgets({ slotId, op: WidgetOperationTypes.INSERT_BEFORE, id: 'inserted', relatedId: 'widget-alias', element: <div /> });
      expect(identifiedIds(widgets)).toEqual(['inserted', 'aliased-widget', 'other-widget']);
    });

    it('REPLACE puts the widget in place of the aliased widget', () => {
      const widgets = applyToAliasedWidgets({ slotId, op: WidgetOperationTypes.REPLACE, id: 'replacement', relatedId: 'widget-alias', element: <div /> });
      expect(identifiedIds(widgets)).toEqual(['replacement', 'other-widget']);
    });

    it('REMOVE drops the aliased widget', () => {
      const widgets = applyToAliasedWidgets({ slotId, op: WidgetOperationTypes.REMOVE, relatedId: 'widget-alias' });
      expect(identifiedIds(widgets)).toEqual(['other-widget']);
    });

    it('REMOVE targeting the current id still drops the aliased widget', () => {
      const widgets = applyToAliasedWidgets({ slotId, op: WidgetOperationTypes.REMOVE, relatedId: 'aliased-widget' });
      expect(identifiedIds(widgets)).toEqual(['other-widget']);
    });

    it('INSERT_AFTER targeting neither the id nor the alias adds nothing', () => {
      const widgets = applyToAliasedWidgets({ slotId, op: WidgetOperationTypes.INSERT_AFTER, id: 'inserted', relatedId: 'unknown-widget', element: <div /> });
      expect(identifiedIds(widgets)).toEqual(['aliased-widget', 'other-widget']);
    });

    it('byId and withoutId match the alias', () => {
      const widgets = createWidgets([aliasedWidget, otherWidget]);
      expect(widgets.byId('widget-alias')).toHaveLength(1);
      expect(widgets.withoutId('widget-alias')).toHaveLength(1);
    });

    it('exposes idAliases on the identified widget', () => {
      const widgets = createWidgets([aliasedWidget, otherWidget]);
      expect(widgets.identified[0]).toEqual(
        expect.objectContaining({ id: 'aliased-widget', idAliases: ['widget-alias'] })
      );
    });
  });

  describe('an id and an alias matching the same relatedId', () => {
    const widgetWithId: WidgetAppendOperation = { slotId, op: WidgetOperationTypes.APPEND, id: 'shared', element: <div>Id</div> };
    const widgetWithAlias: WidgetAppendOperation = { slotId, op: WidgetOperationTypes.APPEND, id: 'aliased', idAliases: ['shared'], element: <div>Alias</div> };
    const removeShared: WidgetOperation = { slotId, op: WidgetOperationTypes.REMOVE, relatedId: 'shared' };

    it('REMOVE drops the widget with the id when it is listed first', () => {
      const widgets = createWidgets([widgetWithId, widgetWithAlias, removeShared]);
      expect(identifiedIds(widgets)).toEqual(['aliased']);
    });

    it('REMOVE drops the widget with the alias when it is listed first', () => {
      const widgets = createWidgets([widgetWithAlias, widgetWithId, removeShared]);
      expect(identifiedIds(widgets)).toEqual(['shared']);
    });
  });
});
