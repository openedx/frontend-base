import {
  lazy, Suspense
} from 'react';
import { HeaderTypes } from '../../types';
import useActiveHeaderId from './data/hooks';

const LazyDefaultHeader = lazy(() => import('./default-header/DefaultHeader'));
const LazyLearningHeader = lazy(() => import('./learning-header/LearningHeader'));
const LazyStudioHeader = lazy(() => import('./studio-header/StudioHeader'));

export default function ActiveHeader() {
  const activeHeaderId = useActiveHeaderId();

  let lazyHeader: React.ReactNode = null;

  if (activeHeaderId === HeaderTypes.DEFAULT) {
    lazyHeader = <LazyDefaultHeader />;
  }
  if (activeHeaderId === HeaderTypes.LEARNING) {
    lazyHeader = <LazyLearningHeader />;
  }
  if (activeHeaderId === HeaderTypes.STUDIO) {
    // TODO: Figure out how to get a meaningful title here.
    lazyHeader = <LazyStudioHeader title="Studio" />;
  }

  // TODO: Allow for extensible headers provided by modules.

  // TODO: Improve suspense fallback.
  return (
    <Suspense fallback={<div>Loading header...</div>}>
      {lazyHeader}
    </Suspense>
  );
}
