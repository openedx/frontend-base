import React from 'react';
import { FormattedMessage, useIntl } from '@openedx/frontend-base';
import { Dropdown } from '@openedx/paragon';

import { MasqueradeContext } from './MasqueradeContext';
import { MasqueradeUserNameInput } from './MasqueradeUserNameInput';
import { MasqueradeWidgetOption } from './MasqueradeWidgetOption';
import type { UseMasqueradeWidgetReturn } from './hooks';
import messages from './messages';

interface Props {
  masquerade: UseMasqueradeWidgetReturn,
}

export const MasqueradeWidget: React.FC<Props> = ({ masquerade }) => {
  const intl = useIntl();

  const contextValue = React.useMemo(() => ({
    select: masquerade.select,
    selectedOptionName: masquerade.selectedOptionName,
    showUserNameInput: masquerade.showUserNameInput,
  }), [masquerade.select, masquerade.selectedOptionName, masquerade.showUserNameInput]);

  const specificLearnerInputText = intl.formatMessage(messages.placeholder);

  return (
    <MasqueradeContext.Provider value={contextValue}>
      <div className="flex-grow-1">
        <div className="row">
          <span className="col-auto col-form-label pl-3"><FormattedMessage {...messages.titleViewAs} /></span>
          <Dropdown className="flex-shrink-1 mx-1">
            <Dropdown.Toggle id="masquerade-widget-toggle" variant="inverse-outline-primary">
              {masquerade.selectedOptionName ?? intl.formatMessage(messages.titleStaff)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {masquerade.available.map(option => (
                <MasqueradeWidgetOption
                  key={option.name}
                  option={option}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {masquerade.showUserNameInput && (
          <div className="row mt-2">
            <span className="col-auto col-form-label pl-3" id="masquerade-search-label">{`${specificLearnerInputText}:`}</span>
            <MasqueradeUserNameInput
              id="masquerade-search"
              className="col-4"
              userName={masquerade.userName}
              setUserName={masquerade.setUserName}
              onSubmit={masquerade.handleUserNameSubmit}
              autoFocus={masquerade.autoFocus}
              isPending={masquerade.isPending}
              mutationErrorMessage={masquerade.mutationErrorMessage}
            />
          </div>
        )}
      </div>
    </MasqueradeContext.Provider>
  );
};
