import {
  getAuthenticatedUser,
  getConfig,
  logInfo,
  useAuthenticatedUser,
  useConfig,
  useIntl
} from '@openedx/frontend-base';
import { Container } from '@openedx/paragon';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import messages from '../messages';
import Image from './Image';
import ParagonPreview from './ParagonPreview';
import appleImg from './apple.jpg';
import appleUrl from './apple.svg';

function printTestResult(value) {
  return value ? '✅' : '❌';
}

export default function ExamplePage() {
  const config = useConfig();
  const authenticatedUser = useAuthenticatedUser();

  const intl = useIntl();

  useEffect(() => {
    logInfo('The example page can log info, which means logging is configured correctly.');
  }, []);

  return (
    <Container>
      <h1>{config.siteName} test page</h1>

      <h2>Links</h2>
      <p>Visit <Link to="/authenticated">authenticated page</Link>.</p>
      <p>Visit <Link to="/error">error page</Link>.</p>

      <h2>Context Config Test</h2>
      <p>Is context.config equal to getConfig()? {printTestResult(config === getConfig())}</p>
      <p>Is context.authenticatedUser equal to getAuthenticatedUser()? {printTestResult(authenticatedUser === getAuthenticatedUser())}</p>

      <h2>SCSS parsing tests</h2>
      <p><span className="red-text">&quot;The Apples&quot;</span> should be red (<code>color: red;</code> via <code>.red-text</code> CSS class in SCSS stylesheet)</p>

      <h2>TSX parsing tests</h2>
      <Image src={appleUrl} alt="apple.svg displayed in Image.tsx" style={{ width: '10rem' }} />

      <h2>SVG import test</h2>
      <img src={appleUrl} alt="apple.svg displayed in <img> tag" style={{ width: '10rem' }} />

      <h2>JPG import test</h2>
      <p><img src={appleImg} alt="apple.jpg displayed in <img> tag" style={{ width: '10rem' }} /></p>
      <p>Photo by Louis Hansel @shotsoflouis on Unsplash</p>

      <h2>i18n formatMessage test</h2>
      <p>{intl.formatMessage(messages['test-site.message'])}</p>

      <h2>Authenticated User Test</h2>
      {authenticatedUser !== null ? (
        <div>
          <p>Authenticated Username: <strong>{authenticatedUser.username}</strong></p>
          <p>
            Authenticated user&apos;s name:
            <strong>{authenticatedUser.username}</strong>
            (Only available if user account has been fetched)
          </p>
        </div>
      ) : (
        <p>Unauthenticated {printTestResult(authenticatedUser === null)}</p>
      )}

      <h2>Right-to-left language handling tests</h2>
      <p className="text-align-right">I&apos;m aligned right, but left in RTL.</p>
      <ParagonPreview />
    </Container>
  );
}
