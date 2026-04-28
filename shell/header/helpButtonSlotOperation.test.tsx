import { isValidElement } from 'react';
import { WidgetOperationTypes } from '../../runtime';
import { mergeAppConfig } from '../../runtime/config';
import { helpButtonSlotOperation, helpWidgetId } from './helpButtonSlotOperation';

const TEST_APP_ID = 'org.openedx.frontend.app.test';
const TEST_ROLE = 'org.openedx.frontend.role.test';

describe('helpButtonSlotOperation', () => {
  it('returns an APPEND operation targeting secondaryLinks with the shared help widget id', () => {
    const op = helpButtonSlotOperation({ appId: TEST_APP_ID, role: TEST_ROLE });
    expect(op.slotId).toBe('org.openedx.frontend.slot.header.secondaryLinks.v1');
    expect(op.id).toBe(helpWidgetId);
    expect(op.op).toBe(WidgetOperationTypes.APPEND);
    expect(op.condition).toEqual({ active: [TEST_ROLE] });
  });

  it('produces a HelpButton element whose getUrl resolves SUPPORT_URL from the registering appId', () => {
    mergeAppConfig(TEST_APP_ID, { SUPPORT_URL: 'https://help.example.com/test' });

    const op = helpButtonSlotOperation({ appId: TEST_APP_ID, role: TEST_ROLE });
    expect(isValidElement(op.element)).toBe(true);

    const getUrl = (op.element as React.ReactElement<{ getUrl: () => string | undefined }>).props.getUrl;
    expect(getUrl()).toBe('https://help.example.com/test');

    mergeAppConfig(TEST_APP_ID, { SUPPORT_URL: 'https://help.example.com/updated' });
    expect(getUrl()).toBe('https://help.example.com/updated');
  });
});
