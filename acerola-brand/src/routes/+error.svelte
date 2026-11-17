<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AcerolaErrorScreen from '#lib/components/acerola-error-screen/acerola-error-screen.svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { errorKind } from '#lib/utils/error.util.ts';
	import { fileUrl } from '#lib/utils/url.util.ts';

	// Any status lands here: 404 from the router (and 404.html on GitHub Pages), 5xx from a load.
	const kind = $derived(
		errorKind(page.status, typeof navigator === 'undefined' ? true : navigator.onLine)
	);
</script>

<svelte:head>
	<title>{m['error.eyebrow']({ status: page.status })} · Acerola</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 sm:px-6">
	<AcerolaErrorScreen
		data={{
			status: page.status,
			kind,
			mascot: fileUrl('/brand/mascot/acerola-mascot.svg'),
			homeHref: resolve('/')
		}}
		events={{ onRetry: () => location.reload(), onBack: () => history.back() }}
		ui={{ page: true }}
	/>
</div>
