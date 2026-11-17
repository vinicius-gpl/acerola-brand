// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	/** Address of the bucket with the brand files (vite.config.ts). Empty: the site's own copy. */
	const __ASSETS_URL__: string;
	const __SITE_URL__: string;
}

export {};
