import { useLayoutOptions, useSlotWidgets } from '../../../runtime/slots/data/hooks';

export default function LayoutWithOptions() {
  const widgets = useSlotWidgets();
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
