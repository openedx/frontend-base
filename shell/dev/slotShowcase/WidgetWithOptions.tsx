import { useWidgetOptions } from '../../../runtime';

export default function WidgetWithOptions() {
  const options = useWidgetOptions();

  const title = typeof options.title === 'string' ? options.title : 'Foo';

  return (
    <div>{title}</div>
  );
}
