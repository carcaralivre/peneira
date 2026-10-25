# Peneira — ficha para addons.mozilla.org

- Nome: **Peneira** (livre na AMO)
- Resumo (≤ 250): Encontra uma aba pelo título ou endereço enquanto você digita. Uma paleta com busca instantânea sobre as abas da janela: ⌘. (Ctrl+.) abre, Enter vai para a aba, ⌘⌫ fecha sem sair da lista.
- Categorias: Abas · Produtividade
- Tags: abas, busca, paleta, atalho
- Licença: Mozilla Public License 2.0
- Site: (repositório, se criar) · Suporte: (seu e-mail)
- Ícone: `icone-128.png`
- Capturas: 1) paleta aberta com busca filtrando abas (você tira)

## Descrição

Extensão para Firefox que encontra uma aba pelo título ou endereço enquanto você digita.

- Clique no ícone da barra, ou ⌘. (Ctrl+. no Windows e Linux): abre uma paleta com um campo de busca e a lista de abas da janela, na mesma ordem da barra de abas.
- Cada palavra digitada precisa aparecer no título ou no endereço. Maiúsculas e acentos não importam.
- O endereço é comparado sem https://, sem www. e sem a terminação do domínio (.com, .com.br…), então "goog" acha o Google, mas "com" não traz tudo.
- ↑ ↓ navegam, Enter vai para a aba, ⌘⌫ (Ctrl+⌫) ou o × da linha fecham a aba sem sair da lista, Esc limpa a busca e, se já estiver vazia, fecha.
- O atalho pode ser trocado em about:addons → engrenagem → Gerenciar atalhos de extensões.

Nenhum dado sai do navegador.

## Notas ao revisor (English)

A tab switcher popup. Uses only the `tabs` API (query, update, remove) from the popup; no network, no storage, no content scripts. The audio indicator icon comes from a `<template>` in `popup.html`, favicons from `tab.favIconUrl`. No build step.
