#!/usr/bin/env node

/**
 * Simple commit message validation script
 * Helps developers write conventional commit messages
 */

const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔍 Commit Message Validator\n');
console.log('Format: <type>(<scope>): <description>');
console.log('Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert');
console.log('Scopes: luma, trigger, credentials, calendar, event, guest, ticket, user, utility, shared, workflow, deps, config, test, docs, release\n');

rl.question('Enter your commit message: ', (message) => {
  console.log('\n📝 Validating commit message...\n');
  
  const commitlint = spawn('npx', ['commitlint'], {
    stdio: ['pipe', 'inherit', 'inherit']
  });
  
  commitlint.stdin.write(message);
  commitlint.stdin.end();
  
  commitlint.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Commit message is valid!');
      console.log(`Message: ${message}`);
    } else {
      console.log('\n❌ Commit message is invalid. Please fix and try again.');
    }
    rl.close();
  });
});