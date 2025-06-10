import { MetadataRoute } from 'next';
import { routes } from '@/lib/routes';
import { baseUrl } from '@/constants/site.data';

type RouteObject = {
  [key: string]: string | (() => string) | RouteObject;
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Function to recursively get the URLs from the `routes` object
  const getRouteUrls = (routeObject: RouteObject): string[] => {
    return Object.values(routeObject).reduce<string[]>((acc, value) => {
      if (typeof value === 'function') {
        acc.push(value()); // If the value is a function, call it to get the URL
      } else if (typeof value === 'object') {
        // If the value is an object, recursively get its URLs
        acc.push(...getRouteUrls(value));
      }
      return acc;
    }, []);
  };

  // Get all the route URLs from the `routes` object
  const routeUrls = getRouteUrls(routes);

  // Return the sitemap
  return routeUrls.map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    priority: 0.8, // Set a default priority for all URLs, adjust as needed
  }));
}
