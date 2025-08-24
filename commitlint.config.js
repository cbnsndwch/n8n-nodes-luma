module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only changes
        'style',    // Changes that do not affect the meaning of the code
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvement
        'test',     // Adding missing tests or correcting existing tests
        'build',    // Changes that affect the build system or external dependencies
        'ci',       // Changes to CI configuration files and scripts
        'chore',    // Other changes that don't modify src or test files
        'revert'    // Reverts a previous commit
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'release',    // Release related changes
        'workflow',   // GitHub Actions workflow changes
        'deps',       // Dependency updates
        'config',     // Configuration changes
        'luma',       // Luma node changes
        'trigger',    // LumaTrigger node changes
        'credentials',// Credential changes
        'calendar',   // Calendar operations
        'event',      // Event operations
        'guest',      // Guest operations
        'ticket',     // Ticket operations
        'user',       // User operations
        'utility',    // Utility operations
        'shared',     // Shared utilities
        'test',       // Test-related changes
        'docs'        // Documentation changes
      ]
    ],
    'scope-empty': [1, 'never'], // Warn if scope is empty
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100]
  }
};