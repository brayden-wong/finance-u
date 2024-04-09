/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  semi: true,
  jsxSingleQuote: false,
  trailingComma: "all",
  singleQuote: false,
  tabWidth: 2,
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^/lib/(.*)$",
    "^@/components/(.*)$",
    "^[./]",
    "^[../]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;
