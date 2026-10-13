const home = () => '/';
const aboutUs = () => '/about-us';
const products = () => '/products';
const productCategory = (category: string) => `${products()}?category=${category}`;
const productDetails = (category: string, slug: string) =>
  `${products()}/${category}/${slug}`;
const designCase = () => '/design-case';
const designCaseDetails = (slug: string) => `${designCase()}/${slug}`;
const contactUs = () => '/contact-us';
const privacy = () => '/privacy-policy';
const terms = () => '/terms-and-conditions';

const admin = {
  home: () => '/admin',
  login: () => '/admin/login',
  analytics: () => '/admin/analytics',
  logs: () => '/admin/logs',
  products: () => '/admin/products',
  product: (id: number | 'new') => `/admin/products/${id}`,
  categories: () => '/admin/categories',
  designCases: () => '/admin/design-cases',
  designCase: (id: number | 'new') => `/admin/design-cases/${id}`,
  media: () => '/admin/media',
  pages: (section?: string) => `/admin/pages${section ? `/${section}` : ''}`,
  settings: () => '/admin/settings',
  inbox: () => '/admin/inbox',
  subscribers: () => '/admin/subscribers',
  users: () => '/admin/users',
};

export const routes = {
  home,
  aboutUs,
  products,
  productCategory,
  productDetails,
  designCase,
  designCaseDetails,
  contactUs,
  privacy,
  terms,
  admin,
};

/** Static public pages, used for the sitemap. */
export const staticPages = [home(), aboutUs(), products(), designCase(), contactUs(), privacy(), terms()];
