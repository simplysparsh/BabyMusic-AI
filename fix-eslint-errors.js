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

console.log('🔧 Fixing common ESLint errors...');

// Run ESLint fix first
try {
  console.log('Running ESLint with --fix option...');
  execSync('npx eslint src --ext .ts,.tsx,.js,.jsx --fix', { stdio: 'inherit' });
  console.log('✅ ESLint automatic fixes applied');
} catch (error) {
  console.log('⚠️ ESLint fixes applied but some issues remain');
}

// Function to find all files recursively
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

// Get all files
const files = findFiles(srcDir);
let modifiedCount = 0;

// Process each file
files.forEach(filePath => {
  const relativePath = path.relative(process.cwd(), filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix 1: Add underscore prefix to unused variables that have been identified by ESLint
  const unusedVarPattern = /\/\/ @typescript-eslint\/no-unused-vars.*?\n.*?([a-zA-Z][a-zA-Z0-9]*)(\s*:|,|\))/g;
  const matches = [...content.matchAll(unusedVarPattern)];
  
  if (matches.length > 0) {
    matches.forEach(match => {
      const varName = match[1];
      const punctuation = match[2];
      
      // Only add underscore if it doesn't already have one
      if (!varName.startsWith('_')) {
        content = content.replace(
          new RegExp(`${varName}(\\s*:|,|\\))`, 'g'),
          `_${varName}$1`
        );
        modified = true;
      }
    });
  }
  
  // Fix 2: Convert 'let' to 'const' where flagged
  const letToConstPattern = /let\s+([a-zA-Z][a-zA-Z0-9]*)\s*=.*?\/\/ prefer-const/g;
  const letMatches = [...content.matchAll(letToConstPattern)];
  
  if (letMatches.length > 0) {
    letMatches.forEach(match => {
      const fullMatch = match[0];
      content = content.replace(
        fullMatch,
        fullMatch.replace('let', 'const').replace('// prefer-const', '')
      );
      modified = true;
    });
  }
  
  // Write changes if modified
  if (modified) {
    fs.writeFileSync(filePath, content);
    modifiedCount++;
    console.log(`✅ Fixed: ${relativePath}`);
  }
});

console.log(`\n✨ Complete! Modified ${modifiedCount} files.`);
console.log('Run ESLint again to see if errors were fixed.'); 