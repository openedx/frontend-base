/* eslint react/prop-types: off */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import {
  getConfigSlots, organizePlugins,
  wrapComponent
} from './utils';

import { InsertPlugin, PluginChange, PluginContainerIframeConfig, PluginOperationTypes, PluginTypes, WrapPlugin } from '../../../types';

const mockModifyWidget = (widget) => {
  const modifiedWidget = widget;
  modifiedWidget.url = '/search';
  modifiedWidget.title = 'Search';
  return modifiedWidget;
};

const mockIsAdminWrapper = ({ component }) => {
  const isAdmin = true;
  return isAdmin ? component : null;
};

const makeMockElementWrapper = (testId = 0) => function MockElementWrapper({ component }) {
  return (
    <div data-testid={`wrapper${testId}`}>
      This is a wrapper.
      {component}
    </div>
  );
};

const mockRenderWidget = () => (
  <div data-testid="widget">
    This is a widget.
  </div>
);

const mockSlotChanges: PluginChange[] = [
  {
    op: PluginOperationTypes.INSERT,
    widget: {
      id: 'login',
      priority: 50,
      type: PluginTypes.IFRAME,
      url: '/login',
      title: 'Login',
    },
  },
  {
    op: PluginOperationTypes.WRAP,
    widgetId: 'login',
    wrapper: mockIsAdminWrapper,
  },
  {
    op: PluginOperationTypes.HIDE,
    widgetId: 'default_contents',
  },
  {
    op: PluginOperationTypes.MODIFY,
    widgetId: 'login',
    fn: mockModifyWidget,
  },
];

const mockDefaultContent = [{
  id: 'default_contents',
  keepDefault: true,
  priority: 50,
  type: PluginTypes.DIRECT,
  content: {},
  RenderWidget: jest.fn(),
}];

jest.mock('../../config', () => ({
  getConfig: jest.fn(() => ({
    pluginSlots: {
      example_plugin_slot: {
        plugins: mockSlotChanges,
        keepDefault: true,
      },
    },
  })),
}));

jest.mock('../../logging', () => ({
  logError: jest.fn(),
}));

describe('organizePlugins', () => {
  describe('when there is no defaultContent', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an empty array when there are no changes or additions to slot', () => {
      const plugins = organizePlugins([], []);
      expect(plugins.length).toBe(0);
      expect(plugins).toEqual([]);
    });

    it('should return an array of changes for non-default plugins', () => {
      const plugins = organizePlugins([], mockSlotChanges);
      expect(plugins.length).toEqual(1);
      expect(plugins[0].id).toEqual('login');
    });
  });

  describe('when there is defaultContent', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an array of defaultContent if no changes for plugins in slot', () => {
      const plugins = organizePlugins(mockDefaultContent, []);
      expect(plugins.length).toEqual(1);
      expect(plugins).toEqual(mockDefaultContent);
    });

    it('should remove plugins with PluginOperation.Hide', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'default_contents');
      if (widget === undefined) {
        fail('widget was undefined');
      }
      expect(plugins.length).toEqual(2);
      expect(widget.hidden).toBe(true);
    });

    it('should modify plugins with PluginOperation.Modify', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget: PluginContainerIframeConfig | undefined = plugins.find((w) => w.id === 'login') as PluginContainerIframeConfig;

      if (widget === undefined) {
        fail('widget was undefined');
      }
      expect(plugins.length).toEqual(2);
      expect(widget.url).toEqual('/search');
    });

    it('should wrap plugins with PluginOperation.Wrap', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'login');
      expect(plugins.length).toEqual(2);
      if (widget?.wrappers === undefined) {
        fail('widget.wrappers was undefined');
      }
      expect(widget.wrappers.length).toEqual(1);
    });

    it('should accept several wrappers for a single plugin with PluginOperation.Wrap', () => {
      const newMockWrapComponent = ({ component }) => {
        const isStudent = false;
        return isStudent ? null : component;
      };
      const newPluginChange: WrapPlugin = {
        op: PluginOperationTypes.WRAP,
        widgetId: 'login',
        wrapper: newMockWrapComponent,
      };
      mockSlotChanges.push(newPluginChange);
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'login');
      expect(plugins.length).toEqual(2);
      if (widget?.wrappers === undefined) {
        fail('widget.wrappers was undefined');
      }
      expect(widget.wrappers.length).toEqual(2);
      expect(widget.wrappers[0]).toEqual(mockIsAdminWrapper);
      expect(widget.wrappers[1]).toEqual(newMockWrapComponent);
    });

    it('should return plugins arranged by priority', () => {
      const newPluginChange: InsertPlugin = {
        op: PluginOperationTypes.INSERT,
        widget: {
          id: 'profile',
          priority: 1,
          type: PluginTypes.IFRAME,
          url: '/profile',
          title: 'Profile',
        },
      };
      mockSlotChanges.push(newPluginChange);
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      expect(plugins.length).toEqual(3);
      expect(plugins[0].id).toBe('profile');
      expect(plugins[1].id).toBe('default_contents');
      expect(plugins[2].id).toBe('login');
    });
  });
});

describe('wrapComponent', () => {
  describe('when provided with a single wrapper in an array', () => {
    it('should wrap the provided component', () => {
      const wrappedComponent = wrapComponent(mockRenderWidget, [makeMockElementWrapper()]);

      const { getByTestId } = render(wrappedComponent);

      const wrapper = getByTestId('wrapper0');
      const widget = getByTestId('widget');

      expect(wrapper).toContainElement(widget);
    });
  });
  describe('when provided with multiple wrappers in an array', () => {
    it('should wrap starting with the first wrapper in the array', () => {
      const wrappedComponent = wrapComponent(
        mockRenderWidget,
        [makeMockElementWrapper(), makeMockElementWrapper(1), makeMockElementWrapper(2)],
      );

      const { getByTestId } = render(wrappedComponent);

      const innermostWrapper = getByTestId('wrapper0');
      const middleWrapper = getByTestId('wrapper1');
      const outermostWrapper = getByTestId('wrapper2');
      const widget = getByTestId('widget');

      expect(innermostWrapper).toContainElement(widget);
      expect(middleWrapper).toContainElement(innermostWrapper);
      expect(outermostWrapper).toContainElement(middleWrapper);
    });
  });
});

describe('getConfigSlots', () => {
  it('returns the plugin slots from the Config Document', () => {
    const expected = {
      example_plugin_slot: {
        plugins: mockSlotChanges,
        keepDefault: true,
      },
    };
    expect(getConfigSlots()).toStrictEqual(expected);
  });
});
