const fs = require('fs');
const path = require('path');

// Get version from command line args or package.json
const version = process.argv[2] || require('../package.json').version;

const versionFile = path.join(__dirname, '../js/version.js');

console.log(`Injecting version ${version} into js/version.js...`);

const versionContent = `/**
 * Application version helpers
 * Keeps the version in sync across the UI, Service Worker and update system
 */

const APP_VERSION = '${version}';
const CACHE_VERSION = 'v${version.replace(/\./g, '-')}';
`;

fs.writeFileSync(versionFile, versionContent);
console.log('Version injected successfully.');
