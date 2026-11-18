# <Nome do projeto> — regras do projeto

<!-- Uma linha sobre o que é o projeto. -->

## Padrão Acerola — REGRA OBRIGATÓRIA

Antes de mexer, carregue a skill certa e siga-a:

| Vai mexer em | Skill |
|---|---|
| tela, componente, cor, fonte, ícone, peça de marca | `acerola-design` |
| nome, pasta, rota, banco, texto de tela, i18n, camada, licença | `acerola-project` |
| commit, branch, PR, issue, workflow, release | `acerola-git` |

- **Tudo que o usuário não vê é em inglês**: pastas, arquivos, rotas, identificadores, chaves,
  tabelas, colunas, modelos, logs e comentários de código.
- **i18n obrigatório**: nenhum texto de tela no código; chave em inglês e aninhada por assunto,
  sem `_`/`-` emendando contexto.
- Commit `[tipo](local): Mensagem`; locais em `acerola.config.json` (`commit.scopes`).
- **Só três branches vivas: `main`, `develop` e a de trabalho.** Juntou, apaga (local e remota).
  Outra branch só fica se quem administra pedir de forma específica.
- `node scripts/design/check-design.mjs` e `node scripts/i18n/check-i18n.mjs` precisam passar
  (hooks do Claude, `pre-commit` e CI).
- Licença MPL-2.0.

## Deste projeto

<!-- Regras que só valem aqui: arquitetura (docs/ARQUITETURA.md), limites de API, dados… -->

## Desvios do padrão

<!-- Padrão trocado aqui e o porquê. Sem nada escrito, vale o padrão. -->

Nenhum.
