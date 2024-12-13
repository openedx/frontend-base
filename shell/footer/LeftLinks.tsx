import { useSlotWidgets } from '../../runtime/slots/data/hooks';

export default function LeftLinks() {
  const widgets = useSlotWidgets();

  return (
    <div className="d-flex flex-column">
      {widgets}
    </div>
  );
}
