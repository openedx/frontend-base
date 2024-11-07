import { createContext, Dispatch } from 'react';
import { CourseInfo } from '../../../types';
import { LearningReducerActions } from './types';

export const LearningContext = createContext<CourseInfo | null>(null);
export const LearningDispatchContext = createContext<Dispatch<LearningReducerActions>>(() => {});
