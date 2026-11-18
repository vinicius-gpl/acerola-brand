# Acerola · design e padrão

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/github/hairline-fan-dark.gif">
    <img alt="Leque de amostras com sete lâminas, uma por token de cor, que se abre em volta da lâmina apontada" src="docs/github/hairline-fan-light.gif" width="560">
  </picture>
</p>

O ponto de partida de todo projeto Acerola (reader, sync, ticket, mangadex…):

- **Design system** no padrão do acerola-sync: cores, tipografia, forma, componentes, ícone e
  mascote, publicados como brand book e como arquivos (`/brand/...`).
- **Padrão de projeto**: estrutura de pastas, padrões por camada, git, GitHub, Actions, hooks e
  licença, iguais em qualquer stack. Sai como kit (`acerola-template.zip`).

O próprio repositório segue o padrão que ele entrega.

- **Site**: https://brand.acerola.app (GitHub Pages)
- **Arquivos**: https://cdn.acerola.app (R2: `/brand/...` e `/downloads/*.zip`)
- **Documentação**: [`docs/`](docs/README.md), com prints de cada tela nos dois temas

<table>
  <tr>
    <td width="50%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="docs/github/dark/home-hero.webp">
        <img alt="Hero do brand book" src="docs/github/light/home-hero.webp">
      </picture>
    </td>
    <td width="50%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="docs/github/dark/app-screens.webp">
        <img alt="Telas do app" src="docs/github/light/app-screens.webp">
      </picture>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="docs/github/dark/home-colors.webp">
        <img alt="Paleta de cores" src="docs/github/light/home-colors.webp">
      </picture>
    </td>
    <td width="50%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="docs/github/dark/error-404.webp">
        <img alt="Tela de erro" src="docs/github/light/error-404.webp">
      </picture>
    </td>
  </tr>
</table>

| Página | O que mostra |
| --- | --- |
| [Marca](docs/brand.md) | ícone e mascote, tipografia, cores, forma, ícones de app e downloads |
| [Componentes](docs/components.md) | as peças do sync e os componentes em HTML (`.ac-*`) |
| [Telas](docs/screens.md) | telas do app, tela de erro, site de exemplo e o celular |
| [Padrão de projeto](docs/standard.md) | skills, estrutura, git, hooks e como começar um projeto |

## O padrão em uma tela

| | |
| --- | --- |
| **Design** | skill `acerola-design`: tokens do sync, DM Sans, Titan One só na marca, estados obrigatórios, GSAP |
| **Projeto** | skill `acerola-project`: raiz do repositório, pastas por app, padrões por camada, MPL-2.0 |
| **Git** | skill `acerola-git`: `[tipo](local): Mensagem`, Git-Flow, travas, PR, Actions, release |
| **Hooks** | lefthook (`commit-msg`, `pre-commit`, `pre-merge-commit`, `pre-push`) e Claude Code (`SessionStart`, `PostToolUse`) |
| **Ícone de app** | `acerola-logo-foreground.svg` (o `acerola-logo.svg` com fundo é só imagem) |

## Estrutura

```
acerola-brand/
├── acerola-brand/            o site (SvelteKit 3 + Svelte 5 + TypeScript + Tailwind v4 + GSAP)
│   ├── static/brand/         o que se entrega: css, fontes, ícone, mascote, ícones de app
│   ├── messages/             i18n: pt-br.json · en.json (Paraglide)
│   ├── scripts/kit.mjs       gera os zips, o tokens.json e o manifesto antes do build
│   └── src/routes/           /, /examples, /examples/app, /examples/site, /standard
├── template/                 o que muda por projeto no kit (CLAUDE.md, config, README, CODEOWNERS…)
├── scripts/
│   ├── git/                  branch-guard.sh · commit-msg.mjs · setup-git.mjs
│   ├── design/               check-design.mjs
│   └── i18n/                 check-i18n.mjs
├── .claude/                  settings.json (hooks) · skills/acerola-{design,project,git}
├── .github/                  site-deploy.yml · templates de issue e PR · CODEOWNERS · dependabot
├── acerola.config.json       commit.scopes, design (pastas) e i18n (mensagens)
└── CLAUDE.md · CONTRIBUTING.md · LICENSE · .gitmessage · .editorconfig · lefthook.yml
```

## Começar

```bash
node scripts/git/setup-git.mjs     # Git-Flow, template de commit e hooks (precisa do lefthook)
cd acerola-brand
npm install
npm run dev                        # http://localhost:5173
```

| Comando | Para quê |
| --- | --- |
| `node scripts/design/check-design.mjs` | confere o design (também no `pre-commit` e no hook do Claude) |
| `node scripts/i18n/check-i18n.mjs` | confere o i18n: chaves aninhadas em inglês, mesmas chaves em pt-br e en |
| `npm run i18n` | compila as mensagens (Paraglide) em `src/lib/paraglide/` |
| `npm run kit` | gera os zips, `static/brand/tokens.json` e o manifesto |
| `npm run build` | i18n + kit + site estático em `build/` |
| `npm run check` / `npm run lint` | tipos, Prettier e ESLint |

O build usa caminhos relativos: a pasta `build/` abre igual em `/`, em `/<repo>/` do GitHub Pages
ou em qualquer outro endereço.

## Publicação

[`site-deploy.yml`](.github/workflows/site-deploy.yml) roda **só com tag de versão** `vX.Y.Z`,
criada na `main` pelo fluxo de release (skill `acerola-git`): lint, check, design, i18n, build,
envia `brand/` e `downloads/` para o R2 e publica o site no GitHub Pages. Push em branch não
publica nada.

1. **Pages**: Settings → Pages → Source: **GitHub Actions**; domínio `brand.acerola.app`; no
   ambiente `github-pages`, só tags `v*`.
2. **R2** (opcional): secrets `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`;
   variables `R2_BUCKET`, `ASSETS_URL` (`https://cdn.acerola.app`) e `SITE_URL`. No bucket, CORS
   liberado para `GET`, porque os apps carregam fontes e CSS de lá.

## Usar nos apps

```html
<link rel="stylesheet" href="https://cdn.acerola.app/brand/css/acerola.css" />
```

```css
@import 'tailwindcss';
@import 'https://cdn.acerola.app/brand/css/tailwind.css';
@import 'https://cdn.acerola.app/brand/css/components.css';
```

Projeto novo: baixe `acerola-template.zip`, descompacte na raiz e siga a página **Padrão** do site.

## Licença

[MPL-2.0](LICENSE): código, CSS, scripts, skills, docs, ícone e mascote. As fontes (DM Sans, Noto
Serif e Titan One) seguem a SIL Open Font License 1.1 (`acerola-brand/static/brand/fonts/LICENSE-*.txt`).

O GIF do topo é uma figura feita com [Hairline](https://github.com/lucasmarkes/hairline), de [@lucasmarkes](https://github.com/lucasmarkes).
