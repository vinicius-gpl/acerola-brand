/**
 * Builds the brand book downloads before `vite build` / `vite dev`:
 *
 * - static/brand/tokens.json           tokens.css as JSON (dark, light and shared)
 * - static/downloads/*.zip             brand, skills, project template, logos, icons, fonts and css
 * - src/lib/generated/downloads.json   size and file count of each zip, for the page
 *
 * Everything here is generated (git-ignored). Sources: static/brand, .claude/skills and the
 * standard files at the repository root, with template/ on top.
 */
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(root, '..');
const brand = join(root, 'static', 'brand');
const skills = join(repo, '.claude', 'skills');
const downloads = join(root, 'static', 'downloads');
const generated = join(root, 'src', 'lib', 'generated');

/** Fixed date in the zips: the same content always builds the same file. */
const MTIME = new Date('2026-01-01T00:00:00Z');

/**
 * The new-project kit: these root files (the standard in use here) and, on top, everything in
 * template/ (CLAUDE.md, acerola.config.json, README, CODEOWNERS… as templates).
 */
const STANDARD_FILES = [
	'.claude/settings.json',
	'.claude/skills',
	'scripts/git',
	'scripts/design',
	'scripts/i18n',
	'.github/ISSUE_TEMPLATE',
	'.github/PULL_REQUEST_TEMPLATE.md',
	'lefthook.yml',
	'.gitmessage',
	'.gitattributes',
	'.editorconfig',
	'LICENSE'
];

const posix = (path) => path.split(sep).join('/');

/** Every file under a path (recursive folder or a single file). */
async function walk(path) {
	if (!(await stat(path)).isDirectory()) return [path];
	const out = [];
	for (const entry of await readdir(path, { withFileTypes: true })) {
		out.push(...(await walk(join(path, entry.name))));
	}
	return out;
}

/**
 * Gathers paths into zip entries: each entry is [source, target inside the zip]. A folder's
 * content goes inside the target; a file's target is its own name in the zip. Later entries win.
 */
async function collect(entries) {
	const files = {};
	for (const [source, target] of entries) {
		if (!existsSync(source)) continue;
		const isDir = (await stat(source)).isDirectory();
		for (const file of await walk(source)) {
			const key = isDir ? join(target, relative(source, file)) : target;
			files[posix(key)] = [await readFile(file), { mtime: MTIME }];
		}
	}
	return files;
}

/** tokens.css → { dark, light, shared }, in source order. */
function parseTokens(css) {
	const blocks = { dark: {}, light: {}, shared: {} };
	const rule = /([^{}]+)\{([^{}]*)\}/g;
	for (const [, selector, body] of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(rule)) {
		const key = selector.includes("'light'")
			? 'light'
			: selector.includes("'dark'")
				? 'dark'
				: 'shared';
		for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
			blocks[key][name] = value.trim().replace(/\s+/g, ' ');
		}
	}
	return blocks;
}

const tokensCss = await readFile(join(brand, 'css', 'tokens.css'), 'utf8');
await writeFile(
	join(brand, 'tokens.json'),
	JSON.stringify(parseTokens(tokensCss), null, '\t') + '\n'
);

/** The design skill ships with the tokens, so the agent reads the values without the site. */
const tokensInSkill = (prefix) => ({
	[posix(join(prefix, 'acerola-design', 'tokens.css'))]: [
		new TextEncoder().encode(tokensCss),
		{ mtime: MTIME }
	]
});

/**
 * The error screen every app copies: the brand book's own files, plus its i18n keys, ship inside
 * the design skill as acerola-design/reference/error-screen/. The site is the source; no copy to
 * keep in sync by hand.
 */
const ERROR_SCREEN = [
	'src/routes/+error.svelte',
	'src/lib/components/acerola-error-screen/acerola-error-screen.svelte',
	'src/lib/utils/error.util.ts'
];

async function errorScreenInSkill(prefix) {
	const dir = posix(join(prefix, 'acerola-design', 'reference', 'error-screen'));
	const files = {};
	for (const path of ERROR_SCREEN) {
		files[`${dir}/${path.split('/').pop()}`] = [
			await readFile(join(root, path)),
			{ mtime: MTIME }
		];
	}
	for (const locale of ['pt-br', 'en']) {
		const messages = JSON.parse(
			await readFile(join(root, 'messages', `${locale}.json`), 'utf8')
		);
		const json = JSON.stringify({ error: messages.error }, null, '\t') + '\n';
		files[`${dir}/messages.${locale}.json`] = [
			new TextEncoder().encode(json),
			{ mtime: MTIME }
		];
	}
	return files;
}

/** Everything the design skill carries besides its SKILL.md. */
const skillExtras = async (prefix) => ({
	...tokensInSkill(prefix),
	...(await errorScreenInSkill(prefix))
});

const template = async (prefix) => ({
	...(await collect(STANDARD_FILES.map((path) => [join(repo, path), join(prefix, path)]))),
	...(await collect([[join(repo, 'template'), prefix]])),
	...(await skillExtras(`${prefix}/.claude/skills`))
});

const ZIPS = {
	'acerola-brand.zip': async () => ({
		...(await collect([
			[brand, 'acerola-brand'],
			[skills, 'acerola-brand/skills']
		])),
		...(await skillExtras('acerola-brand/skills'))
	}),
	'acerola-template.zip': () => template('acerola-template'),
	'acerola-skills.zip': async () => ({
		...(await collect([[skills, '']])),
		...(await skillExtras(''))
	}),
	'acerola-logos.zip': () =>
		collect([
			[join(brand, 'logo'), 'acerola-logos/logo'],
			[join(brand, 'mascot'), 'acerola-logos/mascot']
		]),
	'acerola-icons.zip': () => collect([[join(brand, 'icons'), 'acerola-icons']]),
	'acerola-fonts.zip': () => collect([[join(brand, 'fonts'), 'acerola-fonts']]),
	'acerola-css.zip': () =>
		collect([
			[join(brand, 'css'), 'acerola/css'],
			[join(brand, 'fonts'), 'acerola/fonts']
		])
};

await rm(downloads, { recursive: true, force: true });
await mkdir(downloads, { recursive: true });
await mkdir(generated, { recursive: true });

const manifest = {};
for (const [file, build] of Object.entries(ZIPS)) {
	const files = await build();
	const bytes = zipSync(files, { level: 9 });
	await writeFile(join(downloads, file), bytes);
	manifest[file] = { bytes: bytes.length, files: Object.keys(files).length };
	console.log(
		`kit: ${file} (${manifest[file].files} files, ${(bytes.length / 1024).toFixed(0)} KB)`
	);
}
await writeFile(join(generated, 'downloads.json'), JSON.stringify(manifest, null, '\t') + '\n');
