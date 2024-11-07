import { CourseInfo } from '../../../types';

export enum LearningActionTypes {
  UPDATE = 'update',
  REMOVE = 'remove',
}

interface UpdateAction {
  type: LearningActionTypes.UPDATE,
  payload: CourseInfo,
}

interface RemoveAction {
  type: LearningActionTypes.REMOVE,
}

export type LearningReducerActions = UpdateAction | RemoveAction;
