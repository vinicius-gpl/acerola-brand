<script lang="ts">
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { errorAction, type ErrorKind } from '#lib/utils/error.util.ts';

	type Props = {
		data: { status: number; kind: ErrorKind; mascot: string; homeHref: string };
		events?: { onRetry?: () => void; onBack?: () => void };
		ui?: { page?: boolean; heading?: 'h1' | 'h2' | 'h3' };
	};

	let { data, events = {}, ui = {} }: Props = $props();

	let root: HTMLElement;
	/** Unique per instance: the brand book shows two screens on one page. */
	const uid = $props.id();
	const titleId = `${uid}-error-title`;

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
	/** Each digit with its own tilt, like the hero lettering. Offline has no code. */
	const digits = $derived(
		data.kind === 'offline'
			? []
			: [...String(data.status)].map((char, i) => ({ char, tilt: [-7, 4, -3][i % 3] }))
	);
	/** The tape repeats the title and the eyebrow. */
	const tape = $derived([text.title(), eyebrow, text.title(), eyebrow]);

	/** Sticker star as a clip-path: the stamp behind the mascot (same shape as the hero). */
	const burst = Array.from({ length: 40 }, (_, i) => {
		const angle = (i / 40) * Math.PI * 2;
		const r = i % 2 ? 42 : 50;
		return `${(50 + r * Math.cos(angle)).toFixed(2)}% ${(50 + r * Math.sin(angle)).toFixed(2)}%`;
	}).join(', ');

	onMount(() => {
		const mm = gsap.matchMedia();

		mm.add('(prefers-reduced-motion: no-preference)', () => {
			const q = gsap.utils.selector(root);

			gsap.timeline({ defaults: { ease: 'back.out(1.8)' } })
				.from(q('.ac-error__burst'), {
					scale: 0,
					rotate: -90,
					duration: 0.9,
					ease: 'expo.out'
				})
				.from(
					q('.ac-error__digit'),
					{
						yPercent: 110,
						rotate: () => gsap.utils.random(-30, 30),
						opacity: 0,
						duration: 0.8,
						stagger: 0.08
					},
					0.1
				)
				.from(
					q('.ac-error__art'),
					{ yPercent: 30, scale: 0.85, opacity: 0, duration: 0.9 },
					0.3
				)
				.from(q('.ac-error__tape'), { scaleX: 0, duration: 0.7, ease: 'expo.out' }, 0.5)
				.from(q('.ac-error__sticker'), { scale: 0, rotate: -45, duration: 0.55 }, 0.75)
				.from(
					q('.ac-error__copy > *'),
					{ y: 20, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' },
					0.2
				);

			// Life after the intro: the mascot breathes, the stamp spins, the tape runs.
			gsap.to(q('.ac-error__art'), {
				y: -12,
				duration: 2.4,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1
			});
			gsap.to(q('.ac-error__burst'), { rotate: 360, duration: 50, ease: 'none', repeat: -1 });
			gsap.fromTo(
				q('.ac-error__track'),
				{ xPercent: 0 },
				{ xPercent: -50, duration: 18, ease: 'none', repeat: -1 }
			);

			// A digit jumps when the pointer passes over it.
			const bounce = (event: Event) =>
				gsap.fromTo(
					event.currentTarget,
					{ y: 0 },
					{ y: -18, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }
				);
			const digitEls = q('.ac-error__digit');
			digitEls.forEach((el) => el.addEventListener('pointerenter', bounce));
			return () => digitEls.forEach((el) => el.removeEventListener('pointerenter', bounce));
		});

		return () => mm.revert();
	});
</script>

<section
	bind:this={root}
	class={['ac-error', ui.page && 'ac-error--page']}
	aria-labelledby={titleId}
>
	<div class="ac-error__layout">
		<div class="ac-error__copy">
			<p class="ac-error__eyebrow">{eyebrow}</p>
			<svelte:element this={ui.heading ?? 'h1'} id={titleId} class="ac-error__title">
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
					<a class="ac-btn ac-btn--lg" href={data.homeHref}>{m['error.actions.home']()}</a
					>
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
			<div class="ac-error__burst" style:clip-path="polygon({burst})"></div>
			{#if digits.length}
				<p class="ac-error__code">
					{#each digits as digit, i (i)}
						<span class="ac-error__digit" style:--tilt="{digit.tilt}deg"
							>{digit.char}</span
						>
					{/each}
				</p>
			{/if}
			<img class="ac-error__art" src={data.mascot} alt="" />
			<div class="ac-error__tape">
				<div class="ac-error__track">
					{#each [0, 1] as copy (copy)}
						<span class="ac-error__tape-text">
							{#each tape as phrase, i (i)}{phrase}<b>✦</b>{/each}
						</span>
					{/each}
				</div>
			</div>
			<span class="ac-error__sticker">{m['error.sticker']()}</span>
		</div>
	</div>
</section>
