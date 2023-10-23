const prettierWrite = 'prettier --write';

const biomeApplyAndCheck =
  'sh -c "biome check --apply $0 &>/dev/null || biome check --colors=force $0"';

module.exports = {
  '*.{js,jsx,json,md,html,yaml,yml,css,scss}': [prettierWrite],
  '*.{ts,tsx}': [prettierWrite, biomeApplyAndCheck],
};
