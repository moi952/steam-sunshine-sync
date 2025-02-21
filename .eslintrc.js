module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "airbnb", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "jest", "prettier"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".scss"],
        paths: ["src", "electron"],
      },
    },
  },
  rules: {
    "no-console": "off",
    "no-alert": "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
      },
    ],
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".tsx"],
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "react/require-default-props": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["**/*.stories.tsx", "**/*.test.ts", "**/*.test.tsx", "webpack.config.js"],
      },
    ],
    "no-unused-vars": ["error", { argsIgnorePattern: "^_", "varsIgnorePattern": "^Window$" }],
    "no-param-reassign": "off",
    "lines-between-class-members": "off",
    "no-nested-ternary": "off",
    "no-restricted-syntax": "off",
    "react/no-array-index-key": "off",
  },
};
