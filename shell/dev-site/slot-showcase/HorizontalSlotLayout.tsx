import { useWidgets } from '../../../runtime';

export default function HorizontalSlotLayout() {
  const widgets = useWidgets();

  return (
    <div className="d-flex gap-3">
      {widgets}
    </div>
  );
}
