'use client';

import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-extraneous-dependencies
import PluginContainerDirect from './PluginContainerDirect';
import PluginContainerIframe from './PluginContainerIframe';

import {
  DIRECT_PLUGIN,
  IFRAME_PLUGIN,
} from './data/constants';
import { pluginConfigShape } from './data/shapes';

function PluginContainer({ config, ...props }) {
  if (config === null) {
    return null;
  }

  // this will allow for future plugin types to be inserted in the PluginErrorBoundary
  let renderer = null;
  switch (config.type) {
    case IFRAME_PLUGIN:
      renderer = (
        <PluginContainerIframe config={config} {...props} />
      );
      break;
    case DIRECT_PLUGIN:
      renderer = (
        <PluginContainerDirect config={config} {...props} />
      );
      break;
    default:
      break;
  }

  return (
    renderer
  );
}

export default PluginContainer;

PluginContainer.propTypes = {
  /** Configuration for the Plugin in this container — i.e pluginSlot[id].example_plugin */
  config: PropTypes.shape(pluginConfigShape),
};

PluginContainer.defaultProps = {
  config: null,
};
