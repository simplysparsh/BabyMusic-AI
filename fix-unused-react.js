#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let wasModified = false;
  
  // 1. Fix standalone React imports
  if (content.includes('import React from \'react\';') ||
      content.includes('import React from "react";')) {
    
    // Check if React is actually used in the file
    const hasReactNamespaceUsage = /React\.[a-zA-Z]+/.test(content);
    
    // If React is not directly used, remove the import
    if (!hasReactNamespaceUsage) {
      content = content
        .replace('import React from \'react\';', '')
        .replace('import React from "react";', '');
      
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
        // Replace React import with named imports
        content = content
          .replace('import React from \'react\';', `import { ${hooksToImport.join(', ')} } from 'react';`)
          .replace('import React from "react";', `import { ${hooksToImport.join(', ')} } from 'react';`);
          
        // Replace all React.X with X
        hooksToImport.forEach(hook => {
          content = content.replace(new RegExp(`React\\.${hook}`, 'g'), hook);
        });
        
        wasModified = true;
      }
    }
  }
  
  // 2. Cleanup empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Save changes if the file was modified
  if (wasModified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
    modifiedCount++;
  }
});

console.log(`\n✨ Complete! Modified ${modifiedCount} files.`);
console.log('Run your application to ensure everything works correctly.'); 