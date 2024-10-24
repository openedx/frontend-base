import {
  lazy, Suspense
} from 'react';
import { FooterTypes } from '../../types';
import useActiveFooterId from './data/hooks';

const LazyDefaultFooter = lazy(() => import('./default-footer'));
const LazyStudioFooter = lazy(() => import('./studio-footer'));

export default function ActiveFooter() {
  const activeFooterId = useActiveFooterId();

  let lazyFooter: React.ReactNode = null;

  if (activeFooterId === FooterTypes.DEFAULT) {
    lazyFooter = <LazyDefaultFooter />;
  }
  if (activeFooterId === FooterTypes.STUDIO) {
    lazyFooter = <LazyStudioFooter />;
  }

  // TODO: Allow for extensible footers provided by modules.

  // TODO: Improve suspense fallback.
  return (
    <Suspense fallback={<div>Loading footer...</div>}>
      {lazyFooter}
    </Suspense>
  );
}
