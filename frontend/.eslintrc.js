module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript'
    ],
    rules: {
        'indent': ['error', 4],
        'semi': 'off',
        '@typescript-eslint/semi': ['error'],
        'space-before-function-paren': 'off',
        'no-dupe-class-members': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    },
    parserOptions: {
        parser: '@typescript-eslint/parser'
    }
};
