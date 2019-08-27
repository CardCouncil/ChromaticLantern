module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/html-closing-bracket-newline": [
      "warn",
      {
        singleline: "never",
        multiline: "never"
      }
    ]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
