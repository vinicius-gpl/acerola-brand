import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

/**
 * Where the brand files (zips, svgs, fonts, css) live when they are not shipped with the site.
 * Empty: the site points to its own copy in static/brand with a relative path and works on any
 * URL. On GitHub Pages the workflow passes ASSETS_URL=https://<R2 bucket>, and the page's
 * download and CDN links point there.
 */
const assetsUrl = (process.env.ASSETS_URL ?? '').replace(/\/+$/, '');

/** Public address of the site, for the absolute links in sitemap.xml and robots.txt. */
const siteUrl = (process.env.SITE_URL || 'https://brand.acerola.app').replace(/\/+$/, '');

export default defineConfig({
	define: { __ASSETS_URL__: JSON.stringify(assetsUrl), __SITE_URL__: JSON.stringify(siteUrl) },
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Runes across the project, except in libraries. Can go away with Svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// fallback: GitHub Pages serves 404.html for any missing address; it boots the app, which
			// renders +error.svelte with the right status.
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				strict: true
			}),
			// Relative paths in the generated HTML: the same build opens at /, at GitHub Pages'
			// /<repo> or at a bucket root, without configuring a base.
			paths: { relative: true },
			// The navigation examples use illustrative anchors (#list, #settings) that do not exist.
			prerender: { handleMissingId: 'warn' }
		})
	]
});
