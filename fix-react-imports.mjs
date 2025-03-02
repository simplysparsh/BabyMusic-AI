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

console.log('🔍 Scanning for files with React imports to optimize...');

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

// Map of known React namespace usages to their import names
const reactNamespaceMap = {
  'React.FormEvent': 'FormEvent',
  'React.ChangeEvent': 'ChangeEvent',
  'React.MouseEvent': 'MouseEvent',
  'React.KeyboardEvent': 'KeyboardEvent',
  'React.ComponentType': 'ComponentType',
  'React.ReactNode': 'ReactNode',
  'React.useEffect': 'useEffect',
  'React.useState': 'useState',
  'React.useRef': 'useRef',
  'React.useMemo': 'useMemo',
  'React.useCallback': 'useCallback',
  'React.useContext': 'useContext',
  'React.FC': 'FC',
  'React.FunctionComponent': 'FunctionComponent',
  'React.ReactElement': 'ReactElement',
  'React.CSSProperties': 'CSSProperties',
  'React.Fragment': 'Fragment'
  // Add more as needed
};

// Get all files
const files = findFiles(srcDir);
let modifiedCount = 0;

// Process each file
files.forEach(filePath => {
  const relativePath = path.relative(process.cwd(), filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Case 1: import React from 'react';
  const standaloneImportPattern = /import\s+React\s+from\s+['"]react['"];?/;
  const hasStandaloneImport = standaloneImportPattern.test(content);
  
  // Case 2: import React, { useState, useEffect } from 'react';
  const combinedImportPattern = /import\s+React,\s*{([^}]*)}\s+from\s+['"]react['"];?/;
  const combinedImportMatch = content.match(combinedImportPattern);
  
  // Case 3: import { ... } from 'react';
  const namedImportPattern = /import\s*{\s*([^}]*)\s*}\s+from\s+['"]react['"];?/;
  const namedImportMatch = content.match(namedImportPattern);
  
  // Check if React is used directly in the code
  const reactUsagesRegex = /React\.[a-zA-Z]+/g;
  const reactUsages = content.match(reactUsagesRegex);
  const hasReactNamespaceUsage = reactUsages && reactUsages.length > 0;
  
  // Track needed named imports
  let neededImports = new Set();
  
  // Handle Case 3: React namespace usage conversion
  if (hasReactNamespaceUsage) {
    console.log(`Converting React namespace usage in: ${relativePath}`);
    console.log(`Namespace usages: ${reactUsages.join(', ')}`);
    
    // Collect needed imports
    reactUsages.forEach(usage => {
      if (reactNamespaceMap[usage]) {
        neededImports.add(reactNamespaceMap[usage]);
        
        // Replace React.X with X in content
        const replacement = reactNamespaceMap[usage];
        const usagePattern = new RegExp(usage.replace('.', '\\.'), 'g');
        content = content.replace(usagePattern, replacement);
        modified = true;
      }
    });
  }
  
  // Handle imports based on what we found
  if (neededImports.size > 0) {
    // Convert set to sorted array
    const importsList = Array.from(neededImports).sort();
    
    // Case 1: If we have standalone React import
    if (hasStandaloneImport) {
      // Replace standalone with named imports
      content = content.replace(
        standaloneImportPattern,
        `import { ${importsList.join(', ')} } from 'react';`
      );
      modified = true;
    }
    // Case 2: If we have combined import
    else if (combinedImportMatch) {
      const existingImports = combinedImportMatch[1]
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp.length > 0);
      
      // Merge existing and new imports, remove duplicates
      const allImports = Array.from(new Set([...existingImports, ...importsList])).sort();
      
      // Replace with updated combined imports
      content = content.replace(
        combinedImportPattern,
        `import { ${allImports.join(', ')} } from 'react';`
      );
      modified = true;
    }
    // Case 3: If we have named imports already
    else if (namedImportMatch) {
      const existingImports = namedImportMatch[1]
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp.length > 0);
      
      // Merge existing and new imports, remove duplicates
      const allImports = Array.from(new Set([...existingImports, ...importsList])).sort();
      
      // Replace with updated named imports
      content = content.replace(
        namedImportPattern,
        `import { ${allImports.join(', ')} } from 'react';`
      );
      modified = true;
    }
    // Case 4: No existing React import at all
    else {
      // Add a new import statement at the top of the file
      content = `import { ${importsList.join(', ')} } from 'react';\n${content}`;
      modified = true;
    }
  }
  // Handle Case 1: Standalone React import with no namespace usage
  else if (hasStandaloneImport && !hasReactNamespaceUsage) {
    console.log(`Found unused standalone React import in: ${relativePath}`);
    // Remove the React import
    content = content.replace(standaloneImportPattern, '');
    modified = true;
  }
  // Handle Case 2: Combined import with no namespace usage
  else if (combinedImportMatch && !hasReactNamespaceUsage) {
    console.log(`Found unused React in combined import in: ${relativePath}`);
    const namedImports = combinedImportMatch[1].trim();
    
    // Replace with just the named imports
    content = content.replace(
      combinedImportPattern, 
      `import { ${namedImports} } from 'react';`
    );
    modified = true;
  }
  
  // Write changes if modified
  if (modified) {
    fs.writeFileSync(filePath, content);
    modifiedCount++;
    console.log(`✅ Fixed: ${relativePath}`);
  }
});

console.log(`\n✨ Complete! Modified ${modifiedCount} files.`);
console.log('Run your application to ensure everything works correctly.'); 