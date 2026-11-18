import { afterNavigate, onNavigate } from '$app/navigation';
import gsap from 'gsap';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Page transition on the GSAP clock: the current page fades and lifts out, the next one rises in.
 * Only when the path changes (anchor links and the first load keep their own motion). With
 * prefers-reduced-motion the page just swaps.
 */
export function usePageTransition(getTarget: () => HTMLElement | undefined) {
	onNavigate((navigation) => {
		const target = getTarget();
		if (!target || reducedMotion()) return;
		if (!navigation.to || navigation.from?.url.pathname === navigation.to.url.pathname) return;

		// A cancelled navigation stays on this page, so it must come back.
		navigation.complete.catch(() =>
			gsap.set(target, { clearProps: 'opacity,visibility,transform' })
		);

		return new Promise<void>((resolve) => {
			gsap.to(target, {
				autoAlpha: 0,
				y: -12,
				duration: 0.2,
				ease: 'power2.in',
				onComplete: resolve
			});
		});
	});

	afterNavigate(({ from, to, type }) => {
		const target = getTarget();
		if (!target || type === 'enter') return;
		if (reducedMotion() || from?.url.pathname === to?.url.pathname) {
			gsap.set(target, { clearProps: 'opacity,visibility,transform' });
			return;
		}

		gsap.fromTo(
			target,
			{ autoAlpha: 0, y: 20 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.42,
				ease: 'power3.out',
				// No transform left behind: it would break position: fixed inside the page.
				clearProps: 'opacity,visibility,transform'
			}
		);
	});
}
