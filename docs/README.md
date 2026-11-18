# Documentação

O brand book no ar fica em **https://brand.acerola.app**. Estas páginas mostram o que tem nele, com
prints dos dois temas (o GitHub escolhe o escuro ou o claro conforme o seu).

| Página | O que mostra |
| --- | --- |
| [Marca](brand.md) | ícone e mascote, tipografia, cores, forma, ícones de app e downloads |
| [Componentes](components.md) | as peças do sync e os componentes em HTML (`.ac-*`) |
| [Telas](screens.md) | telas do app, tela de erro, site de exemplo e o celular |
| [Padrão de projeto](standard.md) | skills, estrutura, git, hooks e como começar um projeto |

## Os prints

- Ficam em [`github/ptbr/prints/`](github/ptbr/prints/): `dark/` e `light/`, um arquivo por
  seção, em WebP.
- Tirados do site no ar com o Chrome sem janela, a 1280 × 800 (celular a 390 × 844), com movimento
  reduzido para nenhuma animação sair pela metade.
- Mudou uma tela? Tire o print de novo depois do deploy, com o mesmo nome de arquivo.

## A capa do README

`github/ptbr/hero.jpg`, no mesmo molde das capas do acerola-reader e do acerola-sync: logo no
canto, telas no meio e a frase à direita. A fonte é [`github/source/hero.html`](github/source/hero.html),
com as cores e as fontes da própria marca. Para gerar de novo (precisa do Chrome):

```bash
node docs/github/source/render-hero.mjs
```
