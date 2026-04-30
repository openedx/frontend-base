import React from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Form, StatefulButton } from '@openedx/paragon';
import type { MessageDescriptor } from 'react-intl';

import messages from './messages';

interface Props {
  userName: string,
  setUserName: (value: string) => void,
  onSubmit: () => void,
  isPending?: boolean,
  mutationErrorMessage: MessageDescriptor | string | null,
  autoFocus?: boolean,
  className?: string,
  id?: string,
}

export const MasqueradeUserNameInput: React.FC<Props> = ({
  userName,
  setUserName,
  onSubmit,
  isPending = false,
  mutationErrorMessage,
  autoFocus,
  className,
  id,
}) => {
  const intl = useIntl();
  const isInvalid = Boolean(mutationErrorMessage);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  }, [onSubmit]);

  return (
    <div className={className} id={id}>
      <div className="d-flex align-items-start gap-2">
        <Form.Group isInvalid={isInvalid} className="mb-0 flex-grow-1">
          <Form.Control
            value={userName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
            label={intl.formatMessage(messages.userNameLabel)}
            aria-label={intl.formatMessage(messages.userNameLabel)}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
          />
          {isInvalid && (
            <Form.Control.Feedback type="invalid" hasIcon={false}>
              {mutationErrorMessage && (
                typeof mutationErrorMessage === 'string'
                  ? mutationErrorMessage
                  : intl.formatMessage(mutationErrorMessage)
              )}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <StatefulButton
          variant="brand"
          state={isPending ? 'pending' : 'default'}
          labels={{
            default: intl.formatMessage(messages.submit),
            pending: intl.formatMessage(messages.submitting),
          }}
          onClick={onSubmit}
          disabled={!userName.trim()}
        />
      </div>
    </div>
  );
};
