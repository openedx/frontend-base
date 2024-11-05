import { ChildMenuItemConfig, LabeledMenuConfig } from '../../types';
import { createComponentMenuItem } from '../menus/data/configHelpers';

import CopyrightNotice from './CopyrightNotice';
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';

export const rightLinks: ChildMenuItemConfig[] = [
  createComponentMenuItem(
    <LanguageMenu />,
  )
];

export const centerLinks: LabeledMenuConfig[] = [];

export const leftLinks: ChildMenuItemConfig[] = [
  createComponentMenuItem(
    <Logo />
  )
];

export const revealMenu = undefined;

export const copyrightNotice = <CopyrightNotice />;
