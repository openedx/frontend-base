'use client';

import PropTypes from 'prop-types';

import PluginContainerDirect from './PluginContainerDirect';
import PluginContainerIframe from './PluginContainerIframe';

import { PluginTypes } from '../../types';
import { pluginConfigShape, slotOptionsShape } from './data/shapes';

function PluginContainer({ config, slotOptions, ...props }) {
  if (!config) {
    return null;
  }

  // this will allow for future plugin types to be inserted in the PluginErrorBoundary
  let renderer = null;
  switch (config.type) {
    case PluginTypes.IFRAME:
      renderer = (
        <PluginContainerIframe
          config={config}
          {...props}
        />
      );
      break;
    case PluginTypes.DIRECT:
      renderer = (
        <PluginContainerDirect
          config={config}
          slotOptions={slotOptions}
          {...props}
        />
      );
      break;
    default:
      break;
  }

  return renderer;
}

export default PluginContainer;

PluginContainer.propTypes = {
  /** Configuration for the Plugin in this container — i.e pluginSlot[id].example_plugin */
  config: PropTypes.shape(pluginConfigShape),
  /** Options passed to the PluginSlot */
  slotOptions: PropTypes.shape(slotOptionsShape),
};

PluginContainer.defaultProps = {
  config: null,
  slotOptions: {},
};
