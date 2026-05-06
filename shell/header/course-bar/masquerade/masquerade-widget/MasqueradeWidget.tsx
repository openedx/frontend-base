import { useId } from 'react';
import { useIntl, FormattedMessage } from '@openedx/frontend-base';
import { Dropdown } from '@openedx/paragon';

import { MasqueradeUserNameInput } from './MasqueradeUserNameInput';
import { MasqueradeWidgetOption } from './MasqueradeWidgetOption';
import { useMasqueradeContext } from '../MasqueradeContext';
import messages from './messages';

export function MasqueradeWidget() {
  const { formatMessage } = useIntl();
  const inputId = useId();
  const {
    active, available, pendingOption, showUserNameInput,
  } = useMasqueradeContext();

  return (
    <div className="flex-grow-1">
      <div className="row">
        <span className="col-auto col-form-label pl-3">
          <FormattedMessage {...messages.titleViewAs} />
        </span>
        <Dropdown className="flex-shrink-1 mx-1">
          <Dropdown.Toggle id="masquerade-widget-toggle" variant="inverse-outline-primary">
            {pendingOption?.name
            ?? active.groupName
            ?? active.userName
            ?? formatMessage(messages.titleStaff)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {available.map(option => (
              <MasqueradeWidgetOption key={option.name} option={option} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {showUserNameInput && (
        <div className="row mt-2">
          <label htmlFor={inputId} className="col-auto col-form-label pl-3 mb-0">
            {`${formatMessage(messages.userNameLabel)}:`}
          </label>
          <MasqueradeUserNameInput id={inputId} className="col-4" autoFocus />
        </div>
      )}
    </div>
  );
}
