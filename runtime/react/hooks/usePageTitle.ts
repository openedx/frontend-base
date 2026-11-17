import { useEffect, useState } from 'react';

interface TitleClaim {
  order: number;
  title: string;
}

/* Sorted by first render, so the innermost caller comes last. */
const claims: TitleClaim[] = [];
let nextOrder = 0;

function applyTitle() {
  const innermost = claims[claims.length - 1];
  if (innermost) {
    document.title = innermost.title;
  }
}

/**
 * A React hook that sets the document title.  When nested components call it, the innermost wins.
 *
 * @memberof module:React
 * @param {string} [title] The localized title.  Nothing is set while it is empty.
 */
const usePageTitle = (title?: string | null) => {
  const [claim] = useState<TitleClaim>(() => ({ order: nextOrder++, title: '' }));
  const hasTitle = Boolean(title);

  useEffect(() => {
    if (!hasTitle) {
      return undefined;
    }

    claims.push(claim);
    claims.sort((a, b) => a.order - b.order);

    return () => {
      claims.splice(claims.indexOf(claim), 1);
      applyTitle();
    };
  }, [claim, hasTitle]);

  useEffect(() => {
    if (title) {
      claim.title = title;
      applyTitle();
    }
  }, [claim, title]);
};

export default usePageTitle;
