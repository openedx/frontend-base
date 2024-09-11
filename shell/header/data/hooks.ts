import { useEffect, useState } from 'react';
import { UIMatch, useMatches } from 'react-router';
import { HeaderTypes } from '../../../types';

export default function useActiveHeaderId() {
  const matches = useMatches() as UIMatch<unknown, { headerId?: HeaderTypes }>[];
  const [headerId, setHeaderId] = useState<HeaderTypes>(HeaderTypes.DEFAULT);

  useEffect(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      if (match.handle !== undefined && match.handle.headerId !== undefined) {
        setHeaderId(match.handle.headerId);
        break;
      }
    }
  }, [matches]);

  return headerId;
}
