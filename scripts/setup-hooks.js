#!/usr/bin/env node

/**
 * Script per configurar els Git hooks
 * Configura Git per utilitzar el directori .githooks
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Configurant Git hooks...');

try {
  // Configurar Git per utilitzar .githooks com a directori de hooks
  execSync('git config core.hooksPath .githooks', { stdio: 'inherit' });

  // Fer executable el hook pre-commit (només en sistemes Unix)
  if (process.platform !== 'win32') {
    const hookPath = path.join(__dirname, '..', '.githooks', 'pre-commit');
    if (fs.existsSync(hookPath)) {
      fs.chmodSync(hookPath, '755');
      console.log('✓ Hook pre-commit configurat com a executable');
    }
  }

  console.log('✓ Git hooks configurats correctament');
  console.log('');
  console.log('Ara cada commit incrementarà automàticament la versió patch.');
  console.log('');
  console.log('Per incrementar manualment:');
  console.log('  npm run version:patch  (1.0.0 -> 1.0.1)');
  console.log('  npm run version:minor  (1.0.0 -> 1.1.0)');
  console.log('  npm run version:major  (1.0.0 -> 2.0.0)');
} catch (error) {
  console.error('✗ Error configurant Git hooks:', error.message);
  process.exit(1);
}
