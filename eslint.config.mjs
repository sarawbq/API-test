import globals from "globals";
import jest from 'eslint-plugin-jest';
import eslintConfigPrettier from "eslint-config-prettier";


export default [
  eslintConfigPrettier,
  {
    files: ["tests/**/*.js"],
    plugins: {
      jest,
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-use-before-define": "error",
      "sort-imports": ["error", {
        "ignoreCase": false,
        "ignoreDeclarationSort": false,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": false
      }],
      "no-useless-concat": "error",
      "no-shadow": "error",
      "indent": ["error", 4],
      "linebreak-style": [ "warn", "unix" ],
      "max-len": [ "error", 132 ],
      "semi": [ "error", "always" ],
    },
    languageOptions: {sourceType: "commonjs", globals: globals.jest},
    
  },
  {languageOptions: {globals: globals.node}},
];