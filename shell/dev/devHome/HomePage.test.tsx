import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { IntlProvider } from '../../../runtime/i18n';
import { runPageRules } from '../../rules';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('satisfies the page rules', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </IntlProvider>
    );
    expect(runPageRules(document)).toEqual([]);
  });
});
