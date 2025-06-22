import { useContext } from 'react';
import { Icon } from '@openedx/paragon';
import { CrisisAlert } from '@openedx/paragon/icons';

import BarContext from './BarContext';

export default function BarLink() {
  const { bar } = useContext(BarContext);

  return (
    <div className="d-flex">
      <Icon src={CrisisAlert} className="mr-2" />
      <span>{bar}</span>
    </div>
  );
}
