import { Hyperlink, Image } from '@openedx/paragon';
import { useIntl } from 'react-intl';
import messages from '../../Shell.messages';

export default function PoweredBy() {
  const intl = useIntl();
  return (
    <Hyperlink destination="https://openedx.org">
      <Image
        width="120px"
        alt={intl.formatMessage(messages.footerPoweredBy)}
        src="https://logos.openedx.org/open-edx-logo-tag.png"
      />
    </Hyperlink>
  );
}
