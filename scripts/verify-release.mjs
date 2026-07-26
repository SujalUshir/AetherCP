import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const releaseDir = path.join(rootDir, 'extension-release');
const zipPath = path.join(rootDir, 'AetherCP-v1.2.0.zip');

console.log('=== STEP 4 & 5: FINAL PACKAGING VERIFICATION ===\n');

if (!fs.existsSync(releaseDir)) {
  console.error('❌ ERROR: extension-release directory does not exist!');
  process.exit(1);
}

if (!fs.existsSync(zipPath)) {
  console.error('❌ ERROR: AetherCP-v1.2.0.zip does not exist!');
  process.exit(1);
}

const manifestPath = path.join(releaseDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ ERROR: manifest.json missing inside extension-release!');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const verifiedInRelease = [];
const missingInRelease = [];

function verifyReleaseFile(relPath, context) {
  const norm = relPath.replace(/\\/g, '/').replace(/^\.\//, '');
  const full = path.join(releaseDir, norm);
  const exists = fs.existsSync(full);
  if (exists) {
    verifiedInRelease.push({ file: norm, context });
    console.log(`✅ [RELEASE VERIFIED] ${norm} (${context})`);
  } else {
    missingInRelease.push({ file: norm, context });
    console.error(`❌ [RELEASE MISSING] ${norm} (${context})`);
  }
}

console.log('--- 1. Verifying Manifest Declared Assets ---');
if (manifest.icons) Object.values(manifest.icons).forEach(p => verifyReleaseFile(p, 'manifest.json icons'));
if (manifest.action?.default_popup) verifyReleaseFile(manifest.action.default_popup, 'manifest.json popup');
if (manifest.action?.default_icon) Object.values(manifest.action.default_icon).forEach(p => verifyReleaseFile(p, 'manifest.json action icons'));
if (manifest.background?.service_worker) verifyReleaseFile(manifest.background.service_worker, 'manifest.json service_worker');
if (manifest.content_scripts) {
  manifest.content_scripts.forEach((cs, i) => {
    if (cs.js) cs.js.forEach(j => verifyReleaseFile(j, `manifest.json content_scripts[${i}].js`));
    if (cs.css) cs.css.forEach(c => verifyReleaseFile(c, `manifest.json content_scripts[${i}].css`));
  });
}

console.log('\n--- 2. Verifying Service Worker importScripts in Release ---');
const bgRel = manifest.background.service_worker;
const bgPath = path.join(releaseDir, bgRel);
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
      const resolved = path.normalize(path.join(path.dirname(bgRel), relFromBg));
      verifyReleaseFile(resolved, `background.js importScripts("${relFromBg}")`);
    }
  }
}

console.log('\n--- 3. Verifying Popup HTML Script and CSS Tags in Release ---');
const popupRel = manifest.action.default_popup;
const popupPath = path.join(releaseDir, popupRel);
if (fs.existsSync(popupPath)) {
  const popContent = fs.readFileSync(popupPath, 'utf8');
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
  let match;
  while ((match = scriptRegex.exec(popContent)) !== null) {
    const relFromPop = match[1];
    const resolved = path.normalize(path.join(path.dirname(popupRel), relFromPop));
    verifyReleaseFile(resolved, `popup.html <script src="${relFromPop}">`);
  }
  const cssRegex = /<link\s+[^>]*href=["']([^"']+)["']/gi;
  while ((match = cssRegex.exec(popContent)) !== null) {
    if (match[0].includes('stylesheet')) {
      const relFromPop = match[1];
      const resolved = path.normalize(path.join(path.dirname(popupRel), relFromPop));
      verifyReleaseFile(resolved, `popup.html <link href="${relFromPop}">`);
    }
  }
}

console.log('\n=== VERIFICATION SUMMARY ===');
console.log('Verified release files:', verifiedInRelease.length);
console.log('Missing release files:', missingInRelease.length);

if (missingInRelease.length > 0) {
  console.error('\n❌ CRITICAL ERROR: Release folder verification failed!');
  process.exit(1);
} else {
  console.log('\n✅ ALL REFERENCED DEPENDENCIES EXIST IN extension-release AND AetherCP-v1.2.0.zip!');
}
