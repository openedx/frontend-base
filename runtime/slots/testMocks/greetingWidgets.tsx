// The "renaming a prop" example from docs/how_tos/add-a-slot-version.md: the operator's widget before and after moving it to v2.
import { WidgetOperation, WidgetOperationTypes } from '../widget/types';
import { GreetingSlotProps, GreetingSlotV2Props } from './GreetingSlotV1V2';

export const customGreetingV1: WidgetOperation = {
  slotId: 'org.openedx.frontend.slot.example.greeting.v1',
  id: 'customGreeting',
  op: WidgetOperationTypes.REPLACE,
  relatedId: 'defaultContent',
  component: ({ userName }: GreetingSlotProps) => <h1>Welcome back, {userName}</h1>,
};

export const customGreetingV2: WidgetOperation = {
  slotId: 'org.openedx.frontend.slot.example.greeting.v2',
  id: 'customGreeting',
  op: WidgetOperationTypes.REPLACE,
  relatedId: 'defaultContent',
  component: ({ displayName }: GreetingSlotV2Props) => <h1>Welcome back, {displayName}</h1>,
};
