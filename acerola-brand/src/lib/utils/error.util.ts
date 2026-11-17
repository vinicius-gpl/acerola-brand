/**
 * Turns any error status into one of the error screen variants. The screen never shows the raw
 * error message: only the status code (as decoration) and a text that says what to do.
 */
export type ErrorKind =
	| 'badRequest'
	| 'unauthorized'
	| 'forbidden'
	| 'notFound'
	| 'timeout'
	| 'tooMany'
	| 'server'
	| 'unavailable'
	| 'offline'
	| 'unknown';

/** What the primary action does: go home (the problem is the address) or try again. */
export type ErrorAction = 'home' | 'retry';

const BY_STATUS: Record<number, ErrorKind> = {
	400: 'badRequest',
	401: 'unauthorized',
	403: 'forbidden',
	404: 'notFound',
	408: 'timeout',
	429: 'tooMany',
	500: 'server',
	502: 'unavailable',
	503: 'unavailable',
	504: 'unavailable'
};

const RETRY: ErrorKind[] = ['timeout', 'tooMany', 'server', 'unavailable', 'offline', 'unknown'];

export function errorKind(status: number, online = true): ErrorKind {
	if (!online) return 'offline';
	if (BY_STATUS[status]) return BY_STATUS[status];
	if (status >= 500) return 'server';
	if (status >= 400) return 'badRequest';
	return 'unknown';
}

export function errorAction(kind: ErrorKind): ErrorAction {
	return RETRY.includes(kind) ? 'retry' : 'home';
}
