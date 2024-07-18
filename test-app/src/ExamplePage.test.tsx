// eslint-disable-next-line import/no-extraneous-dependencies
import renderer from 'react-test-renderer';

import ExamplePage from './ExamplePage';

describe('example', () => {
  it('will pass because it is an example', () => {
    const Component = <ExamplePage />;
    const tree = renderer.create(Component);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
