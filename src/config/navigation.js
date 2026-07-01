import { ROUTES } from './routes';

/**
 * Single source of truth for all navigation links.
 * Used by Navbar, MobileSidebar, and Footer.
 *
 * @typedef {'main' | 'account' | 'company' | 'legal'} NavGroup
 * @type {Array<{ path: string, i18nKey: string, group: NavGroup, authOnly?: boolean }>}
 */
export const NAV_ITEMS = [
  // Main navigation
  { path: ROUTES.HOME, i18nKey: 'nav.home', group: 'main' },
  { path: ROUTES.COURSE, i18nKey: 'nav.course', group: 'main' },
  { path: ROUTES.SKILLTREE, i18nKey: 'nav.skilltree', group: 'main' },
  { path: ROUTES.SHOP, i18nKey: 'nav.shop', group: 'main' },

  // Logged-in only
  { path: ROUTES.PROFILE, i18nKey: 'nav.profile', group: 'account', authOnly: true },
  { path: ROUTES.DASHBOARD, i18nKey: 'nav.dashboard', group: 'account', authOnly: true },

  // Company
  { path: '/benefits', i18nKey: 'nav.benefits', group: 'company' },
  { path: ROUTES.TEAM, i18nKey: 'footer.team', group: 'company' },
  { path: ROUTES.CONTACT, i18nKey: 'footer.contact', group: 'company' },

  // Legal
  { path: ROUTES.TERMS, i18nKey: 'footer.terms', group: 'legal' },
  { path: ROUTES.PRIVACY, i18nKey: 'footer.privacy', group: 'legal' },
];

/** Filter helpers */
export const getMainNav = () => NAV_ITEMS.filter(i => i.group === 'main');
export const getAccountNav = () => NAV_ITEMS.filter(i => i.group === 'account');
export const getCompanyNav = () => NAV_ITEMS.filter(i => i.group === 'company');
export const getLegalNav = () => NAV_ITEMS.filter(i => i.group === 'legal');
export const getPublicNav = () => NAV_ITEMS.filter(i => !i.authOnly);
export const getFooterNav = () => NAV_ITEMS.filter(i => i.group === 'main' || i.group === 'company');
