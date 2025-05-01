// company pages

const home = () => '/';
const aboutUs = () => '/about-us';
const products = () => '/products';
const productDetails = (id: string = '') => `${products()}/${id}`;
const designCase = () => '/design-case';
const designCaseDetails = (id: string = '') => `${designCase()}/${id}`;
const contactUs = () => '/contact-us';

// product pages
const decking = () => `${products()}/decking`;
const compositeFlooring = () => `${products()}/composite-flooring`;
const compositeCeilings = () => `${products()}/composite-ceilings`;
const wallPanels = () => `${products()}/wall-panels`;
const compositeFencing = () => `${products}/composite-fencing`;

const privacy = () => '/privacy-policy';
const terms = () => '/terms-and-conditions';

export const routes = {
  home,
  aboutUs,
  products,
  productDetails,
  designCase,
  designCaseDetails,
  contactUs,
  decking,
  compositeFlooring,
  compositeCeilings,
  wallPanels,
  compositeFencing,
  privacy,
  terms,
};
