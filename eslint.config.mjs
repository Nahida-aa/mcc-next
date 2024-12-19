import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // 将未使用变量的错误级别降低为警告
      "prefer-const": "warn", // 将 prefer-const 规则的错误级别降低为警告
      // 你可以在这里添加更多规则覆盖
    },
  },
];

export default eslintConfig;
