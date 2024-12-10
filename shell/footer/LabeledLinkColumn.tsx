import { useSlotOptions, useSlotWidgets } from '../../runtime/slots/hooks';

export default function LabeledLinkColumn() {
  const widgets = useSlotWidgets();
  const options = useSlotOptions();

  if (widgets.length === 0) {
    return null;
  }

  return (
    <div className="d-flex flex-grow-1 flex-column gap-2 small">
      {options.label && (
        <div className="mb-1 font-weight-bold">{options.label}</div>
      )}
      {widgets}
    </div>
  );
}
