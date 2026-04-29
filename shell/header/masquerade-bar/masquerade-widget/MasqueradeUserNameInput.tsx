import React from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Form } from '@openedx/paragon';

import { useMasqueradeContext } from './MasqueradeContext';
import { Payload } from './data/api';
import messages from './messages';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSubmit' | 'onError'>;

export const MasqueradeUserNameInput: React.FC<Props> = ({ ...otherProps }) => {
  const { onSubmit, onError } = useMasqueradeContext();
  const intl = useIntl();

  const handleSubmit = React.useCallback((userIdentifier: string) => {
    const payload: Payload = {
      role: 'student',
      user_name: userIdentifier, // user name or email
    };
    onSubmit(payload).then((data) => {
      if (data && data.success) {
        global.location.reload();
      } else {
        const error = (data && data.error) || '';
        onError(error);
      }
    }).catch(() => {
      const message = intl.formatMessage(messages.genericError);
      onError(message);
    });
    return true;
  }, [onSubmit, onError, intl]);

  const handleKeyPress = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      return handleSubmit(event.currentTarget.value);
    }
    return true;
  }, [handleSubmit]);

  return (
    <Form.Control
      aria-labelledby="masquerade-search-label"
      label={intl.formatMessage(messages.userNameLabel)}
      onKeyPress={handleKeyPress}
      {...otherProps}
    />
  );
};
