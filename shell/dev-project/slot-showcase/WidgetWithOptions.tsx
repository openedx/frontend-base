import { useWidgetOptions } from '../../../runtime/slots/data/hooks';

export default function WidgetWithOptions() {
  const options = useWidgetOptions();

  const title = options.title ?? 'Foo';

  return (
    <div>{title}</div>
  );
}
