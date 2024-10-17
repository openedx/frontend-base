import { Image, NavLink } from '@openedx/paragon';

import { useConfig } from '../../runtime';

export default function Logo() {
  const config = useConfig();
  return (
    <NavLink href={`${config.LEARNER_DASHBOARD_URL}`} className="p-0">
      <Image src={config.LOGO_URL} style={{ maxHeight: '2rem' }} />
    </NavLink>
  );
}
