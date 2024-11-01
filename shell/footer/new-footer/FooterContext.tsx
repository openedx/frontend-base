import { createContext } from 'react';
import { ResolvedFooterConfig } from '../../../types';

const FooterContext = createContext<ResolvedFooterConfig>({
  logoUrl: '',
  logoDestinationUrl: '',
  leftLinks: [],
  centerLinks: [],
  rightLinks: [],
  revealMenu: undefined,
  copyrightNotice: undefined,
});

export default FooterContext;
