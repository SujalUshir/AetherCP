import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
console.log('=== STEP 2: SOURCE DEPENDENCY AUDIT ===\n');

const manifestPath = path.join(rootDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('CRITICAL ERROR: manifest.json does not exist!');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const auditedFiles = new Map();
const missingFiles = [];

function checkFileExists(relPath, sourceContext) {
  const norm = relPath.replace(/\\/g, '/').replace(/^\.\//, '');
  const full = path.join(rootDir, norm);
  const exists = fs.existsSync(full);
  auditedFiles.set(norm, { exists, context: sourceContext });
  if (!exists) {
    missingFiles.push({ file: norm, context: sourceContext });
    console.error('❌ MISSING FILE:', norm, ' (referenced by:', sourceContext + ')');
  } else {
    console.log('✓ Found:', norm, ' (referenced by:', sourceContext + ')');
  }
  return exists;
}

console.log('--- 1. Checking Manifest Entries ---');
if (manifest.icons) Object.values(manifest.icons).forEach(p => checkFileExists(p, 'manifest.json icons'));
if (manifest.action?.default_popup) checkFileExists(manifest.action.default_popup, 'manifest.json popup');
if (manifest.action?.default_icon) Object.values(manifest.action.default_icon).forEach(p => checkFileExists(p, 'manifest.json action icons'));
if (manifest.background?.service_worker) checkFileExists(manifest.background.service_worker, 'manifest.json service_worker');
if (manifest.content_scripts) {
  manifest.content_scripts.forEach((cs, i) => {
    if (cs.js) cs.js.forEach(j => checkFileExists(j, `manifest.json content_scripts[${i}].js`));
    if (cs.css) cs.css.forEach(c => checkFileExists(c, `manifest.json content_scripts[${i}].css`));
  });
}

console.log('\n--- 2. Checking Service Worker importScripts ---');
const bgPath = path.join(rootDir, manifest.background.service_worker);
if (fs.existsSync(bgPath)) {
  const bgContent = fs.readFileSync(bgPath, 'utf8');
  const importScriptsRegex = /importScripts\s*\(([\s\S]*?)\)/g;
  let match;
  while ((match = importScriptsRegex.exec(bgContent)) !== null) {
    const argBlock = match[1].replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const strRegex = /["']([^"']+)["']/g;
    let strMatch;
    while ((strMatch = strRegex.exec(argBlock)) !== null) {
      const relFromBg = strMatch[1];
      const resolved = path.normalize(path.join(path.dirname(manifest.background.service_worker), relFromBg));
      checkFileExists(resolved, `background.js importScripts("${relFromBg}")`);
    }
  }
}

console.log('\n--- 3. Checking Popup HTML Script and CSS Tags ---');
const popupRel = manifest.action.default_popup;
const popupPath = path.join(rootDir, popupRel);
if (fs.existsSync(popupPath)) {
  const popContent = fs.readFileSync(popupPath, 'utf8');
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
  let match;
  while ((match = scriptRegex.exec(popContent)) !== null) {
    const relFromPop = match[1];
    const resolved = path.normalize(path.join(path.dirname(popupRel), relFromPop));
    checkFileExists(resolved, `popup.html <script src="${relFromPop}">`);
  }
  const cssRegex = /<link\s+[^>]*href=["']([^"']+)["']/gi;
  while ((match = cssRegex.exec(popContent)) !== null) {
    if (match[0].includes('stylesheet')) {
      const relFromPop = match[1];
      const resolved = path.normalize(path.join(path.dirname(popupRel), relFromPop));
      checkFileExists(resolved, `popup.html <link href="${relFromPop}">`);
    }
  }
}

console.log('\n=== AUDIT RESULTS ===');
console.log('Total unique files verified:', auditedFiles.size);
console.log('Missing files count:', missingFiles.length);

if (missingFiles.length > 0) {
  console.error('\nCRITICAL: Audit failed! Missing files detected:');
  missingFiles.forEach(mf => console.error(`  - ${mf.file} (referenced by: ${mf.context})`));
  process.exit(1);
} else {
  console.log('\n✓ ALL REFERENCED SOURCE DEPENDENCIES EXIST!');
}
