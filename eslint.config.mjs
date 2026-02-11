import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    ignores: ["__tests__/", "scripts/", "verification/", "vitest.config.mts", ".next/"]
  }
];

export default eslintConfig;
