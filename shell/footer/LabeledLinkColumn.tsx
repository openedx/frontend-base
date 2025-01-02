import { useLayoutOptions, useSlotWidgets } from '../../runtime/slots/data/hooks';

export default function LabeledLinkColumn() {
  const widgets = useSlotWidgets();
  const options = useLayoutOptions();

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
