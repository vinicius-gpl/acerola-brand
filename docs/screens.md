# Telas

Exemplos montados só com os tokens e as classes `.ac-*`, para todo app copiar.

## Telas do app

Lista, estado vazio, boas-vindas e atividade, no padrão do acerola-sync. Toda tela que carrega dado
tem os quatro estados desenhados: carregando (esqueleto), vazio (mascote e uma ação), erro e
pronto.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="github/dark/app-screens.webp">
  <img alt="Telas do app: lista, vazio, boas-vindas e atividade" src="github/light/app-screens.webp">
</picture>

## Tela de erro

Uma tela só para qualquer erro (404, 401, 403, 500, 503, sem conexão), sem barra de navegação nem
rodapé. De um lado o texto e duas ações; do outro o palco da marca, com o código em Titan One, a
mascote, a fita e o adesivo. Em 4xx a ação principal é "Ir para o início"; em 5xx, tempo esgotado e
sem conexão, "Tentar de novo".

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="github/dark/app-error.webp">
  <img alt="Tela de erro na página de exemplos" src="github/light/app-error.webp">
</picture>

É a mesma tela que o site mostra num endereço que não existe:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="github/dark/error-404.webp">
  <img alt="Erro 404 do brand book" src="github/light/error-404.webp">
</picture>

## Site

Um site de produto no padrão: hero de marca, o workspace e os passos.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="github/dark/site.webp">
  <img alt="Exemplo de site" src="github/light/site.webp">
</picture>

## No celular

<table>
  <tr>
    <td width="33%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="github/dark/mobile-home.webp">
        <img alt="Brand book no celular" src="github/light/mobile-home.webp">
      </picture>
    </td>
    <td width="33%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="github/dark/mobile-app.webp">
        <img alt="Telas do app no celular" src="github/light/mobile-app.webp">
      </picture>
    </td>
    <td width="33%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="github/dark/mobile-error.webp">
        <img alt="Tela de erro no celular" src="github/light/mobile-error.webp">
      </picture>
    </td>
  </tr>
</table>
