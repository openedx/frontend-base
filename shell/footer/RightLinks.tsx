import { useWidgets } from '../../runtime';

export default function RightLinks() {
  const widgets = useWidgets();

  return (
    <div className="d-flex flex-column gap-3 align-items-end flex-grow-1 justify-content-between">
      {widgets}
    </div>
  );
}
