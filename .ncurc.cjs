// hide these for now
const reject = [
    // node 24 is not yet LTS
    '@types/node',

    // no ESLint 9 yet, we'll upgrade manually
    'eslint',
    'typescript',
    
    // turbo does its own thing
    'turbo'
];

/**
 * @type {import('npm-check-updates').RunOptions}
 */
module.exports = {
    packageManager: 'pnpm',
    deep: true,
    reject
};
