export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	const body = `User-agent: *
Allow: /

Sitemap: ${__SITE_URL__}/sitemap.xml
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
