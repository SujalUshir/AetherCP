import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get base paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const releaseDir = path.join(rootDir, 'extension-release');

async function main() {
  console.log('Starting AetherCP Extension Release Packaging...');
  
  // 1. Remove previous release package
  try {
    await fs.rm(releaseDir, { recursive: true, force: true });
  } catch (err) {
    // Ignore if not present
  }
  
  // 2. Recreate release directory
  await fs.mkdir(releaseDir, { recursive: true });
  
  // 3. Load and validate manifest.json
  const manifestPath = path.join(rootDir, 'manifest.json');
  let manifest;
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    manifest = JSON.parse(manifestContent);
  } catch (err) {
    console.error('❌ Failed to read or parse manifest.json:', err.message);
    process.exit(1);
  }
  
  // Run manifest validation checks
  const errors = [];
  if (manifest.manifest_version !== 3) {
    errors.push(`manifest_version must be 3 (found: ${manifest.manifest_version})`);
  }
  if (!manifest.name) {
    errors.push('manifest.json is missing a "name" property');
  }
  if (!manifest.version) {
    errors.push('manifest.json is missing a "version" property');
  }
  
  if (errors.length > 0) {
    console.error('❌ Manifest Validation Failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  console.log('✓ Manifest validated');

  // 4. Resolve dependencies
  const filesToCopy = new Set();
  const missingAssets = [];
  const brokenImports = [];

  // Add manifest.json itself
  filesToCopy.add('manifest.json');

  // Collect from manifest
  if (manifest.icons) {
    Object.values(manifest.icons).forEach(iconPath => {
      filesToCopy.add(normalizeRelativePath(iconPath));
    });
  }

  if (manifest.action) {
    if (manifest.action.default_popup) {
      filesToCopy.add(normalizeRelativePath(manifest.action.default_popup));
    }
    if (manifest.action.default_icon) {
      Object.values(manifest.action.default_icon).forEach(iconPath => {
        filesToCopy.add(normalizeRelativePath(iconPath));
      });
    }
  }

  if (manifest.background && manifest.background.service_worker) {
    filesToCopy.add(normalizeRelativePath(manifest.background.service_worker));
  }

  if (manifest.content_scripts) {
    for (const script of manifest.content_scripts) {
      if (script.js) {
        script.js.forEach(jsFile => filesToCopy.add(normalizeRelativePath(jsFile)));
      }
      if (script.css) {
        script.css.forEach(cssFile => filesToCopy.add(normalizeRelativePath(cssFile)));
      }
    }
  }

  // Helper to normalize path separators to forward slashes and strip leading ./ or /
  function normalizeRelativePath(p) {
    if (!p) return '';
    let normalized = p.replace(/\\/g, '/');
    if (normalized.startsWith('./')) {
      normalized = normalized.slice(2);
    }
    if (normalized.startsWith('/')) {
      normalized = normalized.slice(1);
    }
    return normalized;
  }

  // Trace relative path from current file
  function resolveDependency(currentFilePath, relativePath) {
    if (/^(https?:|data:|chrome-extension:)/i.test(relativePath)) {
      return null;
    }
    const dir = path.dirname(currentFilePath);
    const resolved = path.resolve(dir, relativePath);
    const relativeToRoot = path.relative(rootDir, resolved);
    return normalizeRelativePath(relativeToRoot);
  }

  // Recursive parsing queue
  const queue = Array.from(filesToCopy);
  const processed = new Set();

  while (queue.length > 0) {
    const relPath = queue.shift();
    if (processed.has(relPath)) continue;
    processed.add(relPath);

    const fullPath = path.join(rootDir, relPath);
    
    // Check if the file exists in workspace
    try {
      await fs.access(fullPath);
    } catch {
      missingAssets.push(relPath);
      continue;
    }

    const ext = path.extname(relPath).toLowerCase();
    
    if (ext === '.html') {
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Parse <script src="...">
      const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
      let match;
      while ((match = scriptRegex.exec(content)) !== null) {
        const resolved = resolveDependency(fullPath, match[1]);
        if (resolved) {
          try {
            await fs.access(path.join(rootDir, resolved));
            if (!filesToCopy.has(resolved)) {
              filesToCopy.add(resolved);
              queue.push(resolved);
            }
          } catch {
            brokenImports.push({ file: relPath, imported: match[1], resolved });
            missingAssets.push(resolved);
          }
        }
      }

      // Parse <link rel="stylesheet" href="..."> or <link href="..." rel="stylesheet">
      const linkRegex = /<link\s+[^>]*href=["']([^"']+)["']/gi;
      while ((match = linkRegex.exec(content)) !== null) {
        const fullTag = match[0];
        if (fullTag.includes('stylesheet') || fullTag.includes('css')) {
          const resolved = resolveDependency(fullPath, match[1]);
          if (resolved) {
            try {
              await fs.access(path.join(rootDir, resolved));
              if (!filesToCopy.has(resolved)) {
                filesToCopy.add(resolved);
                queue.push(resolved);
              }
            } catch {
              brokenImports.push({ file: relPath, imported: match[1], resolved });
              missingAssets.push(resolved);
            }
          }
        }
      }
    } 
    else if (ext === '.js' || ext === '.mjs') {
      const content = await fs.readFile(fullPath, 'utf8');

      // Parse importScripts(...)
      const importScriptsRegex = /importScripts\s*\(([\s\S]*?)\)/g;
      let match;
      while ((match = importScriptsRegex.exec(content)) !== null) {
        const argBlock = match[1];
        // strip comments
        const cleanArgBlock = argBlock.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        const stringRegex = /["']([^"']+)["']/g;
        let strMatch;
        while ((strMatch = stringRegex.exec(cleanArgBlock)) !== null) {
          const resolved = resolveDependency(fullPath, strMatch[1]);
          if (resolved) {
            try {
              await fs.access(path.join(rootDir, resolved));
              if (!filesToCopy.has(resolved)) {
                filesToCopy.add(resolved);
                queue.push(resolved);
              }
            } catch {
              brokenImports.push({ file: relPath, imported: strMatch[1], resolved });
              missingAssets.push(resolved);
            }
          }
        }
      }

      // Parse standard ES imports / exports
      const importRegex = /import\s+.*?\s+from\s+["']([^"']+)["']/g;
      while ((match = importRegex.exec(content)) !== null) {
        const resolved = resolveDependency(fullPath, match[1]);
        if (resolved) {
          try {
            await fs.access(path.join(rootDir, resolved));
            if (!filesToCopy.has(resolved)) {
              filesToCopy.add(resolved);
              queue.push(resolved);
            }
          } catch {
            brokenImports.push({ file: relPath, imported: match[1], resolved });
            missingAssets.push(resolved);
          }
        }
      }

      // Parse CommonJS require
      const requireRegex = /require\s*\(\s*["']([^"']+)["']\s*\)/g;
      while ((match = requireRegex.exec(content)) !== null) {
        const resolved = resolveDependency(fullPath, match[1]);
        if (resolved) {
          try {
            await fs.access(path.join(rootDir, resolved));
            if (!filesToCopy.has(resolved)) {
              filesToCopy.add(resolved);
              queue.push(resolved);
            }
          } catch {
            brokenImports.push({ file: relPath, imported: match[1], resolved });
            missingAssets.push(resolved);
          }
        }
      }
    }
    else if (ext === '.css') {
      const content = await fs.readFile(fullPath, 'utf8');

      // Parse @import
      const cssImportRegex = /@import\s+(?:url\()?["']([^"']+)["']\)?/g;
      let match;
      while ((match = cssImportRegex.exec(content)) !== null) {
        const resolved = resolveDependency(fullPath, match[1]);
        if (resolved) {
          try {
            await fs.access(path.join(rootDir, resolved));
            if (!filesToCopy.has(resolved)) {
              filesToCopy.add(resolved);
              queue.push(resolved);
            }
          } catch {
            brokenImports.push({ file: relPath, imported: match[1], resolved });
            missingAssets.push(resolved);
          }
        }
      }

      // Parse url()
      const cssUrlRegex = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
      while ((match = cssUrlRegex.exec(content)) !== null) {
        const resolved = resolveDependency(fullPath, match[1]);
        if (resolved) {
          try {
            await fs.access(path.join(rootDir, resolved));
            if (!filesToCopy.has(resolved)) {
              filesToCopy.add(resolved);
              queue.push(resolved);
            }
          } catch {
            brokenImports.push({ file: relPath, imported: match[1], resolved });
            missingAssets.push(resolved);
          }
        }
      }
    }
  }

  // 5. Check if we failed validation
  if (missingAssets.length > 0 || brokenImports.length > 0) {
    console.error('❌ Validation Failed! Cannot generate release package.');
    if (missingAssets.length > 0) {
      console.error('\nMissing Assets:');
      missingAssets.forEach(asset => console.error(`  - ${asset}`));
    }
    if (brokenImports.length > 0) {
      console.error('\nBroken Imports:');
      brokenImports.forEach(imp => console.error(`  - In file ${imp.file}: failed to resolve "${imp.imported}" (resolved to: ${imp.resolved})`));
    }
    process.exit(1);
  }
  
  console.log('✓ Runtime dependencies resolved');

  // 6. Copy files to extension-release preserving structure
  let filesCopiedCount = 0;
  const uniqueFolders = new Set();

  for (const relPath of filesToCopy) {
    const srcPath = path.join(rootDir, relPath);
    const destPath = path.join(releaseDir, relPath);
    
    const destFolder = path.dirname(destPath);
    await fs.mkdir(destFolder, { recursive: true });
    
    // Track directory structure relative to release root
    let relDir = path.dirname(relPath);
    while (relDir !== '.' && relDir !== '/' && relDir !== '') {
      uniqueFolders.add(relDir.replace(/\\/g, '/'));
      relDir = path.dirname(relDir);
    }
    
    await fs.copyFile(srcPath, destPath);
    filesCopiedCount++;
  }

  // Double check that everything is physically copied
  for (const relPath of filesToCopy) {
    const destPath = path.join(releaseDir, relPath);
    try {
      await fs.access(destPath);
    } catch {
      console.error(`❌ Validation Error: Copied file "${relPath}" not found in release folder!`);
      process.exit(1);
    }
  }

  // 7. Write RELEASE_CONTENTS.md inside release folder
  const releaseVersion = manifest.version;
  const releaseContentsPath = path.join(releaseDir, 'RELEASE_CONTENTS.md');
  
  const foldersList = Array.from(uniqueFolders).sort();
  const rootFilesList = Array.from(filesToCopy).filter(f => !f.includes('/')).sort();
  
  const mdContent = `# Release Contents - AetherCP v${releaseVersion}

This directory contains the production-ready distribution package of the AetherCP Chrome extension.
It includes only the files required at runtime for the extension to function.

## Validation Results
- **Manifest Syntax & Schema**: Valid (Version 3)
- **Runtime Dependencies**: Fully resolved (0 broken imports, 0 missing assets)
- **Files Verified**: ${filesCopiedCount} files copied successfully.

## Included Root Files
${rootFilesList.map(f => `- \`${f}\`: Primary entry point/metadata.`).join('\n')}

## Included Folders
${foldersList.map(folder => `- \`${folder}/\`: Packaged subdirectory for extension runtime dependencies.`).join('\n')}

## Why they were included:
- **manifest.json**: Extension configuration, declaring permissions, action popup, content scripts, background worker, and icons.
- **icons/**: Chrome extension icons in 16x16, 32x32, 48x48, and 128x128 sizes. Required for Chrome Web Store and toolbar UI.
- **src/popup/**: User interface that opens when the extension icon is clicked (popup.html, popup.css, popup.js).
- **src/background/**: Background service worker (background.js) coordinating analytics, idle timers, and CPH messaging.
- **src/content/**: Content scripts (content.js) tracking active problem solving on Codeforces and LeetCode.
- **src/platform/codeforces/**: Dashboard augmentation script and styles injected directly on Codeforces user profiles.
- **src/shared/**: Shared extension-wide configuration constants.
- **src/utils/**: Time and timezone calculation utilities.
- **src/vendor/**: Local dependency of Chart.js used to render profile analytics graphs offline.
- **src/modules/**: Modular features including session tracking (timer), CPH VS Code integration, and analytics storage.

## Intentionally Excluded Files and Folders
The following development-only resources were intentionally excluded to optimize release package size and comply with store policies:
- \`website/\`: Next.js landing page code.
- \`testing/\` & \`testing-files/\`: Local testing suites, snapshots, and tests workspace.
- \`docs/\` & \`screenshot/\`: Documentation guides, system design records, and repository media assets.
- \`experiments/\`: Prototype features and experimental coding trials.
- \`logs/\`: Local development environment log files.
- \`.github/\` & \`.agents/\`: CI/CD actions and AI agent workspace configuration.
- Root markdown files (\`README.md\`, \`SECURITY.md\`, \`LICENSE\`): Project repository documentation.
- Tooling files (\`.gitignore\`, \`.gitattributes\`, \`scripts/\`): Development configuration and packaging scripts.
`;

  await fs.writeFile(releaseContentsPath, mdContent, 'utf8');
  console.log('✓ RELEASE_CONTENTS.md generated');

  // 8. Generate ZIP file in root directory: AetherCP-v<version>.zip
  const zipName = `AetherCP-v${releaseVersion}.zip`;
  const zipPath = path.join(rootDir, zipName);
  
  console.log(`Generating ZIP archive ${zipName}...`);
  try {
    createZip(releaseDir, zipPath);
    console.log(`✓ ${zipName} generated`);
  } catch (err) {
    console.error('❌ Failed to automatically generate ZIP:', err.message);
    process.exit(1);
  }

  // 9. Output final release summary
  console.log('\n======================================');
  console.log(`✓ Manifest validated`);
  console.log(`✓ Runtime dependencies resolved`);
  console.log(`✓ ${filesCopiedCount} files copied`);
  console.log(`✓ ${foldersList.length} folders copied`);
  console.log(`✓ 0 missing assets`);
  console.log(`✓ 0 missing imports`);
  console.log(`✓ RELEASE_CONTENTS.md generated`);
  console.log(`✓ ${zipName} generated`);
  console.log(`✓ Release package ready`);
  console.log(`✓ Ready for GitHub Releases`);
  console.log(`✓ Ready for Chrome Web Store`);
  console.log('======================================\n');
}

function createZip(sourceDir, destZip) {
  const absSourceDir = path.resolve(sourceDir);
  const absDestZip = path.resolve(destZip);

  // Cross-platform zip using child_process
  if (process.platform === 'win32') {
    try {
      const escapedSource = absSourceDir.replace(/'/g, "''");
      const escapedDest = absDestZip.replace(/'/g, "''");
      // Use PowerShell Compress-Archive
      execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${escapedSource}\\*' -DestinationPath '${escapedDest}' -Force"`, { stdio: 'ignore' });
    } catch (err) {
      // Fallback: Try tar (Windows 10+ has tar.exe)
      try {
        execSync(`tar -a -c -f "${absDestZip}" -C "${absSourceDir}" .`, { stdio: 'ignore' });
      } catch (err2) {
        throw new Error(`PowerShell Compress-Archive and tar both failed. PowerShell error: ${err.message}. Tar error: ${err2.message}`);
      }
    }
  } else {
    try {
      // Use zip utility
      execSync(`zip -r "${absDestZip}" .`, { cwd: absSourceDir, stdio: 'ignore' });
    } catch (err) {
      // Fallback: Try tar
      try {
        execSync(`tar -a -c -f "${absDestZip}" -C "${absSourceDir}" .`, { stdio: 'ignore' });
      } catch (err2) {
        throw new Error(`zip and tar both failed. zip error: ${err.message}. Tar error: ${err2.message}`);
      }
    }
  }
}

main().catch(err => {
  console.error('Unhandled build error:', err);
  process.exit(1);
});
