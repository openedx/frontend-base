import { Collapsible } from '@openedx/paragon';

interface MobileMenuProps {
  mainMenuDropdowns?: Array<{
    id: string,
    buttonTitle: string,
    items: Array<{
      href: string,
      title: string,
    }>,
  }>,
}

export default function MobileMenu({
  mainMenuDropdowns = [],
}: MobileMenuProps) {
  return (
    <div
      className="ml-4 p-2 bg-light-100 border border-gray-200 small rounded"
      data-testid="mobile-menu"
    >
      <div>
        {mainMenuDropdowns.map(dropdown => {
          const { id, buttonTitle, items } = dropdown;
          return (
            <Collapsible
              className="border-light-100"
              title={buttonTitle}
              key={id}
            >
              <ul className="p-0" style={{ listStyleType: 'none' }}>
                {items.map(item => (
                  <li key={item.href} className="mobile-menu-item">
                    <a href={item.href}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
