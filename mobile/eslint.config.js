const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "dist/*",
      "node_modules/*",
      "ios/*",
      "android/*",
      "expo-env.d.ts",
      "uniwind-types.d.ts",
      ".expo/*",
    ],
  },
]);
