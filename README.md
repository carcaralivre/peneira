# Peneira

Extensão para Firefox que encontra uma aba pelo título ou endereço enquanto você digita.

- **Clique** no ícone da barra, ou **⌘.** (Ctrl+. no Windows e Linux): abre uma paleta com um campo de busca e a lista de abas da janela, na mesma ordem da barra de abas.
- Cada palavra digitada precisa aparecer no título ou no endereço. Maiúsculas e acentos não importam.
- O endereço é comparado sem `https://`, sem `www.` e sem a terminação do domínio (`.com`, `.com.br`…), então "goog" acha o Google, mas "com" não traz tudo.
- **↑ ↓** navegam, **Enter** vai para a aba, **⌘⌫** (Ctrl+⌫ no Windows e Linux) ou o **×** da linha fecham a aba sem sair da lista, **Esc** limpa a busca e, se já estiver vazia, fecha.
- O atalho pode ser trocado em `about:addons` → engrenagem → **Gerenciar atalhos de extensões**.

## Desenvolvimento

```sh
npx web-ext lint    # valida
npx web-ext build   # gera o .zip em web-ext-artifacts/
npx web-ext sign --channel=unlisted --api-key=… --api-secret=…   # assina e gera o .xpi
npx web-ext sign --channel=listed --api-key=… --api-secret=…     # submete à revisão da loja (addons.mozilla.org)
```

Toda alteração precisa de um novo `version` no `manifest.json` antes de assinar.

## Licença

[MPL 2.0](LICENSE)
