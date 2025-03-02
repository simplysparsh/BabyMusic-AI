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

console.log('🔍 Scanning for files with unused React imports...');

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

// Process files
const files = findFiles(srcDir);
let modifiedCount = 0;
let scannedCount = 0;

console.log(`Found ${files.length} files to scan`);

files.forEach(filePath => {
  scannedCount++;
  let content = fs.readFileSync(filePath, 'utf8');
  let wasModified = false;
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Debug: Show import patterns found
  const reactImportMatch = content.match(/import\s+React\s+from\s+['"]react['"];?/);
  if (reactImportMatch) {
    console.log(`Found React import in: ${relativePath}`);
    console.log(`  Pattern: ${reactImportMatch[0]}`);
  }
  
  // Various import patterns
  const importPatterns = [
    /import\s+React\s+from\s+['"]react['"];?/g,
    /import\s+React\s+from\s+['"]react['"]\s*$/gm,
  ];
  
  // Check if any pattern matches
  let hasReactImport = false;
  for (const pattern of importPatterns) {
    if (pattern.test(content)) {
      hasReactImport = true;
      break;
    }
  }
  
  if (hasReactImport) {
    // Check if React is actually used in the file
    const hasReactNamespaceUsage = /React\.[a-zA-Z]+/.test(content);
    
    // If React is not directly used, remove the import
    if (!hasReactNamespaceUsage) {
      for (const pattern of importPatterns) {
        content = content.replace(pattern, '');
      }
      
      console.log(`✅ Removed unused React import from: ${relativePath}`);
      wasModified = true;
    } 
    // If React namespace is used, convert to named imports
    else {
      // Find all React.X usages
      const reactUsages = content.match(/React\.[a-zA-Z]+/g) || [];
      const uniqueUsages = [...new Set(reactUsages)];
      
      // Extract hook names
      const hooksToImport = uniqueUsages.map(usage => {
        return usage.replace('React.', '');
      });
      
      if (hooksToImport.length > 0) {
        console.log(`Found React namespace usage in ${relativePath}: ${hooksToImport.join(', ')}`);
        
        // Replace React import with named imports
        for (const pattern of importPatterns) {
          content = content.replace(pattern, `import { ${hooksToImport.join(', ')} } from 'react';`);
        }
        
        // Replace all React.X with X
        hooksToImport.forEach(hook => {
          content = content.replace(new RegExp(`React\\.${hook}`, 'g'), hook);
        });
        
        console.log(`✅ Converted to named imports in: ${relativePath}`);
        wasModified = true;
      }
    }
  }
  
  // 2. Cleanup empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Save changes if the file was modified
  if (wasModified) {
    fs.writeFileSync(filePath, content);
    modifiedCount++;
  }
  
  // Show progress every 10 files
  if (scannedCount % 10 === 0) {
    console.log(`Progress: Scanned ${scannedCount}/${files.length} files...`);
  }
});

console.log(`\n✨ Complete! Scanned ${scannedCount} files, modified ${modifiedCount} files.`);
console.log('Run your application to ensure everything works correctly.'); 