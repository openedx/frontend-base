import { render, screen } from '@testing-library/react';
import { lazy } from 'react';

import { useRemoteComponent } from '../../../../shell/federation/hooks';
import FederatedWidget from './FederatedWidget';

jest.mock('../../../../shell/federation/hooks', () => ({
  useRemoteComponent: jest.fn(),
}));

jest.mock('@openedx/paragon', () => ({
  Spinner: jest.fn(() => <div>Loading...</div>),
}));

describe('FederatedWidget', () => {
  const mockComponent = () => <div>Remote Component</div>;

  it('renders the loading spinner while the component is loading', () => {
    (useRemoteComponent as jest.Mock).mockReturnValue(lazy(() => new Promise(() => {})));

    render(<FederatedWidget remoteId="testRemote" moduleId="testModule" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the remote component when loaded', async () => {
    (useRemoteComponent as jest.Mock).mockReturnValue(mockComponent);

    render(<FederatedWidget remoteId="testRemote" moduleId="testModule" />);

    expect(await screen.findByText('Remote Component')).toBeInTheDocument();
  });
});
