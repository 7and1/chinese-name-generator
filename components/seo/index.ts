export {
  JsonLd,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateFAQPageSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema,
  generateVideoSchema,
  generateCollectionPageSchema,
  generateHowToSchema,
} from "./json-ld";

export { Breadcrumb, getDefaultBreadcrumbItems } from "./breadcrumb";
export type { BreadcrumbItem } from "./breadcrumb";

export { MetaTags, getDefaultOpenGraphProps } from "./meta-tags";
export type { MetaTagsProps } from "./meta-tags";
