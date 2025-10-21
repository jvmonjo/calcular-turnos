#!/usr/bin/env node

/**
 * Script per incrementar la versió de l'aplicació
 * Actualitza package.json i js/version.js
 */

const fs = require('fs');
const path = require('path');

// Tipus d'increment: patch (1.0.0 -> 1.0.1), minor (1.0.0 -> 1.1.0), major (1.0.0 -> 2.0.0)
const type = process.argv[2] || 'patch';

// Llegir package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Parsejar versió actual
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// Calcular nova versió
let newVersion;
switch (type) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

console.log(`Incrementant versió: ${packageJson.version} -> ${newVersion}`);

// Actualitzar package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

// Actualitzar js/version.js
const versionPath = path.join(__dirname, '..', 'js', 'version.js');
const versionContent = `/**
 * Versió de l'aplicació
 * Aquest fitxer centralitza la versió per mantenir-la sincronitzada
 * entre el Service Worker, el PDF i el sistema d'actualitzacions
 */

const APP_VERSION = '${newVersion}';
const CACHE_VERSION = 'v${newVersion.replace(/\./g, '-')}';
`;

fs.writeFileSync(versionPath, versionContent);

console.log('✓ package.json actualitzat');
console.log('✓ js/version.js actualitzat');
console.log(`Nova versió: ${newVersion}`);
