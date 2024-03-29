module.exports = {     "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'func-names': 'off',
      'no-plusplus': 'off',
      'no-process-exit': 'off',
      'class-methods-use-this': 'off'
    }
}

