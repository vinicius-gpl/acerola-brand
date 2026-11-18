# Acerola Brand — regras do projeto

Este repositório é o **design system e o padrão de projeto** de todos os apps Acerola, e segue o
próprio padrão. O site (brand book) mora em `acerola-brand/`; o kit de projeto novo sai daqui.

## Padrão Acerola — REGRA OBRIGATÓRIA

Antes de mexer, carregue a skill certa e siga-a:

| Vai mexer em | Skill |
|---|---|
| tela, componente, cor, fonte, ícone, peça de marca | `acerola-design` |
| estrutura de pasta, camada, módulo, licença, projeto novo | `acerola-project` |
| commit, branch, PR, issue, workflow, release | `acerola-git` |

- Commit `[tipo](local): Mensagem`; locais em `acerola.config.json` (`site`, `kit`, `ci`, `docs`, `claude`, `deps`).
- **Só três branches vivas: `main`, `develop` e a de trabalho.** Juntou, apaga (local e remota).
  Outra branch só fica se quem administra pedir de forma específica.
- **Tudo que o usuário não vê é em inglês**: pastas, arquivos, rotas, identificadores, chaves de
  JSON/config/i18n, banco, logs e comentários de código. Português só na tela (via i18n), nas
  docs, nas skills e em commit/PR.
- **i18n obrigatório** (Paraglide, `acerola-brand/messages/{pt-br,en}.json`): nenhum texto de tela
  no código; chave aninhada por assunto, sem `_`/`-` emendando contexto.
- `node scripts/design/check-design.mjs` e `node scripts/i18n/check-i18n.mjs` precisam passar
  (hooks do Claude, `pre-commit` e CI).
- Licença MPL-2.0; fontes seguem SIL OFL 1.1.

## Deste projeto

- `acerola-brand/static/brand/` é o que se entrega (css, fontes, ícone, mascote, ícones de app).
  Mudou a marca? Muda ali, e o site muda junto.
- As skills e os scripts da raiz são **o padrão**: o `acerola-template.zip` é montado deles por
  `acerola-brand/scripts/kit.mjs`, com os arquivos de `template/` no lugar dos que mudam por projeto.
- O site usa caminho relativo: o mesmo build abre em qualquer URL. Arquivos podem ir para o R2
  (`ASSETS_URL`).

## Desvios do padrão

Nenhum.
