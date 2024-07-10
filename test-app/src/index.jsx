import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  subscribe
} from '@openedx/frontend-base/runtime';
import {
  AppProvider,
  AuthenticatedPageRoute,
  ErrorPage,
  PageWrap,
} from '@openedx/frontend-base/runtime/react';
import ReactDOM from 'react-dom';
import {
  Route,
  Routes
} from 'react-router-dom';

import AuthenticatedPage from './AuthenticatedPage';
import ExamplePage from './ExamplePage';

import './style.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <Routes>
        <Route path="/" element={<PageWrap><ExamplePage /></PageWrap>} />
        <Route
          path="/error"
          element={<PageWrap><ErrorPage message="Test error message" /></PageWrap>}
        />
        <Route path="/authenticated" element={<AuthenticatedPageRoute><AuthenticatedPage /></AuthenticatedPageRoute>} />
      </Routes>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [],
  requireAuthenticatedUser: false,
  hydrateAuthenticatedUser: true,
  handlers: {
    auth: () => { },
  }
});
