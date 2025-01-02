import { useSlotWidgets } from '../../../runtime/slots/data/hooks';

export default function HorizontalSlotLayout() {
  const widgets = useSlotWidgets();

  return (
    <div className="d-flex gap-3">
      {widgets}
    </div>
  );
}
