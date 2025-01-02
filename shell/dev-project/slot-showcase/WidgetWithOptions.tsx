import { useWidgetOptions } from '../../../runtime';

export default function WidgetWithOptions() {
  const options = useWidgetOptions();

  const title = options.title ?? 'Foo';

  return (
    <div>{title}</div>
  );
}
