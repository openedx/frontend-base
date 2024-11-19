import { PluginSlot } from '@openedx/frontend-base';

interface PluginSlotWithoutDefaultProps {
  id: string,
  label: string,
}

function PluginSlotWithoutDefault({ id, label }: PluginSlotWithoutDefaultProps) {
  return (
    <div className="border border-primary">
      <h3 id={id} className="pl-3">{label}</h3>
      <PluginSlot
        id="slot_without_default"
      >
      </PluginSlot>
    </div>
  );
}
export default PluginSlotWithoutDefault;
