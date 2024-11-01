import { ChildMenuItem, LabeledMenu } from '../../types';

import CopyrightNotice from './CopyrightNotice';
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';

export const rightLinks: ChildMenuItem[] = [
  <LanguageMenu key="language-menu" />,
];

export const centerLinks: LabeledMenu[] = [];

export const leftLinks: ChildMenuItem[] = [
  <Logo key="logo" />
];

export const revealMenu = undefined;

export const copyrightNotice = <CopyrightNotice />;
