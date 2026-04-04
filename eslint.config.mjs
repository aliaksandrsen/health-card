import nextVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
	...nextVitals,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	{
		plugins: {
			prettier: eslintPluginPrettier,
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			"import/no-anonymous-default-export": "off",
			"prettier/prettier": "error",
			"simple-import-sort/exports": "warn",
		},
	},
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"out/**",
			"build/**",
			"dist/**",
			"coverage/**",
			"next-env.d.ts",
		],
	},
);
