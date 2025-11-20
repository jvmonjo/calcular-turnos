#!/usr/bin/env node

/**
 * Git hooks setup helper
 * Configures Git to use the .githooks directory
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Configurando Git hooks...');

try {
  // Point Git to .githooks
  execSync('git config core.hooksPath .githooks', { stdio: 'inherit' });

  // Make hooks executable on Unix systems
  if (process.platform !== 'win32') {
    const hooks = ['pre-commit', 'commit-msg', 'pre-push'];
    for (const name of hooks) {
      const hookPath = path.join(__dirname, '..', '.githooks', name);
      if (fs.existsSync(hookPath)) {
        fs.chmodSync(hookPath, '755');
      }
    }
  }

  console.log('✅ Git hooks configurados correctamente');
  console.log('');
  console.log('La versión se ajustará según el mensaje de commit:');
  console.log('  feat -> minor, fix/chore/etc -> patch, BREAKING CHANGE/! -> major');
  console.log('  (se aplicará con amend automático)');
  console.log('');
  console.log('Incrementos manuales:');
  console.log('  npm run version:patch  (1.0.0 -> 1.0.1)');
  console.log('  npm run version:minor  (1.0.0 -> 1.1.0)');
  console.log('  npm run version:major  (1.0.0 -> 2.0.0)');
} catch (error) {
  console.error('Error configurando Git hooks:', error.message);
  process.exit(1);
}
