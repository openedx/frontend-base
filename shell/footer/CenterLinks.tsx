import { useWidgets } from '../../runtime';

export default function CenterLinks() {
  const widgets = useWidgets();

  return (
    <div className="d-flex flex-wrap column-gap-6 row-gap-4">
      {widgets}
    </div>
  );
}
