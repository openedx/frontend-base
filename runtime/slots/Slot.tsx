import { ComponentType, createElement, isValidElement, ReactNode } from 'react';
import DefaultSlotLayout from './layout/DefaultSlotLayout';
import { useLayoutForSlotId } from './layout/hooks';
import SlotContext from './SlotContext';
import { useSlotContext } from './hooks';

interface SlotProps {
  id: string,
  idAliases?: string[],
  children?: ReactNode,
  layout?: ComponentType | ReactNode,
  [key: string]: unknown,
}

function SlotRenderer({ layout }: { layout: ComponentType | ReactNode }) {
  const { id } = useSlotContext();
  let layoutElement: ComponentType | ReactNode = layout;

  const overrideLayout = useLayoutForSlotId(id);

  // Weed out any ReactNode types that aren't actually JSX.
  if (overrideLayout && overrideLayout !== null && overrideLayout !== undefined && typeof overrideLayout !== 'boolean') {
    layoutElement = overrideLayout;
  }

  if (!isValidElement(layoutElement)) {
    layoutElement = createElement(layoutElement as ComponentType);
  }

  return <>{layoutElement}</>;
}

export default function Slot({ id, idAliases, children, layout = DefaultSlotLayout, ...props }: SlotProps) {
  return (
    <SlotContext.Provider value={{ id, idAliases, children, ...props }}>
      <SlotRenderer layout={layout} />
    </SlotContext.Provider>
  );
}
