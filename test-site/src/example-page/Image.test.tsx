import { render, screen } from '@testing-library/react';

import appleUrl from './apple.svg';
import Image from './Image';

describe('Image', () => {
  it('renders with the asset url supplied by the svg mock', () => {
    render(<Image src={appleUrl} alt="An apple" />);

    expect(screen.getByAltText('An apple')).toHaveAttribute('src', 'SvgURL');
  });
});
