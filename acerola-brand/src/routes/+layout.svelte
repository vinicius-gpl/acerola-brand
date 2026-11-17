<script lang="ts">
	import 'lenis/dist/lenis.css';
	import './layout.css';
	import AcerolaTopbar from '#lib/components/acerola-topbar/acerola-topbar.svelte';
	import { page } from '$app/state';
	import { useLocale } from '#lib/hooks/use-locale/use-locale.svelte.ts';
	import { useSmoothScroll } from '#lib/hooks/use-smooth-scroll/use-smooth-scroll.svelte.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { fileUrl } from '#lib/utils/url.util.ts';
	import tokens from '../../static/brand/tokens.json';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Applies the stored/browser locale after mount (the prerendered HTML is in the base locale).
	useLocale();
	useSmoothScroll();
</script>

<svelte:head>
	<link rel="stylesheet" href={fileUrl('/brand/css/fonts.css')} />
	<!-- Favicon: the foreground SVG only. acerola-logo.svg (with a plate) is an image, never an icon. -->
	<link
		rel="icon"
		href={fileUrl('/brand/logo/acerola-logo-foreground.svg')}
		type="image/svg+xml"
	/>
	<meta name="description" content={m['site.description']()} />
	<!-- The browser needs a literal color: it comes from the background token, no hex in code. -->
	<meta name="theme-color" content={tokens.dark.background} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Acerola" />
	<meta property="og:title" content={m['site.title']()} />
	<meta property="og:description" content={m['site.description']()} />
</svelte:head>

<!-- The error screen stands alone: no topbar or footer, only the error and its actions. -->
{#if !page.error}
	<AcerolaTopbar />
{/if}

<main>{@render children()}</main>

{#if !page.error}
	<footer class="mt-10 bg-mantle">
		<div
			class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6"
		>
			<span class="flex items-center gap-2">
				<img
					src={fileUrl('/brand/logo/acerola-logo-foreground.svg')}
					alt=""
					class="size-6"
				/>
				<span class="font-black tracking-tight text-foreground">Acerola</span>
			</span>
			<span>{m['site.footer']()}</span>
		</div>
	</footer>
{/if}
