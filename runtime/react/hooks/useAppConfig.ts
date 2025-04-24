import { useContext } from 'react';
import CurrentAppContext from '../CurrentAppContext';

const useAppConfig = () => {
  const { appConfig } = useContext(CurrentAppContext);
  return appConfig;
};

export default useAppConfig;
