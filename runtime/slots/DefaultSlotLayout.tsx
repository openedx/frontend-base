import { useSlotWidgets } from './data/hooks';

export default function DefaultSlotLayout() {
  const widgets = useSlotWidgets();

  return (
    <>{widgets}</>
  );
}
