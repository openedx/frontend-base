import { AppProvider } from '../../../types';

import FooProvider from './FooProvider';
import BarProvider from './BarProvider';

const providers: AppProvider[] = [
  FooProvider,
  BarProvider,
];

export default providers;
