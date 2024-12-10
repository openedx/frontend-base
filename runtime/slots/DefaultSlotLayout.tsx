import { useSlotWidgets } from './hooks';

export default function DefaultSlotLayout() {
  const widgets = useSlotWidgets();

  return (
    <>{widgets}</>
  );
}
