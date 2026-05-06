import { FormEvent } from 'react';
import { useIntl } from '@openedx/frontend-base';
import {
  Form, FormControl, FormGroup, StatefulButton,
} from '@openedx/paragon';

import { useMasqueradeContext } from '../MasqueradeContext';
import messages from './messages';

interface Props {
  id?: string,
  className?: string,
  autoFocus?: boolean,
}

export function MasqueradeUserNameInput({ id, className, autoFocus }: Props) {
  const { formatMessage } = useIntl();
  const {
    userName, setUserName, submitUserName, isSubmitting,
  } = useMasqueradeContext();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitUserName();
  };

  return (
    <Form className={`d-flex align-items-center ${className ?? ''}`} onSubmit={handleSubmit}>
      <FormGroup controlId={id} className="flex-grow-1 mb-0 mr-2">
        <FormControl
          autoFocus={autoFocus}
          value={userName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserName(event.target.value)}
        />
      </FormGroup>
      <StatefulButton
        type="submit"
        variant="brand"
        state={isSubmitting ? 'pending' : 'default'}
        disabled={!userName}
        labels={{
          default: formatMessage(messages.submit),
          pending: formatMessage(messages.submitting),
        }}
      />
    </Form>
  );
}
