import { type MouseEvent } from 'react';

import { useIntl } from '../../runtime';

import messages from '../Shell.messages';

export default function SkipLink() {
  const intl = useIntl();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector<HTMLElement>('main:not([hidden])') ?? document.getElementById('main-content');
    if (target === null) {
      return;
    }
    event.preventDefault();
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus();
    target.scrollIntoView();
  };

  return (
    <a className="sr-only sr-only-focusable" href="#main-content" onClick={handleClick}>
      {intl.formatMessage(messages.skipNavLink)}
    </a>
  );
}
