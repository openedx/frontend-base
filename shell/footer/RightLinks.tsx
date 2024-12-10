import { useSlotWidgets } from '../../runtime/slots/hooks';

export default function RightLinks() {
  const widgets = useSlotWidgets();

  return (
    <div className="d-flex flex-column gap-3 align-items-end flex-grow-1 justify-content-between">
      {widgets}
    </div>
  );
}
