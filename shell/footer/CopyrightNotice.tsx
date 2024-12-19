import { Hyperlink } from '@openedx/paragon';

import { useConfig } from '../../runtime';

interface CopyrightNoticeProps {
  title?: string,
  /**
   * The URL that the copyright notice should link to when a user clicks on the title.  If not set,
   * the title will not be a link.
   */
  destination?: string,
}

export default function CopyrightNotice({ title, destination }: CopyrightNoticeProps) {
  const config = useConfig();

  // Allow overrides via props and fallback to defaults.
  const finalTitle = title ?? config.siteName;

  return (
    <div className="text-center x-small">
      <span>&copy;&nbsp;{new Date().getFullYear()}&nbsp;</span>
      {destination !== undefined ? (
        <Hyperlink
          destination={destination}
          target="_blank"
        >
          {finalTitle}
        </Hyperlink>
      ) : (
        <span>{finalTitle}</span>
      )}
      <span>.</span>
    </div>
  );
}
