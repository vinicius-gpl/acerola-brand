// Gera a capa do README (docs/github/ptbr/hero.jpg) a partir do hero.html, em 1920x1080.
//
//   node docs/github/source/render-hero.mjs
//
// Sem dependência: abre o Chrome sem janela e fala com ele pelo protocolo de depuração (CDP).
// O Chrome é procurado nos lugares de sempre; CHROME=<caminho> escolhe outro.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../ptbr/hero.jpg');

const chrome = [
	process.env.CHROME,
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium'
].find((path) => path && existsSync(path));
if (!chrome) throw new Error('Chrome not found: set CHROME=<path>');

const profile = mkdtempSync(join(tmpdir(), 'hero-'));
const browser = spawn(chrome, [
	'--headless=new',
	'--remote-debugging-port=0',
	`--user-data-dir=${profile}`,
	'--allow-file-access-from-files',
	'about:blank'
]);

try {
	// Chrome writes its port to DevToolsActivePort once it is listening.
	let port;
	for (let i = 0; i < 100 && !port; i++) {
		await sleep(100);
		const file = join(profile, 'DevToolsActivePort');
		if (existsSync(file)) port = readFileSync(file, 'utf8').split('\n')[0];
	}
	const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
	const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
	await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

	let id = 0;
	const send = (method, params = {}) =>
		new Promise((resolve, reject) => {
			const n = ++id;
			const onMessage = ({ data }) => {
				const msg = JSON.parse(data);
				if (msg.id !== n) return;
				ws.removeEventListener('message', onMessage);
				if (msg.error) reject(new Error(msg.error.message));
				else resolve(msg.result);
			};
			ws.addEventListener('message', onMessage);
			ws.send(JSON.stringify({ id: n, method, params }));
		});

	await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
	await send('Page.navigate', { url: pathToFileURL(join(here, 'hero.html')).href });
	// Waits for the images and fonts, then one more frame.
	await send('Runtime.evaluate', {
		expression: `new Promise((done) => { const ready = () => Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode())]).then(() => requestAnimationFrame(() => done(true))); document.readyState === 'complete' ? ready() : addEventListener('load', ready); })`,
		awaitPromise: true
	});
	const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
	writeFileSync(out, Buffer.from(data, 'base64'));
	ws.close();
	console.log('docs/github/ptbr/hero.jpg');
} finally {
	browser.kill();
	await sleep(300);
	rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
}
