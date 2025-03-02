#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run ESLint to get all unused variable errors
console.log('🔍 Finding unused variables and imports...');

try {
  const result = execSync('npx eslint src --ext .ts,.tsx -f json', { encoding: 'utf-8' });
  const lintResults = JSON.parse(result);
  
  // Filter for unused variable errors
  const unusedVarErrors = [];
  
  lintResults.forEach(file => {
    const filePath = file.filePath;
    const relativePath = path.relative(process.cwd(), filePath);
    
    file.messages.forEach(message => {
      // Check if the message is about unused variables
      if (message.ruleId === '@typescript-eslint/no-unused-vars') {
        const lineNum = message.line;
        
        // Try to get the actual code line
        let codeLine = '';
        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const lines = fileContent.split('\n');
          codeLine = lines[lineNum - 1].trim();
        } catch (err) {
          codeLine = '[Error reading line]';
        }
        
        unusedVarErrors.push({
          file: relativePath,
          line: lineNum,
          column: message.column,
          message: message.message,
          code: codeLine
        });
      }
    });
  });
  
  // Group by file
  const groupedErrors = unusedVarErrors.reduce((acc, error) => {
    if (!acc[error.file]) {
      acc[error.file] = [];
    }
    acc[error.file].push(error);
    return acc;
  }, {});
  
  // Print the results in a nice format
  console.log('\n📊 Unused Variables Report:\n');
  
  let fileCount = 0;
  let errorCount = 0;
  
  Object.entries(groupedErrors).forEach(([file, errors]) => {
    fileCount++;
    errorCount += errors.length;
    
    console.log(`\n📄 ${file} (${errors.length} unused variables):`);
    
    errors.forEach((error, i) => {
      console.log(`  ${i + 1}. Line ${error.line}: ${error.message}`);
      console.log(`     ${error.code}`);
    });
  });
  
  console.log(`\n✨ Summary: Found ${errorCount} unused variables/imports in ${fileCount} files.`);
  console.log('');
  console.log('🛠️  Suggested Solution:');
  console.log('   - For unused variables, prefix with underscore: rename "variable" to "_variable"');
  console.log('   - For unused imports, either remove them or prefix with underscore');
  console.log('   - For unused function parameters, prefix with underscore');
  console.log('');
  console.log('💡 Note: Be careful when modifying code. Only make changes you understand.');
  
} catch (error) {
  console.error('Error running ESLint:', error.message);
  console.error(error.stdout?.toString() || '');
} 