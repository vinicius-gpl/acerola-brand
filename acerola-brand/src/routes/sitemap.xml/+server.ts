// Every page of the site, found from the routes at build time: a new page enters the sitemap alone.
const pages = Object.keys(import.meta.glob('../**/+page.svelte'))
	.map((file) => file.replace(/^\.\.\//, '/').replace(/\+page\.svelte$/, ''))
	.filter((path) => !path.includes('['))
	.sort();

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	const urls = pages.map((path) => `\t<url><loc>${__SITE_URL__}${path}</loc></url>`).join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
