import { ReactNode, useReducer } from 'react';
import { CourseInfo } from '../../../types';
import { LearningContext, LearningDispatchContext } from './LearningContext';
import { LearningActionTypes } from './types';

interface LearningProviderProps {
  children: ReactNode,
}

function learningReducer(state: CourseInfo | null, action) {
  switch (action.type) {
    case LearningActionTypes.UPDATE:
      return action.payload;
    case LearningActionTypes.REMOVE:
      return null;
  }
  return state;
}

export default function LearningProvider({ children }: LearningProviderProps) {
  const [state, dispatch] = useReducer(learningReducer, null);

  return (
    <LearningContext.Provider value={state}>
      <LearningDispatchContext.Provider value={dispatch}>
        {children}
      </LearningDispatchContext.Provider>
    </LearningContext.Provider>
  );
}
