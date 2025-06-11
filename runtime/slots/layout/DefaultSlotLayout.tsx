import { useWidgets } from '../widget/hooks';

export default function DefaultSlotLayout() {
  const widgets = useWidgets();

  return (
    <>{widgets}</>
  );
}
