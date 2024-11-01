import { Hyperlink } from '@openedx/paragon';

import { useConfig } from '../../runtime';

interface CopyrightNoticeProps {
  title?: string,
  /**
   * The URL that the copyright notice should link to when a user clicks on the title.  A destination of `null` means the title should not be a link.
   *
   * @default SiteConfig.MARKETING_SITE_BASE_URL
   */
  destination?: string | null,
}

export default function CopyrightNotice({ title, destination }: CopyrightNoticeProps) {
  const config = useConfig();

  // Allow overrides via props and fallback to defaults.
  const finalTitle = title ?? config.SITE_NAME;
  // If destination has explicitly been set to 'null', that means no link.
  const finalDestination = destination !== undefined ? destination : config.MARKETING_SITE_BASE_URL;
  return (
    <span>
      <span>&copy;&nbsp;{new Date().getFullYear()}&nbsp;</span>
      {finalDestination !== null ? (
        <Hyperlink
          destination={config.MARKETING_SITE_BASE_URL}
          target="_blank"
        >
          {finalTitle}
        </Hyperlink>
      ) : (
        <span>{finalTitle}</span>
      )}
      <span>.</span>
    </span>
  );
}
