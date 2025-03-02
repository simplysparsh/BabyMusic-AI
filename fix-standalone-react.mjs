#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.join(process.cwd(), 'src');
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

console.log('🔍 Scanning for files with standalone React imports...');

// Helper function to get all files recursively
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
  
  // Look for simple "import React from 'react';" pattern
  const hasStandaloneImport = /import\s+React\s+from\s+['"]react['"];?/.test(content);
  
  // Check if React is used directly in the code
  const reactUsages = content.match(/React\.[a-zA-Z]+/g);
  const hasReactNamespaceUsage = reactUsages && reactUsages.length > 0;
  
  // Skip files that don't have the standalone import or where React is actually used
  if (!hasStandaloneImport || hasReactNamespaceUsage) {
    return;
  }
  
  console.log(`Found unused React import in: ${relativePath}`);
  
  // Remove the React import
  content = content.replace(/import\s+React\s+from\s+['"]react['"];?\n?/g, '');
  
  // Write changes
  fs.writeFileSync(filePath, content);
  modifiedCount++;
  console.log(`✅ Fixed: ${relativePath}`);
});

console.log(`\n✨ Complete! Modified ${modifiedCount} files.`);
console.log('Run your application to ensure everything works correctly.'); 