#!/usr/bin/env node

/**
 * Version bump helper
 * Updates package.json and js/version.js to keep everything in sync
 */

const fs = require('fs');
const path = require('path');

// Increment type: patch (1.0.0 -> 1.0.1), minor (1.0.0 -> 1.1.0), major (1.0.0 -> 2.0.0)
const type = process.argv[2] || 'patch';

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Parse current version
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// Calculate new version
let newVersion;
switch (type) {
  case 'major':
    newVersion = ${major + 1}.0.0;
    break;
  case 'minor':
    newVersion = ${major}..0;
    break;
  case 'patch':
  default:
    newVersion = ${major}..;
    break;
}

console.log(Incrementando versión:  -> );

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

// Update js/version.js
const versionPath = path.join(__dirname, '..', 'js', 'version.js');
const versionContent = /**
 * Application version helpers
 * Keeps the version in sync across the UI, Service Worker and update system
 */

const APP_VERSION = '';
const CACHE_VERSION = 'v';
;

fs.writeFileSync(versionPath, versionContent);

console.log('✅ package.json actualizado');
console.log('✅ js/version.js actualizado');
console.log(Nueva versión: );
