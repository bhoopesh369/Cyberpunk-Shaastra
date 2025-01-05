module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: [
        'dist',
        '.eslintrc.cjs',
        '**/*.md',
        '**/*.json',
        '*.config.js',
        '*.config.ts',
        '.*',
        '*.json',
        'README.md',
        '*.lock',
        'index.html',
        'node_modules',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'eslint-plugin-prettier', '@typescript-eslint'],
    rules: {
        "prettier/prettier": "error",
        "camelcase": "error",
        "no-duplicate-imports": "error",
        "no-unused-vars": 2
    }
};
