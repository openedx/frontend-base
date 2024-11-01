import { ChildMenuItemConfig, LabeledMenuConfig } from '../../types';

import CopyrightNotice from './CopyrightNotice';
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';

export const rightLinks: ChildMenuItemConfig[] = [
  <LanguageMenu key="language-menu" />,
];

export const centerLinks: LabeledMenuConfig[] = [];

export const leftLinks: ChildMenuItemConfig[] = [
  <Logo key="logo" />
];

export const revealMenu = undefined;

export const copyrightNotice = <CopyrightNotice />;
