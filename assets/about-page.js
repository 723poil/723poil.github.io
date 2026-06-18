import { aboutPage, profile } from '../data/profile.js';
import { pageContent, secondaryNav } from '../data/site.js';
import { applyPageMeta, renderAboutPage, renderSiteChrome } from './main.js';

applyPageMeta(pageContent.about);
renderSiteChrome({ profile, navItems: secondaryNav, currentHref: '/about/' });
renderAboutPage(aboutPage);
