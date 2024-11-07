import { useCallback, useContext, useEffect } from 'react';
import { CourseInfo } from '../../../types';
import { LearningContext, LearningDispatchContext } from './LearningContext';
import { LearningActionTypes } from './types';

/**
 * Used to read the `CourseInfo` in the `LearningContext`.
 */
export function useCourseInfo() {
  return useContext(LearningContext);
}

export function useCourseInfoActions() {
  const dispatch = useContext(LearningDispatchContext);

  const update = useCallback((courseInfo: CourseInfo) => {
    dispatch({ type: LearningActionTypes.UPDATE, payload: courseInfo });
  }, [dispatch]);

  const remove = useCallback(() => {
    dispatch({ type: LearningActionTypes.REMOVE });
  }, [dispatch]);

  return {
    update,
    remove,
  };
}

/**
 * Used to set the `CourseInfo` in the `LearningContext`.  When the component using this hook is
 * unloaded, the `CourseInfo` will be removed from the context.
 */
export function useCourseInfoProvider(courseInfo: CourseInfo) {
  const { update, remove } = useCourseInfoActions();
  useEffect(() => {
    update(courseInfo);
    return () => {
      remove();
    };
  }, [update, remove, courseInfo]);
}
