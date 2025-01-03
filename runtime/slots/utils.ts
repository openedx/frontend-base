import { getConfig } from '../config';
import {
  SlotOperation
} from './types';

export function getSlotOperations(id: string) {
  const { apps } = getConfig();
  const ops: SlotOperation[] = [];
  apps.forEach((app) => {
    if (Array.isArray(app.slots)) {
      app.slots.forEach((operation) => {
        if (operation.slotId === id) {
          ops.push(operation);
        }
      });
    }
  });
  return ops;
}
