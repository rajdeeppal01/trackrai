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

  // Compare SEO routes
  const compareRoutes = ['teal', 'huntr', 'simplify'].map((competitor) => ({
    url: `${baseUrl}/compare/${competitor}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Resource SEO routes
  const resourceRoutes = [
    'software-engineer',
    'product-manager',
    'data-scientist',
    'marketing-manager',
    'sales-sdr'
  ].map((role) => ({
    url: `${baseUrl}/resources/cold-email-templates/${role}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...routes, ...companyRoutes, ...compareRoutes, ...resourceRoutes];
}
