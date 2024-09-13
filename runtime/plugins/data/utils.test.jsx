/* eslint react/prop-types: off */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { logError } from '../../logging';

import {
  getConfigSlots, organizePlugins, validatePlugin, wrapComponent,
} from './utils';

import { PluginOperations, PluginTypes } from '../../../types';

const mockModifyWidget = (widget) => {
  const modifiedWidget = widget;
  modifiedWidget.url = '/search';
  modifiedWidget.title = 'Search';
  return modifiedWidget;
};

const mockIsAdminWrapper = ({ widget }) => {
  const isAdmin = true;
  return isAdmin ? widget : null;
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

const mockSlotChanges = [
  {
    op: PluginOperations.INSERT,
    widget: {
      id: 'login',
      priority: 50,
      type: PluginTypes.IFRAME,
      url: '/login',
      title: 'Login',
    },
  },
  {
    op: PluginOperations.WRAP,
    widgetId: 'login',
    wrapper: mockIsAdminWrapper,
  },
  {
    op: PluginOperations.HIDE,
    widgetId: 'default_contents',
  },
  {
    op: PluginOperations.MODIFY,
    widgetId: 'login',
    fn: mockModifyWidget,
  },
];

const mockDefaultContent = [{
  id: 'default_contents',
  keepDefault: true,
  priority: 50,
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
      expect(plugins.length).toEqual(2);
      expect(widget.hidden).toBe(true);
    });

    it('should modify plugins with PluginOperation.Modify', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'login');

      expect(plugins.length).toEqual(2);
      expect(widget.url).toEqual('/search');
    });

    it('should wrap plugins with PluginOperation.Wrap', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'login');
      expect(plugins.length).toEqual(2);
      expect(widget.wrappers.length).toEqual(1);
    });

    it('should accept several wrappers for a single plugin with PluginOperation.Wrap', () => {
      const newMockWrapComponent = ({ widget }) => {
        const isStudent = false;
        return isStudent ? null : widget;
      };
      const newPluginChange = {
        op: PluginOperations.WRAP,
        widgetId: 'login',
        wrapper: newMockWrapComponent,
      };
      mockSlotChanges.push(newPluginChange);
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'login');
      expect(plugins.length).toEqual(2);
      expect(widget.wrappers.length).toEqual(2);
      expect(widget.wrappers[0]).toEqual(mockIsAdminWrapper);
      expect(widget.wrappers[1]).toEqual(newMockWrapComponent);
    });

    it('should return plugins arranged by priority', () => {
      const newPluginChange = {
        op: PluginOperations.INSERT,
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

describe('validatePlugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insert plugin configuration', () => {
    it('returns true if the plugin config is correctly configured', () => {
      const insertDirectConfig = {
        op: PluginOperations.INSERT,
        widget: {
          id: 'new_plugin',
          priority: 10,
          type: PluginTypes.DIRECT,
          RenderWidget: mockRenderWidget,
        },
      };
      const insertIFrameConfig = {
        op: PluginOperations.INSERT,
        widget: {
          id: 'new_plugin',
          priority: 10,
          type: PluginTypes.IFRAME,
          title: 'iframe plugin',
          url: 'example.url.com',
        },
      };
      const insertDirectModularConfig = {
        op: PluginOperations.INSERT,
        widget: {
          id: 'inserted_plugin',
          type: PluginTypes.DIRECT,
          priority: 10,
          RenderWidget: mockRenderWidget,
          content: {
            title: 'Modular Direct Plugin',
            uniqueText: 'This is some text.',
          },
        },
      };

      expect(validatePlugin(insertDirectConfig)).toBe(true);
      expect(validatePlugin(insertIFrameConfig)).toBe(true);
      expect(validatePlugin(insertDirectModularConfig)).toBe(true);
    });

    it('returns error message if the plugin config is incorrectly configured', () => {
      // missing id for Direct Plugin
      const insertBrokenDirectConfig = {
        op: PluginOperations.INSERT,
        widget: {
          priority: 10,
          type: PluginTypes.DIRECT,
          RenderWidget: mockRenderWidget,
        },
      };
      // missing RenderWidget for Direct Plugin
      const insertBrokenDirectConfig2 = {
        op: PluginOperations.INSERT,
        widget: {
          id: 'new_plugin',
          priority: 10,
          type: PluginTypes.DIRECT,
        },
      };
      // properties need to be wrapped in widget key
      const insertBrokenDirectConfig3 = {
        op: PluginOperations.INSERT,
        id: 'new_plugin',
        priority: 10,
        type: PluginTypes.DIRECT,
        RenderWidget: mockRenderWidget,
      };
      // missing title for iFrame Plugin
      const insertBrokenIFrameConfig = {
        op: PluginOperations.INSERT,
        widget: {
          id: 'new_iframe_plugin',
          priority: 10,
          type: PluginTypes.IFRAME,
          url: 'www.example_url.com',
        },
      };
      // missing plugin type
      const insertBrokenIFrameConfig2 = {
        op: PluginOperations.INSERT,
        widget: {
          id: 'new_iframe_plugin',
          priority: 10,
          url: 'www.example_url.com',
        },
      };

      try {
        validatePlugin(insertBrokenDirectConfig);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the insert configuration is invalid for widget id: MISSING ID');
      }

      try {
        validatePlugin(insertBrokenDirectConfig2);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the insert configuration is invalid for widget id: new_plugin');
      }

      try {
        validatePlugin(insertBrokenDirectConfig3);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('insert operation config is missing widget object');
      }

      try {
        validatePlugin(insertBrokenIFrameConfig);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the insert configuration is invalid for widget id: new_iframe_plugin');
      }

      try {
        validatePlugin(insertBrokenIFrameConfig2);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the insert configuration is invalid for widget id: new_iframe_plugin');
      }
    });
  });
  describe('hide plugin configuration', () => {
    it('returns true if the Hidden operation is configured', () => {
      const validHideConfig = {
        op: PluginOperations.HIDE,
        widgetId: 'default_content',
      };
      expect(validatePlugin(validHideConfig)).toBe(true);
    });
    it('returns an error if the Hidden operation is configured incorrectly', () => {
      const invalidHideConfig = {
        op: PluginOperations.HIDE,
      };

      try {
        validatePlugin(invalidHideConfig);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the hide operation config is invalid for widget id: MISSING ID');
      }
    });
  });
  describe('modify plugin configuration', () => {
    it('returns true if the Modify operation is configured correctly', () => {
      const validModifyConfig = {
        op: PluginOperations.MODIFY,
        widgetId: 'random_plugin',
        fn: mockModifyWidget,
      };
      expect(validatePlugin(validModifyConfig)).toBe(true);
    });
    it('returns an error if the Modify operation is configured incorrectly', () => {
      const invalidModifyConfig1 = {
        op: PluginOperations.MODIFY,
        widgetId: 'random_plugin',
      };
      const invalidModifyConfig2 = {
        op: PluginOperations.MODIFY,
        fn: mockModifyWidget,
      };

      try {
        validatePlugin(invalidModifyConfig1);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the modify operation config is invalid for widget id: random_plugin');
      }
      try {
        validatePlugin(invalidModifyConfig2);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the modify operation config is invalid for widget id: MISSING ID');
      }
    });
  });
  describe('wrap plugin configuration', () => {
    it('returns true if the Wrap operation is configured correctly', () => {
      const validWrapConfig = {
        op: PluginOperations.WRAP,
        widgetId: 'random_plugin',
        wrapper: makeMockElementWrapper(),
      };
      expect(validatePlugin(validWrapConfig)).toBe(true);
    });
    it('returns an error if the Wrap operation is configured incorrectly', () => {
      const invalidWrapConfig1 = {
        op: PluginOperations.WRAP,
        widgetId: 'random_plugin',
      };
      const invalidWrapConfig2 = {
        op: PluginOperations.WRAP,
        wrapper: makeMockElementWrapper(),
      };

      try {
        validatePlugin(invalidWrapConfig1);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the wrap operation config is invalid for widget id: random_plugin');
      }
      try {
        validatePlugin(invalidWrapConfig2);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('the wrap operation config is invalid for widget id: MISSING ID');
      }
    });
  });
  describe('an invalid plugin configuration', () => {
    it('should raise an error for an operation that does not exist', () => {
      const invalidPluginConfig = {
        op: PluginOperations.INVALID,
        widgetId: 'drafts',
      };

      try {
        validatePlugin(invalidPluginConfig);
      } catch (error) {
        expect(logError).toHaveBeenCalledWith('There is a config with an invalid PLUGIN_OPERATION. Check to make sure it is configured correctly.');
      }
    });
  });
});
