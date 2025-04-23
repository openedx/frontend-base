import { useLayoutOptions, useWidgets } from '../../../runtime';

export default function LayoutWithOptions() {
  const widgets = useWidgets();
  const options = useLayoutOptions();

  const title = options.title ?? 'Foo';

  return (
    <>
      <div>Layout Title: <strong>{title}</strong></div>
      <div>
        {widgets}
      </div>
    </>
  );
}
