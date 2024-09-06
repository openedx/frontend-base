// Plugin lifecycle events
export const PLUGIN_MOUNTED = 'PLUGIN_MOUNTED';
export const PLUGIN_READY = 'PLUGIN_READY';
export const PLUGIN_UNMOUNTED = 'PLUGIN_UNMOUNTED';
export const PLUGIN_RESIZE = 'PLUGIN_RESIZE';

export const requiredPluginTypes = {
  insert: {
    base: {
      id: 'string',
      priority: 'number',
      type: 'string',
    },
    direct_plugin: {
      RenderWidget: 'function',
    },
    iframe_plugin: {
      title: 'string',
      url: 'string',
    },
  },
  hide: {
    widgetId: 'string',
  },
  modify: {
    widgetId: 'string',
    fn: 'function',
  },
  wrap: {
    widgetId: 'string',
    wrapper: 'function',
  },
};
