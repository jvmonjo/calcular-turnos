#!/usr/bin/env node

/**
 * Version bump helper
 * Updates package.json and js/version.js in sync
 */

const fs = require('fs');
const path = require('path');

const increment = (process.argv[2] || 'patch').toLowerCase();

const packagePath = path.join(__dirname, '..', 'package.json');
const versionPath = path.join(__dirname, '..', 'js', 'version.js');

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const previousVersion = pkg.version;
const [major, minor, patch] = previousVersion.split('.').map(Number);

let nextMajor = major;
let nextMinor = minor;
let nextPatch = patch;

switch (increment) {
  case 'major':
    nextMajor += 1;
    nextMinor = 0;
    nextPatch = 0;
    break;
  case 'minor':
    nextMinor += 1;
    nextPatch = 0;
    break;
  case 'patch':
  default:
    nextPatch += 1;
    break;
}

const newVersion = `${nextMajor}.${nextMinor}.${nextPatch}`;
const cacheVersion = `v${nextMajor}-${nextMinor}-${nextPatch}`;

console.log(`Incrementando versión: ${previousVersion} -> ${newVersion}`);

pkg.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

const versionFile = `/**
 * Application version helpers
 * Keeps the version in sync across the UI, Service Worker and update system
 */

const APP_VERSION = '${newVersion}';
const CACHE_VERSION = '${cacheVersion}';
`;

fs.writeFileSync(versionPath, versionFile);

console.log('✅ package.json actualizado');
console.log('✅ js/version.js actualizado');
console.log(`Nueva versión: ${newVersion}`);
