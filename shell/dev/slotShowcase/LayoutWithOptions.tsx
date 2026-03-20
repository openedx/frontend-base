import { useLayoutOptions, useWidgets } from '../../../runtime';

export default function LayoutWithOptions() {
  const widgets = useWidgets();
  const options = useLayoutOptions();

  const title = typeof options.title === 'string' ? options.title : 'Foo';

  return (
    <>
      <div className="showcase-layout-title">Layout Title: {title}</div>
      <div>
        {widgets}
      </div>
    </>
  );
}
