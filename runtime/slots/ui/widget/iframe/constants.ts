// IFrame lifecycle events
export const IFRAME_MOUNTED = 'IFRAME_MOUNTED';
export const IFRAME_UNMOUNTED = 'IFRAME_UNMOUNTED';
export const IFRAME_READY = 'IFRAME_READY';
export const IFRAME_RESIZE = 'IFRAME_RESIZE';

/**
 * Feature policy for iframe, allowing access to certain courseware-related media.
 *
 * We must use the wildcard (*) origin for each feature, as courseware content
 * may be embedded in external iframes. Notably, xblock-lti-consumer is a popular
 * block that iframes external course content.

 * This policy was selected in conference with the edX Security Working Group.
 * Changes to it should be vetted by them (security@edx.org).
 */
export const IFRAME_FEATURE_POLICY = (
  'fullscreen; microphone *; camera *; midi *; geolocation *; encrypted-media *'
);
