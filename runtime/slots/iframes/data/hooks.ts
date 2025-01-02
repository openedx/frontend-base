/**
 * Hooks file for functions that handle the communication between a Plugin and its Host
 */

import {
  LegacyRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { MessageEventCallback } from '../types';
import { IFRAME_MOUNTED, IFRAME_READY, IFRAME_UNMOUNTED } from './constants';

/* Listening for events */

/**
 * Dynamically add an event listener to the provided source window.
 * The source window can be the global parent (ie. the "window" object in the browser)
 * or it can be the content window of an individual element (ie. iFrame plugin container)
 */
export function useMessageEvent(srcWindow: Window | null, type: string, callback: MessageEventCallback) {
  // useLayoutEffect is called before the browser repaints the screen
  useLayoutEffect(() => {
    // Create a listener callback function
    const listener = (event: MessageEvent<{ type: string, payload: any }>) => {
      // Filter messages to those from our source window.
      // NOTE: the "srcWindow" is determined by the below useHostEvent and usePluginEvent functions
      if (event.source === srcWindow) {
        // Fire callback if the type from the listened event matches the type from the message event
        if (event.data.type === type) {
          callback({ type, payload: event.data.payload });
        }
      }
    };
    // Add the listener to the global object if the srcWindow is not null
    if (srcWindow !== null) {
      global.addEventListener('message', listener);
    }
    // useEffect cleanup
    return () => {
      global.removeEventListener('message', listener);
    };
  }, [srcWindow, type, callback]);
}

/**
 * Called by the Plugin component to use events that were listened to (ie. PLUGIN_RESIZE)
 */
export function useHostEvent(type: string, callback: MessageEventCallback) {
  useMessageEvent(global.parent, type, callback);
}

/**
 * Used to listen for events from a wrapped Plugin element (eg. PluginContainerIframe)
 *
 * @param element - Plugin element (eg. <iframe>)
 * @param type - Event type (eg. PLUGIN_RESIZE)
 * @param callback - Function to call when the event is triggered
 */
export function usePluginEvent(element: HTMLIFrameElement | undefined, type: string, callback: MessageEventCallback) {
  const contentWindow = element ? element.contentWindow : null;
  useMessageEvent(contentWindow, type, callback);
}

/** Dispatching events */

/**
 * Base dispatch function called by dispatchHostEvent and dispatchPluginEvent.
 * Uses the `postMessage` method to enable cross-origin communication between Window objects
 *
 * @param targetWindow - Window that the message event is being dispatched to
 * @param message - Data object for the message
 * @param targetOrigin - URL for the window that the message event is being dispatched from
 */
export function dispatchMessageEvent(targetWindow: Window | null, message: any, targetOrigin: string) {
  /** Checking targetOrigin falsiness here since '', null or undefined would all be
   * reasons not to try to post a message to the origin.
   */
  if (targetWindow && targetOrigin) {
    targetWindow.postMessage(message, targetOrigin);
  }
}

/**
 * Used to dispatch events for a Plugin
 *
 * @param element - Plugin element (eg. <iframe>)
 * @param message - Data object for the message
 * @param targetOrigin - URL for the window that the message event is being dispatched from
 */
export function dispatchPluginEvent(element: HTMLIFrameElement, message: any, targetOrigin: string) {
  dispatchMessageEvent(element.contentWindow, message, targetOrigin);
}

/**
 * Used to dispatch events for the Host
 *
 * @param message - Data object for the message
 */
export function dispatchHostEvent(message: any) {
  dispatchMessageEvent(global.parent, message, global.document.referrer);
}

// Called inside Plugin when 'ready' prop is true
export function dispatchReadyEvent() {
  dispatchHostEvent({ type: IFRAME_READY });
}

// Below mounted events are called in a useEffect inside Plugin with [] dependencies — https://react.dev/learn/synchronizing-with-effects
export function dispatchMountedEvent() {
  dispatchHostEvent({ type: IFRAME_MOUNTED });
}

export function dispatchUnmountedEvent() {
  dispatchHostEvent({ type: IFRAME_UNMOUNTED });
}

/**
 * Used to determine the size of an element as it is being resized in the browser.
 * ResizeObserver (https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) is used to maintain a reference to the element's content/border box.
 *
 * @returns Memoized value that contains a reference to the Plugin element (eg. iframe)
 */
export function useElementSize() {
  // Holds a reference to the ResizeObserver
  const observerRef = useRef<ResizeObserver>();

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [element, setElement] = useState<HTMLIFrameElement | undefined>();
  // Sets a reference to the Plugin element when passed to the Plugin element as a "ref" attribute (eg. <iframe>)
  const measuredRef: LegacyRef<HTMLIFrameElement> = useCallback(_element => {
    setElement(_element);
  }, []);

  useEffect(() => {
    // Create a new ResizeObserver
    observerRef.current = new ResizeObserver(() => {
      if (element) {
        // Set dimensions and any offset
        setDimensions({
          width: element.clientWidth,
          height: element.clientHeight,
        });
        setOffset({
          x: element.offsetLeft,
          y: element.offsetTop,
        });
      }
    });
    if (element) {
      // Tell the ResizeObserver to start watching the element — this enables the hook to detect resizing
      observerRef.current.observe(element);
    }
  }, [element]);

  return useMemo<{
    ref: LegacyRef<HTMLIFrameElement>,
    element: HTMLIFrameElement | undefined,
    width: number,
    height: number,
    x: number,
    y: number,
  }>(
    () => ({
      ref: measuredRef,
      element: element,
      width: dimensions.width,
      height: dimensions.height,
      x: offset.x,
      y: offset.y
    }),
    [measuredRef, element, dimensions, offset],
  );
}
