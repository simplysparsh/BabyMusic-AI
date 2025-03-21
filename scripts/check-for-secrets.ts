import * as fs from 'fs';
import * as _path from 'path';
import * as glob from 'glob';

// Patterns that might indicate secrets
const secretPatterns = [
  /supabaseUrl\s*=\s*["'](?!process|import\.meta)/i,
  /supabaseKey\s*=\s*["'](?!process|import\.meta)/i,
  /apiKey\s*=\s*["'](?!process|import\.meta)/i,
  /SUPABASE_URL\s*=\s*["'](?!process|import\.meta|your_)/i,
  /SUPABASE_ANON_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /PIAPI_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /CLAUDE_API_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /WEBHOOK_SECRET\s*=\s*["'](?!process|import\.meta|your_)/i,
  /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/i, // JWT pattern
  /OPENAI_API_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /ANTHROPIC_API_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /GOOGLE_API_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /AWS_ACCESS_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /AWS_SECRET_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /DATABASE_URL\s*=\s*["'](?!process|import\.meta|your_)/i,
  /POSTGRES_PASSWORD\s*=\s*["'](?!process|import\.meta|your_)/i,
  /STRIPE_SECRET_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /GITHUB_TOKEN\s*=\s*["'](?!process|import\.meta|your_)/i,
  /sk_live_[0-9a-zA-Z]{24,}/i, // Stripe live key pattern
  /rk_live_[0-9a-zA-Z]{24,}/i, // Stripe restricted key pattern
  /xox[baprs]-([0-9a-zA-Z]{10,48})/i, // Slack token pattern
  /ghp_[0-9a-zA-Z]{36}/i, // GitHub personal access token pattern
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/i, // UUID pattern
  /-----BEGIN\s+(RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY-----/i, // Private key pattern
];

// Patterns to exclude (common false positives)
const excludePatterns = [
  /key={/i, // React key prop
  /key=\{/i, // React key prop with space
  /key\s*=\s*\{/i, // React key prop with more spaces
  /primaryKey=/i, // Database primary key
  /foreignKey=/i, // Database foreign key
  /keyframes/i, // CSS keyframes
  /keydown/i, // Keyboard event
  /keyup/i, // Keyboard event
  /keypress/i, // Keyboard event
  /keyboard/i, // Keyboard related
  /hotkey/i, // Hotkey related
  /publicKey/i, // Public key (not sensitive)
  /keyof/i, // TypeScript keyof operator
  /keyCode/i, // Key code in events
  /keyboardEvent/i, // Keyboard event
];

// Files and directories to exclude
const excludePaths = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'node_modules',
  'dist',
  'build',
  '.git',
  'scripts/check-for-secrets.ts', // Exclude this script itself
  'README.md', // Exclude README as it contains examples
];

// Function to check if a file might contain secrets
async function checkFileForSecrets(filePath: string): Promise<string[]> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    const findings: string[] = [];

    lines.forEach((line, index) => {
      // Skip lines that match exclude patterns
      if (excludePatterns.some(pattern => pattern.test(line))) {
        return;
      }

      // Check for secret patterns
      for (const pattern of secretPatterns) {
        if (pattern.test(line)) {
          findings.push(`Found potential secret pattern "${pattern.source.substring(0, 20)}..." in ${filePath} at line ${index + 1}`);
          break; // Only report once per line
        }
      }
    });

    return findings;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Function to scan directories
async function scanDirectories(): Promise<string[]> {
  const findings: string[] = [];
  
  // Get all files except excluded ones
  const files = glob.sync('**/*', {
    ignore: excludePaths,
    nodir: true,
    dot: true,
  });

  console.log(`Checking ${files.length} files for hardcoded secrets...`);
  
  // Check each file
  for (const file of files) {
    // Skip binary files and non-text files
    if (!/\.(js|jsx|ts|tsx|json|yml|yaml|xml|html|css|scss|md|txt|sh|env.*|config)$/.test(file) && 
        !file.includes('.env')) {
      continue;
    }
    
    const fileFindings = await checkFileForSecrets(file);
    findings.push(...fileFindings);
  }
  
  return findings;
}

// Main function
async function main() {
  console.log('Checking for hardcoded secrets in the codebase...');
  
  const findings = await scanDirectories();
  
  if (findings.length > 0) {
    console.log(`Found ${findings.length} potential hardcoded secrets:`);
    findings.forEach(finding => console.log(`- ${finding}`));
    console.log('\nPlease review these findings and move any secrets to .env.local');
  } else {
    console.log('No hardcoded secrets found. Good job!');
  }
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 