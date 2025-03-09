const fs = require('fs');
const path = require('path');


// Function to setup git hooks for a specific repository
function setupGitHooks(repoPath) {
  const hooksDir = path.join(repoPath, '.git', 'hooks');
  const preCommitPath = path.join(hooksDir, 'pre-commit');


  // The pre-commit hook script content
  const hookScript = `#!/bin/sh
exec node "$(dirname "$0")/pre-commit.mjs" "$@"`;

  // Choose script based on whether it's in the custom directory

  const nodeScript =  `import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the repository root directory
const repoRoot = join(__dirname, '..', '..');
process.chdir(repoRoot);

console.log('Running ESLint...');
console.log(repoRoot);

// Run npm run lint
const result = spawnSync('npm', ['run', 'lint'], {
    stdio: 'inherit',
    shell: true
});

// Exit with the same code as ESLint
process.exit(result.status);`;

  try {
    // Ensure hooks directory exists
    if (!fs.existsSync(hooksDir)) {
      console.log('Creating hooks directory...');
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Write the pre-commit hook files
    fs.writeFileSync(preCommitPath, hookScript);
    fs.writeFileSync(path.join(hooksDir, 'pre-commit.mjs'), nodeScript);

    // Make the hook executable on Unix-like systems
    if (process.platform !== 'win32') {
      fs.chmodSync(preCommitPath, '0755');
      fs.chmodSync(path.join(hooksDir, 'pre-commit.mjs'), '0755');
    }

    console.log('✅ Git pre-commit hook installed successfully.');
  } catch (err) {
    console.error('❌ Error setting up Git hook for', repoPath, ':', err.message);
  }
}


try {
  setupGitHooks(__dirname);

} catch (err) {
  console.error('❌ Error during setup:', err.message);
  process.exit(1);
}