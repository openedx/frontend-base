import { renderHook } from '@testing-library/react-hooks';
import { useOperations } from '../../hooks';
import * as uiHooks from '../hooks';
import { UiOperation } from '../types';
import * as uiUtils from '../utils';
import { WidgetAppendOperation, WidgetOperationTypes } from '../widget';
import { useLayoutForSlotId, useLayoutOptions, useLayoutOptionsForId } from './hooks';
import { LayoutOperationTypes, LayoutReplaceOperation } from './types';

jest.mock('../../hooks'); // mocks the useOperations hook

function MockLayout() {
  return (
    <div>Mock Component</div>
  );
}

describe('useLayoutForSlotId', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return null when no replace layout operations are provided', () => {
    (useOperations as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useLayoutForSlotId('test-slot.ui'));
    expect(result.current).toBeNull();
  });

  it('should return a layout component when replace layout operation is present', () => {
    const operation: LayoutReplaceOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
      component: MockLayout
    };

    (useOperations as jest.Mock).mockReturnValue([operation]);
    const { result } = renderHook(() => useLayoutForSlotId('test-slot.ui'));
    expect(result.current).toEqual(MockLayout);
  });

  it('should return null if the slot is not a ui slot', () => {
    const operation: LayoutReplaceOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
      component: MockLayout
    };
    jest.spyOn(uiUtils, 'isUiSlot').mockReturnValue(false);
    (useOperations as jest.Mock).mockReturnValue([operation]);
    const { result } = renderHook(() => useLayoutForSlotId('test-slot.ui'));
    expect(result.current).toBeNull();
  });

  it('should return null if the operation is not a UiOperation', () => {
    const operation: LayoutReplaceOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
      component: MockLayout
    };

    jest.spyOn(uiUtils, 'isUiOperation').mockReturnValue(false);
    (useOperations as jest.Mock).mockReturnValue([operation]);
    const { result } = renderHook(() => useLayoutForSlotId('test-slot.ui'));
    expect(result.current).toBeNull();
  });

  it('should return null if the operation condition is not satisfied', () => {
    const operation: LayoutReplaceOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
      component: MockLayout
    };

    jest.spyOn(uiUtils, 'isUiOperationConditionSatisfied').mockReturnValue(false);
    (useOperations as jest.Mock).mockReturnValue([operation]);
    const { result } = renderHook(() => useLayoutForSlotId('test-slot.ui'));
    expect(result.current).toBeNull();
  });

  it('should return a layout element when replace layout operation is present', () => {
    const operation: LayoutReplaceOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
      element: <div>Mock layout</div>
    };

    // @ts-expect-error This is an intentionally malformed operation to test what happens when component/element are not present.
    const malformedOperation: UiOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
    };

    const unrelatedOperation: WidgetAppendOperation = {
      slotId: 'test-slot.ui',
      id: 'test-slot.widget1',
      op: WidgetOperationTypes.APPEND,
      element: <div>Widget</div>
    };

    (useOperations as jest.Mock).mockReturnValue([operation, malformedOperation, unrelatedOperation]);
    const { result } = renderHook(() => useLayoutForSlotId('test-slot.ui'));
    expect(result.current).toEqual(<div>Mock layout</div>);
  });

  it('should return the last layout component in the operations list', () => {
    const SecondMockLayout = () => <div>First Component</div>;

    const operation1: LayoutReplaceOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
      component: MockLayout
    };

    const operation2: LayoutReplaceOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
      component: SecondMockLayout
    };

    (useOperations as jest.Mock).mockReturnValue([operation1, operation2]);
    const { result } = renderHook(() => useLayoutForSlotId('test-slot.ui'));
    expect(result.current).toEqual(SecondMockLayout);
  });
});

describe('useLayoutOptionsForId', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return an empty object whent here are no layout options operations', () => {
    (useOperations as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useLayoutOptionsForId('test-slot.ui'));
    expect(result.current).toEqual({});
  });

  it('should return an object containing options from a single layout options operation', () => {
    const mockOptions = { option1: 'value1' };
    const operation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.OPTIONS,
      options: mockOptions
    };

    const otherOperation: LayoutReplaceOperation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.REPLACE,
      element: <div>Layout</div>
    };

    (useOperations as jest.Mock).mockReturnValue([operation, otherOperation]);
    const { result } = renderHook(() => useLayoutOptionsForId('test-slot.ui'));
    expect(result.current).toEqual(mockOptions);
  });

  describe('when various failure conditions are true', () => {
    const mockOptions = { option1: 'value1' };
    const operation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.OPTIONS,
      options: mockOptions
    };

    it('should return an empty object if the slot is not a UI slot.', () => {
      jest.spyOn(uiUtils, 'isUiSlot').mockReturnValue(false);
      (useOperations as jest.Mock).mockReturnValue([operation]);
      const { result } = renderHook(() => useLayoutOptionsForId('test-slot.ui'));
      expect(result.current).toEqual({});
    });

    it('should return an empty object if the operation is not a UiOperation.', () => {
      jest.spyOn(uiUtils, 'isUiOperation').mockReturnValue(false);
      (useOperations as jest.Mock).mockReturnValue([operation]);
      const { result } = renderHook(() => useLayoutOptionsForId('test-slot.ui'));
      expect(result.current).toEqual({});
    });

    it('should return an empty object if the operation condition is not satisfied.', () => {
      jest.spyOn(uiUtils, 'isUiOperationConditionSatisfied').mockReturnValue(false);
      (useOperations as jest.Mock).mockReturnValue([operation]);
      const { result } = renderHook(() => useLayoutOptionsForId('test-slot.ui'));
      expect(result.current).toEqual({});
    });
  });

  it('should return merged layout options from multiple operations', () => {
    const mockOptions1 = { option1: 'value1', optionOverride: 'foo', };
    const mockOptions2 = { option2: 'value2', optionOverride: 'bar' };
    const operation1 = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.OPTIONS,
      options: mockOptions1
    };
    const operation2 = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.OPTIONS,
      options: mockOptions2
    };

    (useOperations as jest.Mock).mockReturnValue([operation1, operation2]);
    const { result } = renderHook(() => useLayoutOptionsForId('test-slot.ui'));
    expect(result.current).toEqual({ option1: 'value1', option2: 'value2', optionOverride: 'bar' });
  });
});

describe('useLayoutOptions', () => {
  it('should call useLayoutOptionsForId with the correct id ', () => {
    const mockOptions1 = { option1: 'value1' };
    const operation = {
      slotId: 'test-slot.ui',
      op: LayoutOperationTypes.OPTIONS,
      options: mockOptions1
    };
    (useOperations as jest.Mock).mockReturnValue([operation]);
    jest.spyOn(uiHooks, 'useSlotContext').mockReturnValue({ id: 'test-slot.ui' });
    const { result } = renderHook(() => useLayoutOptions());
    expect(result.current).toEqual({ option1: 'value1' });
  });
});
