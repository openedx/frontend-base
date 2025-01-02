import { useWidgets } from '../../runtime';

export default function LeftLinks() {
  const widgets = useWidgets();

  return (
    <div className="d-flex flex-column">
      {widgets}
    </div>
  );
}
