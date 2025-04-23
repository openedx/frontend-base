/**
 * #### Import members from **@openedx/frontend-base**
 *
 * The PubSub module is a thin wrapper around the base functionality of
 * [PubSubJS](https://github.com/mroderick/PubSubJS).  For the sake of simplicity and not relying
 * too heavily on implementation-specific features, it maintains a fairly simple API (subscribe,
 * unsubscribe, and publish).
 *
 * Publish/Subscribe events should be used mindfully, especially in relation to application UI
 * frameworks like React.  Given React's unidirectional data flow and prop/state management
 * capabilities, using a pub/sub mechanism is at odds with that framework's best practices.
 *
 * That said, we use pub/sub in our application initialization sequence to allow applications to
 * hook into the initialization lifecycle, and we also use them to publish when the application
 * state has changed, i.e., when the config document or user's authentication state have changed.
 *
 * @module PubSub
 */

// export const {
//   subscribe,
//   unsubscribe,
//   publish,
// } = PubSub;

type CallbackFunction = (topic: string, data?: any) => void;

let subscriptions: Record<string, CallbackFunction[]> = {};

export function subscribe(topic: string, callback) {
  if (subscriptions[topic] === undefined) {
    subscriptions[topic] = [];
  }
  subscriptions[topic].push(callback);
}

export function publish(topic: string, data?: any) {
  if (subscriptions[topic] === undefined) {
    subscriptions[topic] = [];
  }
  subscriptions[topic].forEach(callback => {
    if (data) {
      callback(topic, data);
    } else {
      callback(topic);
    }
  });
}

export function unsubscribe(topic: string, callback: CallbackFunction) {
  if (subscriptions[topic] === undefined) {
    subscriptions[topic] = [];
  }

  subscriptions[topic] = subscriptions[topic].filter((value) => value !== callback);
}

export function clearAllSubscriptions() {
  subscriptions = {};
}
