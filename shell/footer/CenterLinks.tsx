import { useSlotWidgets } from '../../runtime/slots/data/hooks';

export default function CenterLinks() {
  const widgets = useSlotWidgets();

  return (
    <div className="d-flex flex-wrap column-gap-6 row-gap-4">
      {widgets}
    </div>
  );
}
