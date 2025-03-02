#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.join(process.cwd(), 'src');
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

console.log('🔍 Scanning for unused variables and imports...');

// Find all TypeScript/JavaScript files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Run ESLint to find unused variables
function findUnusedVariables() {
  try {
    console.log('Running ESLint to detect unused variables...');
    const eslintOutput = execSync('npx eslint --no-eslintrc --config scripts/lint/.eslintrc.js --quiet --format json src', { encoding: 'utf8' });
    return JSON.parse(eslintOutput);
  } catch (error) {
    // ESLint will exit with error code if it finds issues
    if (error.stdout) {
      return JSON.parse(error.stdout);
    }
    console.error('Error running ESLint:', error.message);
    return [];
  }
}

// This function checks if a variable is defined but never used
function detectUnusedVars(filePath) {
  // Create a temporary ESLint config for unused vars detection
  const eslintConfig = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error']
    }
  };
  
  const configPath = path.join(__dirname, '.eslintrc.js');
  fs.writeFileSync(
    configPath,
    `module.exports = ${JSON.stringify(eslintConfig, null, 2)};`
  );
  
  try {
    // Run ESLint with specific config
    const cmd = `npx eslint --no-eslintrc --config ${configPath} --quiet --format json "${filePath}"`;
    const result = execSync(cmd, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (error) {
    // ESLint will exit with error code if it finds issues
    if (error.stdout) {
      return JSON.parse(error.stdout);
    }
    return [];
  }
}

// Fix unused variables in a file
function fixUnusedVars(filePath) {
  console.log(`Checking ${filePath} for unused variables...`);
  const results = detectUnusedVars(filePath);
  
  if (!results.length || !results[0].messages.length) {
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const file of results) {
    for (const message of file.messages) {
      if (message.ruleId === '@typescript-eslint/no-unused-vars') {
        const variableName = message.message.match(/'([^']+)'/)?.[1];
        
        if (variableName) {
          console.log(`Found unused variable: ${variableName} at line ${message.line}`);
          
          // Different patterns to match variable declarations
          const patterns = [
            // const/let/var declarations
            new RegExp(`(const|let|var)\\s+${variableName}\\s*=`, 'g'),
            // Function parameters
            new RegExp(`function\\s+[\\w_]+\\s*\\([^)]*?\\b${variableName}\\b[^)]*\\)`, 'g'),
            // Arrow function parameters
            new RegExp(`\\([^)]*?\\b${variableName}\\b[^)]*\\)\\s*=>`, 'g'),
            // Destructuring patterns
            new RegExp(`\\{[^}]*?\\b${variableName}\\b[^}]*\\}\\s*=`, 'g'),
            new RegExp(`\\[[^\\]]*?\\b${variableName}\\b[^\\]]*\\]\\s*=`, 'g'),
            // Import statements
            new RegExp(`import\\s+\\{[^}]*?\\b${variableName}\\b[^}]*\\}\\s+from`, 'g')
          ];
          
          // Fix pattern: prefix with underscore
          for (const pattern of patterns) {
            if (pattern.test(content)) {
              content = content.replace(
                pattern, 
                (match) => match.replace(new RegExp(`\\b${variableName}\\b`), `_${variableName}`)
              );
              modified = true;
            }
          }
          
          // Special case for object destructuring with rename
          const destructuringRenamePattern = new RegExp(`{[^}]*?\\b\\w+:\\s*${variableName}\\b[^}]*}`, 'g');
          if (destructuringRenamePattern.test(content)) {
            content = content.replace(
              destructuringRenamePattern,
              (match) => match.replace(new RegExp(`(\\w+:\\s*)${variableName}\\b`), `$1_${variableName}`)
            );
            modified = true;
          }
          
          // Special case for import destructuring with rename
          const importRenamePattern = new RegExp(`import\\s+{[^}]*?\\b\\w+\\s+as\\s+${variableName}\\b[^}]*}\\s+from`, 'g');
          if (importRenamePattern.test(content)) {
            content = content.replace(
              importRenamePattern,
              (match) => match.replace(new RegExp(`(\\w+\\s+as\\s+)${variableName}\\b`), `$1_${variableName}`)
            );
            modified = true;
          }
          
          // Special case for imports we can simply remove
          const importPattern = new RegExp(`import\\s+\\{[^}]*?\\b${variableName}\\b[^}]*\\}\\s+from\\s+['"][^'"]+['"]\\s*;?`, 'g');
          if (importPattern.test(content)) {
            // If this is the only import, remove the whole line
            const singleImportPattern = new RegExp(`import\\s+\\{\\s*${variableName}\\s*\\}\\s+from\\s+['"][^'"]+['"]\\s*;?`, 'g');
            if (singleImportPattern.test(content)) {
              content = content.replace(singleImportPattern, '');
              modified = true;
            }
            // Otherwise remove just this import from the import list
            else {
              content = content.replace(
                new RegExp(`(import\\s+\\{[^}]*?)\\b${variableName}\\b,?\\s*([^}]*\\})`, 'g'),
                (match, before, after) => {
                  // If variableName is at the end with a comma before it, remove the comma too
                  before = before.replace(new RegExp(`,\\s*$`), '');
                  return `${before}${after}`;
                }
              );
              // Also try the case where variableName is in the middle or start
              content = content.replace(
                new RegExp(`(import\\s+\\{[^}]*?)\\b${variableName}\\b,\\s*([^}]*\\})`, 'g'),
                '$1$2'
              );
              modified = true;
            }
          }
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed unused variables in: ${filePath}`);
  }
  
  return modified;
}

// Process files
const files = findFiles(srcDir);
let modifiedCount = 0;

console.log(`Found ${files.length} files to scan`);

// Process each file
files.forEach(filePath => {
  const modified = fixUnusedVars(filePath);
  if (modified) {
    modifiedCount++;
  }
});

console.log(`\n✨ Complete! Fixed ${modifiedCount} files with unused variables.`);
console.log('Run ESLint again to verify all issues are resolved:');
console.log('npx eslint . --fix --ext .js,.jsx,.ts,.tsx'); 