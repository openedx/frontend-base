/**
 * Iterates through each given `<link>` element and removes it from the DOM.
 * @param {HTMLLinkElement[]} existingLinks
 */
export const removeExistingLinks = (existingLinks) => {
  existingLinks.forEach((link) => {
    link.remove();
  });
};

export const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;
