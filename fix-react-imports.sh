#!/bin/bash

# This script automatically fixes unused React imports across the codebase

echo "Beginning React import cleanup..."

# Stage 1: Run ESLint to identify and fix problems
echo "Running ESLint to find and report issues..."
npx eslint . --ext .tsx,.ts

# Stage 2: Automated find and replace to remove basic 'import React from "react"' statements
echo "Removing unused React imports..."
find ./src -name "*.tsx" -o -name "*.ts" | xargs grep -l "import React from 'react';" | xargs sed -i '' "s/import React from 'react';//g"

# Stage 3: Fix files that use React.useState pattern
echo "Converting React.useState to named imports..."
find ./src -name "*.tsx" -o -name "*.ts" | xargs grep -l "React\.useState" | while read file; do
  # Check if the file already has a named import for useState
  if ! grep -q "import { .*useState.* } from 'react';" "$file"; then
    # Add useState to imports or create a new import
    if grep -q "import { .* } from 'react';" "$file"; then
      # Add to existing named imports
      sed -i '' "s/import { \(.*\) } from 'react';/import { \1, useState } from 'react';/" "$file"
    else
      # Create new named import
      sed -i '' "1s/^/import { useState } from 'react';\n/" "$file"
    fi
  fi
  
  # Replace React.useState with useState
  sed -i '' "s/React\.useState/useState/g" "$file"
done

# Similarly for useEffect, useRef, etc.
# (Add more patterns as needed)

echo "Clean-up complete! Please review changes and run your tests." 