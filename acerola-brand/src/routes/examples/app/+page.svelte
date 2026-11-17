<script lang="ts">
	import { resolve } from '$app/paths';
	import AcerolaErrorScreen from '#lib/components/acerola-error-screen/acerola-error-screen.svelte';
	import AcerolaSection from '#lib/components/acerola-section/acerola-section.svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { errorKind } from '#lib/utils/error.util.ts';
	import { fileUrl } from '#lib/utils/url.util.ts';

	type Screen = 'list' | 'activity' | 'settings';

	const mascot = fileUrl('/brand/mascot/acerola-mascot.svg');
	const icon = fileUrl('/brand/logo/acerola-logo-foreground.svg');

	const covers = $derived([
		{
			id: 'sample',
			tone: 'var(--chart-2)',
			kind: m['screens.list.anime'](),
			title: m['screens.list.sample'](),
			sub: m['screens.list.episode']({ current: 5, total: 12 }),
			progress: 42
		},
		{
			id: 'other',
			tone: 'var(--chart-5)',
			kind: m['screens.list.anime'](),
			title: m['screens.list.other'](),
			sub: m['screens.list.episode']({ current: 3, total: 24 }),
			progress: 12
		},
		{
			id: 'more',
			tone: 'var(--chart-4)',
			kind: m['screens.list.manga'](),
			title: m['screens.list.more'](),
			sub: m['screens.list.chapter']({ current: 88 }),
			progress: 70
		},
		{
			id: 'almost',
			tone: 'var(--chart-1)',
			kind: m['screens.list.anime'](),
			title: m['screens.list.almost'](),
			sub: m['screens.list.episode']({ current: 11, total: 12 }),
			progress: 92
		}
	]);

	const stats = $derived([
		{ id: 'watching', tone: 'ac-stat--primary', value: '5', label: m['demo.stats.watching']() },
		{
			id: 'completed',
			tone: 'ac-stat--success',
			value: '12',
			label: m['demo.stats.completed']()
		},
		{ id: 'paused', tone: 'ac-stat--warning', value: '1', label: m['demo.stats.paused']() },
		{ id: 'planned', tone: '', value: '3', label: m['demo.stats.planned']() }
	]);

	/** The error screen preview: the same component +error.svelte renders, one variant at a time. */
	const errorSamples = [
		{ id: '404', status: 404, online: true },
		{ id: '403', status: 403, online: true },
		{ id: '500', status: 500, online: true },
		{ id: '503', status: 503, online: true },
		{ id: 'offline', status: 0, online: false }
	];
	let errorSample = $state(errorSamples[0]);

	const screens: { id: Screen; label: () => string }[] = [
		{ id: 'list', label: m['screens.nav.list'] },
		{ id: 'activity', label: m['screens.nav.activity'] },
		{ id: 'settings', label: m['screens.nav.settings'] }
	];
</script>

<svelte:head>
	<title>{m['screens.title']()} · Acerola</title>
</svelte:head>

{#snippet bar()}
	<div class="flex items-center justify-between">
		<img src={icon} alt="Acerola" class="size-8" />
		<span class="ac-badge ac-badge--success"
			><span class="ac-dot"></span>{m['demo.synced']()}</span
		>
	</div>
{/snippet}

{#snippet nav(active: Screen)}
	<nav
		class="ac-pill-nav absolute bottom-5 left-1/2 -translate-x-1/2"
		aria-label={m['screens.nav.main']()}
	>
		{#each screens as screen (screen.id)}
			<a
				class="ac-pill-nav__item"
				href="#{screen.id}"
				aria-current={screen.id === active ? 'page' : undefined}>{screen.label()}</a
			>
		{/each}
	</nav>
{/snippet}

<AcerolaSection
	data={{
		id: 'app',
		eyebrow: m['screens.eyebrow'](),
		title: m['screens.title'](),
		lead: m['screens.lead']()
	}}
>
	<div class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
		<!-- List -->
		<article
			class="relative grid h-160 content-start gap-5 overflow-hidden rounded-sheet bg-background p-5 pb-24 shadow-float"
			aria-label={m['screens.list.label']()}
		>
			{@render bar()}
			<header class="grid gap-1">
				<p class="ac-eyebrow">{m['screens.list.greeting']()}</p>
				<h3 class="ac-title">
					{m['screens.list.anime']()}
					<span class="ac-title__dim">{m['screens.list.manga']()}</span>
				</h3>
			</header>
			<div class="ac-chip-tabs" role="tablist" aria-label={m['demo.status']()}>
				<button type="button" class="ac-chip" role="tab" aria-selected="true"
					>{m['demo.watching']()} <span class="ac-chip__count">5</span></button
				>
				<button type="button" class="ac-chip" role="tab" aria-selected="false"
					>{m['demo.completed']()} <span class="ac-chip__count">12</span></button
				>
				<button type="button" class="ac-chip" role="tab" aria-selected="false"
					>{m['demo.planned']()} <span class="ac-chip__count">3</span></button
				>
			</div>
			<div class="grid grid-cols-2 gap-3">
				{#each covers as cover (cover.id)}
					<article>
						<div class="ac-cover" style:background={cover.tone}>
							<span class="ac-cover__chip">{cover.kind}</span>
							<div class="ac-cover__shade"></div>
							<div class="ac-cover__progress">
								<div style:width="{cover.progress}%"></div>
							</div>
						</div>
						<p class="ac-cover__title">{cover.title}</p>
						<p class="ac-cover__subtitle">{cover.sub}</p>
					</article>
				{/each}
			</div>
			{@render nav('list')}
		</article>

		<!-- Empty state -->
		<article
			class="relative grid h-160 content-start gap-5 overflow-hidden rounded-sheet bg-background p-5 pb-24 shadow-float"
			aria-label={m['screens.empty.label']()}
		>
			{@render bar()}
			<h3 class="ac-title">
				{m['screens.list.manga']()}
				<span class="ac-title__dim">{m['screens.list.anime']()}</span>
			</h3>
			<div class="ac-chip-tabs" role="tablist" aria-label={m['demo.status']()}>
				<button type="button" class="ac-chip" role="tab" aria-selected="false"
					>{m['demo.reading']()} <span class="ac-chip__count">2</span></button
				>
				<button type="button" class="ac-chip" role="tab" aria-selected="true"
					>{m['demo.planned']()} <span class="ac-chip__count">0</span></button
				>
			</div>
			<div class="ac-empty">
				<img class="ac-empty__art" src={mascot} alt="" />
				<p class="ac-empty__title">{m['screens.empty.title']()}</p>
				<p class="ac-empty__text">{m['screens.empty.text']()}</p>
				<button type="button" class="ac-btn ac-btn--primary ac-empty__action"
					>{m['screens.empty.action']()}</button
				>
			</div>
			{@render nav('list')}
		</article>

		<!-- Welcome -->
		<article
			class="grid h-160 grid-rows-[1fr_auto] overflow-hidden rounded-sheet bg-background shadow-float"
			aria-label={m['screens.welcome.label']()}
		>
			<div class="grid place-items-center bg-card p-8">
				<img src={mascot} alt={m['pieces.alt']()} class="max-h-full" />
			</div>
			<div class="grid gap-3 p-5">
				<p class="ac-eyebrow">{m['screens.welcome.app']()}</p>
				<h3 class="ac-title text-4xl">{m['screens.welcome.title']()}</h3>
				<p class="m-0 text-sm text-muted-foreground">{m['screens.welcome.text']()}</p>
				<button type="button" class="ac-btn ac-btn--primary ac-btn--lg ac-btn--block"
					>{m['screens.welcome.login']()}</button
				>
				<button type="button" class="ac-btn ac-btn--lg ac-btn--block"
					>{m['screens.welcome.later']()}</button
				>
			</div>
		</article>

		<!-- Activity -->
		<article
			class="relative grid h-160 content-start gap-5 overflow-hidden rounded-sheet bg-background p-5 pb-24 shadow-float"
			aria-label={m['screens.activity.label']()}
		>
			{@render bar()}
			<header class="grid gap-1">
				<p class="ac-eyebrow">{m['screens.activity.eyebrow']()}</p>
				<h3 class="ac-title">{m['screens.activity.title']()}</h3>
			</header>
			<div class="grid grid-cols-2 gap-3">
				{#each stats as stat (stat.id)}
					<div class="ac-stat {stat.tone}">
						<span class="ac-label">{stat.label}</span><span class="ac-stat__value"
							>{stat.value}</span
						>
					</div>
				{/each}
			</div>
			<button type="button" class="ac-btn ac-btn--contrast ac-btn--block"
				>{m['demo.sync']()}</button
			>
			<div class="ac-toast ac-toast--success" role="status">
				<img class="ac-avatar" src={mascot} alt="" />
				<div class="min-w-0">
					<div class="ac-toast__title">{m['screens.activity.toast']()}</div>
					<div class="ac-toast__text truncate">
						{m['screens.list.sample']()} · {m['screens.list.episode']({
							current: 6,
							total: 12
						})}
					</div>
				</div>
			</div>
			{@render nav('activity')}
		</article>
	</div>
</AcerolaSection>

<AcerolaSection
	data={{
		id: 'error',
		eyebrow: m['screens.error.eyebrow'](),
		title: m['screens.error.title'](),
		lead: m['screens.error.lead']()
	}}
>
	<div class="ac-chip-tabs" role="tablist" aria-label={m['screens.error.status']()}>
		{#each errorSamples as sample (sample.id)}
			<button
				type="button"
				class="ac-chip"
				role="tab"
				aria-selected={sample.id === errorSample.id}
				onclick={() => (errorSample = sample)}
				>{sample.online ? sample.status : m['error.eyebrowOffline']()}</button
			>
		{/each}
	</div>
	<div class="mt-6 rounded-sheet bg-background px-6 shadow-float sm:px-10">
		<AcerolaErrorScreen
			data={{
				status: errorSample.status,
				kind: errorKind(errorSample.status, errorSample.online),
				mascot,
				homeHref: resolve('/')
			}}
			ui={{ heading: 'h3' }}
		/>
	</div>
</AcerolaSection>
