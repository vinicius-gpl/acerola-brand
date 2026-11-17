<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { errorAction, type ErrorKind } from '#lib/utils/error.util.ts';

	type Props = {
		data: { status: number; kind: ErrorKind; mascot: string; homeHref: string };
		events?: { onRetry?: () => void; onBack?: () => void };
		ui?: { page?: boolean; heading?: 'h1' | 'h2' | 'h3' };
	};

	let { data, events = {}, ui = {} }: Props = $props();

	const TEXT: Record<ErrorKind, { title: () => string; text: () => string }> = {
		badRequest: { title: m['error.badRequest.title'], text: m['error.badRequest.text'] },
		unauthorized: { title: m['error.unauthorized.title'], text: m['error.unauthorized.text'] },
		forbidden: { title: m['error.forbidden.title'], text: m['error.forbidden.text'] },
		notFound: { title: m['error.notFound.title'], text: m['error.notFound.text'] },
		timeout: { title: m['error.timeout.title'], text: m['error.timeout.text'] },
		tooMany: { title: m['error.tooMany.title'], text: m['error.tooMany.text'] },
		server: { title: m['error.server.title'], text: m['error.server.text'] },
		unavailable: { title: m['error.unavailable.title'], text: m['error.unavailable.text'] },
		offline: { title: m['error.offline.title'], text: m['error.offline.text'] },
		unknown: { title: m['error.unknown.title'], text: m['error.unknown.text'] }
	};

	const action = $derived(errorAction(data.kind));
	const text = $derived(TEXT[data.kind]);
	const eyebrow = $derived(
		data.kind === 'offline'
			? m['error.eyebrowOffline']()
			: m['error.eyebrow']({ status: data.status })
	);
</script>

<section class={['ac-error', ui.page && 'ac-error--page']} aria-labelledby="error-title">
	<div>
		<p class="ac-eyebrow">{eyebrow}</p>
		<svelte:element this={ui.heading ?? 'h1'} id="error-title" class="ac-title mt-1">
			{text.title()}
		</svelte:element>
		<p class="ac-error__text">{text.text()}</p>
		<div class="ac-error__actions">
			{#if action === 'retry'}
				<button
					type="button"
					class="ac-btn ac-btn--primary ac-btn--lg"
					onclick={events.onRetry}>{m['error.actions.retry']()}</button
				>
				<a class="ac-btn ac-btn--lg" href={data.homeHref}>{m['error.actions.home']()}</a>
			{:else}
				<a class="ac-btn ac-btn--primary ac-btn--lg" href={data.homeHref}
					>{m['error.actions.home']()}</a
				>
				<button type="button" class="ac-btn ac-btn--lg" onclick={events.onBack}
					>{m['error.actions.back']()}</button
				>
			{/if}
		</div>
	</div>
	<div class="ac-error__stage" aria-hidden="true">
		{#if data.kind !== 'offline'}<span class="ac-error__code">{data.status}</span>{/if}
		<img class="ac-error__art" src={data.mascot} alt="" />
	</div>
</section>
