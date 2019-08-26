module.exports = {
  root: true,
  env: {
    node: true
  },
  //extends: ["plugin:vue/essential", "@vue/prettier"],
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'none'
      }
    ]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
