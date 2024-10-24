import { createContext } from 'react';
import { ResolvedHeaderConfig } from '../../types';

const HeaderContext = createContext<ResolvedHeaderConfig>({
  logoUrl: '',
  logoDestinationUrl: '',
  primaryLinks: [],
  secondaryLinks: [],
  anonymousLinks: [],
  authenticatedLinks: [],
});

export default HeaderContext;
