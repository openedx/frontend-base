import { useContext } from 'react';
import SiteContext from '../SiteContext';

const useSiteConfig = () => {
  const { siteConfig } = useContext(SiteContext);
  return siteConfig;
};

export default useSiteConfig;
