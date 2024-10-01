import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  { ignores: ["*/dist/*","*/*/dist/*"] },
  pluginJs.configs.recommended,
];
