import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import {
  FormattedMessage,
  IntlProvider,
} from '../i18n';
import { initializeMockApp } from '../testing';

import { FunctionComponent } from 'react';
import { PluginTypes } from '../../types';
import {
  PLUGIN_MOUNTED, PLUGIN_READY, PLUGIN_RESIZE
} from './data/constants';
import Plugin from './Plugin';
import PluginContainer from './PluginContainer';
import { IFRAME_FEATURE_POLICY } from './PluginContainerIframe';

const iframeConfig = {
  id: 'iframe_plugin',
  url: 'http://localhost/plugin1',
  type: PluginTypes.IFRAME,
  title: 'test iframe plugin',
  priority: 1,
};

const directConfig = {
  id: 'direct_plugin',
  type: PluginTypes.DIRECT,
  RenderWidget: ({ id, content }: { id: string, content: Record<string, any> }) => (<div data-testid={id}>{content.text}</div>),
  priority: 2,
  content: { text: 'This is a direct plugin.' },
};

// Mock ResizeObserver which is unavailable in the context of a test.
global.ResizeObserver = jest.fn(function mockResizeObserver() {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  return this;
});

describe('PluginContainer', () => {
  it('should render a Plugin iFrame Container when given an iFrame config', async () => {
    const component = (
      <PluginContainer config={iframeConfig} loadingFallback={<div>Loading</div>} />
    );

    const { container } = render(component);

    const iframeElement = container.querySelector('iframe');
    const fallbackElement = container.querySelector('div');

    expect(iframeElement).toBeInTheDocument();
    expect(fallbackElement).toBeInTheDocument();

    expect(fallbackElement?.innerHTML).toEqual('Loading');

    // Ensure the iframe has the proper attributes
    expect(iframeElement?.attributes.getNamedItem('allow')?.value).toEqual(IFRAME_FEATURE_POLICY);
    expect(iframeElement?.attributes.getNamedItem('src')?.value).toEqual(iframeConfig.url);
    expect(iframeElement?.attributes.getNamedItem('title')?.value).toEqual(iframeConfig.title);
    // The component isn't ready, since the class has 'd-none'
    expect(iframeElement?.attributes.getNamedItem('class')?.value).toEqual('border border-0 w-100 d-none');

    if (iframeElement === null) {
      fail('iframeElement was null.');
    }
    if (iframeElement?.contentWindow === null) {
      fail('contentWindow was null.');
    }

    jest.spyOn(iframeElement.contentWindow, 'postMessage');

    expect(iframeElement.contentWindow.postMessage).not.toHaveBeenCalled();

    // Dispatch a 'mounted' event manually.
    const mountedEvent = new MessageEvent('message', {
      data: {
        type: PLUGIN_MOUNTED,
      },
      source: iframeElement?.contentWindow
    });

    fireEvent(window, mountedEvent);

    expect(iframeElement.contentWindow.postMessage).toHaveBeenCalledWith(
      {
        type: PLUGIN_RESIZE,
        payload: {
          width: 0, // There's no width/height here in jsdom-land.
          height: 0,
        },
      },
      'http://localhost/plugin1',
    );

    // Dispatch a 'ready' event manually.
    const readyEvent = new MessageEvent('message', {
      data: { type: PLUGIN_READY },
      source: iframeElement.contentWindow,
    });

    fireEvent(window, readyEvent);

    expect(iframeElement.attributes.getNamedItem('class')?.value).toEqual('border border-0 w-100');
  });

  it('should render a Plugin Direct Container when given a Direct config', async () => {
    const component = (
      <PluginContainer config={directConfig} loadingFallback={<div>Loading</div>} />
    );

    const { getByTestId } = render(component);

    expect(getByTestId(directConfig.id)).toBeInTheDocument();
  });
});

describe('Plugin', () => {
  let logError = jest.fn();

  const error = 'There was an error';

  beforeEach(async () => {
    // This is a gross hack to suppress error logs in the invalid parentSelector test
    jest.spyOn(console, 'error');
    (global.console.error as jest.Mock).mockImplementation(() => {});

    const { loggingService } = initializeMockApp();
    logError = loggingService.logError;
  });

  afterEach(() => {
    (global.console.error as jest.Mock).mockRestore();
    jest.clearAllMocks();
  });

  const ExplodingComponent = () => {
    throw new Error(error);
  };

  const HealthyComponent = () => (
    <div>
      <FormattedMessage
        id="hello.world.message.text"
        defaultMessage="Hello World!"
        description="greeting the world with a hello"
      />
    </div>
  );

  const ErrorFallbackComponent = () => (
    <div>
      <p>
        <FormattedMessage
          id="unexpected.error.message.text"
          defaultMessage="Oh geez, this is not good at all."
          description="error message when an unexpected error occurs"
        />
      </p>
      <br />
    </div>
  );

  const PluginPageWrapper = ({
    fallbackComponent, childComponent,
  }: { fallbackComponent?: FunctionComponent, childComponent: FunctionComponent }) => {
    const ChildComponent = childComponent;
    return (
      <IntlProvider locale="en">
        <Plugin errorFallbackComponent={fallbackComponent}>
          <ChildComponent />
        </Plugin>
      </IntlProvider>
    );
  };

  it('should render children if no error', () => {
    const component = (
      <PluginPageWrapper
        fallbackComponent={ErrorFallbackComponent}
        childComponent={HealthyComponent}
      />
    );
    const { container } = render(component);
    expect(container).toHaveTextContent('Hello World!');
  });

  it('should throw an error if the child component fails', () => {
    const component = (
      <PluginPageWrapper
        fallbackComponent={ErrorFallbackComponent}
        childComponent={ExplodingComponent}
      />
    );

    const { container } = render(component);
    expect(container).toHaveTextContent('Oh geez');

    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(
      new Error(error),
      expect.objectContaining({
        stack: expect.stringContaining('ExplodingComponent'),
      }),
    );
  });

  it('should render the default fallback component when one is not passed into the Plugin', () => {
    const component = (
      <PluginPageWrapper
        childComponent={ExplodingComponent}
      />
    );

    const { container } = render(component);
    expect(container).toHaveTextContent('Oops! An error occurred.');
  });
});
