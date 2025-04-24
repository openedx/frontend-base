import { useContext } from 'react';
import SiteContext from '../SiteContext';

const useAuthenticatedUser = () => {
  const { authenticatedUser } = useContext(SiteContext);
  return authenticatedUser;
};

export default useAuthenticatedUser;
