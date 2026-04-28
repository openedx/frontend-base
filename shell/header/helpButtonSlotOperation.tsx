import { getAppConfig, WidgetAppendOperation, WidgetOperationTypes } from '../../runtime';
import HelpButton from './HelpButton';

export const helpWidgetId = 'org.openedx.frontend.widget.header.help.v1';

export function helpButtonSlotOperation(
  { appId, role }: { appId: string, role: string },
): WidgetAppendOperation {
  return {
    slotId: 'org.openedx.frontend.slot.header.secondaryLinks.v1',
    id: helpWidgetId,
    op: WidgetOperationTypes.APPEND,
    element: (
      <HelpButton
        getUrl={() => getAppConfig(appId).SUPPORT_URL as string | undefined}
      />
    ),
    condition: { active: [role] },
  };
}
