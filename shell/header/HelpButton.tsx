import LinkMenuItem from '../menus/LinkMenuItem';
import messages from '../Shell.messages';

interface HelpButtonProps {
  getUrl: () => string | undefined,
}

export default function HelpButton({ getUrl }: HelpButtonProps) {
  const url = getUrl();
  if (!url) return null;
  return (
    <LinkMenuItem
      label={messages['header.help']}
      url={url}
      variant="navLink"
    />
  );
}
