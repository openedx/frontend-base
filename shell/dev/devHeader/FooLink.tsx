import { useContext } from 'react';
import { Icon } from '@openedx/paragon';
import { Kitesurfing } from '@openedx/paragon/icons';

import FooContext from './FooContext';

export default function FooLink() {
  const { foo } = useContext(FooContext);

  return (
    <div className="d-flex">
      <Icon src={Kitesurfing} className="mr-2" />
      <span>{foo}</span>
    </div>
  );
}
