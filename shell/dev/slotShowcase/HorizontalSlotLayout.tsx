import { Stack } from '@openedx/paragon';
import { useWidgets } from '../../../runtime';

export default function HorizontalSlotLayout() {
  const widgets = useWidgets();

  return (
    <Stack direction="horizontal" gap={3}>
      {widgets}
    </Stack>
  );
}
