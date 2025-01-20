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
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': false, // 禁用 @ts-ignore 的检查
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],
    },
    // settings: {
    //   "import/resolver": {
    //     "typescript": {
    //       "alwaysTryTypes": true
    //     }
    //   }
    // }
  },
];

export default eslintConfig;
