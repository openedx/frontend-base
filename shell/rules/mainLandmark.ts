import type { PageRule } from './types';

// https://html.spec.whatwg.org/multipage/grouping-content.html#the-main-element
const mainLandmark: PageRule = (document) => {
  const count = document.querySelectorAll('main:not([hidden])').length;
  if (count > 1) {
    return {
      level: 'error',
      message: `The page has ${count} <main> elements without the hidden attribute; HTML allows one. The skip link focuses the first.`,
    };
  }
  if (count === 0) {
    return {
      level: 'warning',
      message: 'The page has no <main> element. Every route should have one around its primary content; the skip link falls back to the content wrapper.',
    };
  }
  return undefined;
};

export default mainLandmark;
