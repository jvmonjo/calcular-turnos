#!/usr/bin/env node

/**
 * Script per configurar els Git hooks
 * Configura Git per utilitzar el directori .githooks
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Configurant Git hooks...');

try {
  // Configurar Git per utilitzar .githooks com a directori de hooks
  execSync('git config core.hooksPath .githooks', { stdio: 'inherit' });

  // Fer executables els hooks (només en sistemes Unix)
  if (process.platform !== 'win32') {
    const hooks = ['pre-commit', 'commit-msg'];
    for (const name of hooks) {
      const hookPath = path.join(__dirname, '..', '.githooks', name);
      if (fs.existsSync(hookPath)) {
        fs.chmodSync(hookPath, '755');
      }
    }
  }

  console.log('✅ Git hooks configurats correctament');
  console.log('');
  console.log("La versió s'ajustarà segons el missatge de commit:");
  console.log('  feat -> minor, fix/chore/etc -> patch, BREAKING CHANGE/! -> major');
  console.log("  (s'inclourà amb amend automàtic)");
  console.log('');
  console.log('Per incrementar manualment:');
  console.log('  npm run version:patch  (1.0.0 -> 1.0.1)');
  console.log('  npm run version:minor  (1.0.0 -> 1.1.0)');
  console.log('  npm run version:major  (1.0.0 -> 2.0.0)');
} catch (error) {
  console.error('Error configurant Git hooks:', error.message);
  process.exit(1);
}

