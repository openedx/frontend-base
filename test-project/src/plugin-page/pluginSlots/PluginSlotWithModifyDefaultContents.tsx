import { PluginSlot } from '@openedx/frontend-base';
import { Stack } from '@openedx/paragon';
import classNames from 'classnames';
import { MouseEvent } from 'react';

interface LinkExampleProps {
  href: string,
}
// Example sub-components used as the default childen within a PluginSlot
const LinkExample = ({ href, ...rest }: LinkExampleProps) => {
  return <a href={href} {...rest}>Hello world</a>;
};

interface UsernameProps {
  className: string,
  onClick: (event: MouseEvent) => void,
}

const Username = ({ className, onClick, ...rest }: UsernameProps) => {
  const authenticatedUser = { username: 'testuser' };
  const { username } = authenticatedUser;
  return (
    <span
      className={classNames('default-classname', className)}
      onClick={(e) => {
        console.log('Username clicked!', 'default', e);
        onClick?.(e);
      }}
      {...rest}
    >
      {username}
    </span>
  );
};

interface UsernameWithPluginContentProps {
  className: string,
  onClick: (event: MouseEvent) => void,
  content?: {
    className?: string,
    onClick?: (event: MouseEvent) => void,
  },
}

function UsernameWithPluginContent({ className, onClick, content = {} }: UsernameWithPluginContentProps) {
  const {
    className: classNameFromPluginContent,
    onClick: onClickFromPluginContent,
    ...contentRest
  } = content;
  const updatedProps = {
    className: classNames(className, classNameFromPluginContent),
    onClick: (e) => {
      onClick?.(e);
      onClickFromPluginContent?.(e);
    },
  };
  return <Username {...updatedProps} {...contentRest} />;
};

interface PluginSlotWithModifyDefaultContentsProps {
  id: string,
  label: string,
}

// Example PluginSlot usage.
export default function PluginSlotWithModifyDefaultContents({ id, label }: PluginSlotWithModifyDefaultContentsProps) {
  return (
    <div className="border border-primary px-3">
      <h3 id={id}>{label}</h3>
      <p>
        The following <code>PluginSlot</code> examples demonstrate the <code>PluginOperationTypes.MODIFY</code> operation, when
        the <code>widgetId</code> is <code>default_contents</code>. Any configured, custom plugin <code>content</code> may be
        merged with any existing props passed to the component(s) represented by <code>default_contents</code>.
      </p>

      <Stack gap={4.5}>
        <div>
          <h4>Basic</h4>
          <PluginSlot
            id="slot_with_hyperlink"
            as="div"
            slotOptions={{
              mergeProps: true,
            }}
          >
            <LinkExample href="https://google.com" />
          </PluginSlot>
        </div>
        <div>
          <h4>Advanced</h4>
          <p>When adding custom props to <code>default_contents</code>, there may be special cases regarding how custom props are merged with existing props, including:</p>
          <ul>
            <li>Custom <code>className</code> overrides are concatenated with the <code>className</code> prop passed to the <code>default_contents</code> component(s), if any.</li>
            <li>Custom <code>style</code> overrides are shallow merged with the <code>style</code> prop passed to the <code>default_contents</code> component(s), if any.</li>
            <li>Custom event handlers (e.g., <code>onClick</code>) are executed in sequence, after any event handlers passed to the <code>default_contents</code> component(s), if any.</li>
          </ul>
          <PluginSlot
            id="slot_with_username_pii"
            as="div"
          // Default slotOptions
          >
            <UsernameWithPluginContent
              className="testing"
              onClick={(e) => {
                console.log('Username clicked!', 'prop', e);
              }}
            />
          </PluginSlot>
          <PluginSlot
            id="slot_with_username_pii"
            as="div"
            slotOptions={{ mergeProps: true }}
          >
            <Username
              className="d-block abc123"
              onClick={(e) => {
                console.log('Username clicked!', 'prop', e);
              }}
            />
          </PluginSlot>
          <PluginSlot
            id="slot_with_username_pii"
            as="div"
            pluginProps={{
              className: 'bg-accent-b',
              onClick: (e) => {
                console.log('Username clicked!', 'pluginProps', e);
              },
            }}
            slotOptions={{ mergeProps: true }}
          >
            <Username
              className="ghi789"
              onClick={(e) => {
                console.log('Username clicked!', 'prop', e);
              }}
            />
          </PluginSlot>
        </div>
      </Stack>
    </div>
  );
}
