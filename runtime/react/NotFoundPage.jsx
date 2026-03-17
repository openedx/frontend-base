import React, { useState } from 'react';
import {
  Container, Row, Col, Hyperlink,
} from '@openedx/paragon';

import { useSiteEvent } from './hooks';
import {
  FormattedMessage,
  IntlProvider,
  getMessages,
  getLocale,
  LOCALE_CHANGED,
} from '../i18n';


function NotFoundPage() {
  const [locale, setLocale] = useState(getLocale());

  useSiteEvent(LOCALE_CHANGED, () => {
    setLocale(getLocale());
  });

  return (
    <IntlProvider locale={locale} messages={getMessages()}>
      <Container fluid className="py-5 justify-content-center align-items-start text-center">
        <Row>
          <Col>
            <p className="h2 mb-3">
              <FormattedMessage
                id="not.found.page.heading"
                defaultMessage="404"
                description="heading for page not found"
              />
            </p>
            <p className="text-muted">
              <FormattedMessage
                id="not.found.page.message"
                defaultMessage="The page you're looking for could not be found."
                description="message displayed when a page is not found"
              />
            </p>
            <Hyperlink destination="/">
              <FormattedMessage
                id="not.found.page.link.text"
                defaultMessage="Go to the homepage"
                description="link text to navigate to the homepage from a 404 page"
              />
            </Hyperlink>
          </Col>
        </Row>
      </Container>
    </IntlProvider>
  );
}

export default NotFoundPage;
