import companies from '../data/companies.json';

export default function sitemap() {
  const baseUrl = 'https://trackrai.in';

  // Base routes
  const routes = [
    '',
    '/signin',
    '/premium',
    '/companies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Company SEO routes
  const companyRoutes = companies.map((company) => ({
    url: `${baseUrl}/companies/${company.slug}-interview-process`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...routes, ...companyRoutes];
}
