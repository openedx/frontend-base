import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { IntlProvider } from '../../../runtime/i18n';
import { runPageRules } from '../../rules';
import SlotShowcasePage from './SlotShowcasePage';

describe('SlotShowcasePage', () => {
  it('satisfies the page rules', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <SlotShowcasePage />
        </MemoryRouter>
      </IntlProvider>
    );
    expect(runPageRules(document)).toEqual([]);
  });
});
