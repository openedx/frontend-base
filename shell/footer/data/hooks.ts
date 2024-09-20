import { useEffect, useState } from 'react';
import { UIMatch, useMatches } from 'react-router';
import { FooterTypes } from '../../../types';

export default function useActiveFooterId() {
  const matches = useMatches() as UIMatch<unknown, { footerId?: FooterTypes }>[];
  const [footerId, setFooterId] = useState<FooterTypes>(FooterTypes.DEFAULT);

  useEffect(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      if (match.handle !== undefined && match.handle.footerId !== undefined) {
        setFooterId(match.handle.footerId);
        break;
      }
    }
  }, [matches]);

  return footerId;
}
