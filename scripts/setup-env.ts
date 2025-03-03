import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Required environment variables
const requiredEnvVars = [
  {
    name: 'VITE_SUPABASE_URL',
    description: 'Your Supabase URL (e.g., https://your-project.supabase.co)'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    description: 'Your Supabase anonymous key'
  },
  {
    name: 'VITE_PIAPI_KEY',
    description: 'Your PIAPI.ai API key'
  },
  {
    name: 'VITE_CLAUDE_API_KEY',
    description: 'Your Anthropic Claude API key'
  },
  {
    name: 'VITE_WEBHOOK_SECRET',
    description: 'Your webhook secret key (can be any random string)'
  }
];

// Function to prompt for environment variables
async function promptForEnvVars(): Promise<Record<string, string>> {
  const envVars: Record<string, string> = {};

  for (const envVar of requiredEnvVars) {
    const value = await new Promise<string>(resolve => {
      rl.question(`Enter ${envVar.name} (${envVar.description}): `, answer => {
        resolve(answer.trim());
      });
    });

    envVars[envVar.name] = value;
  }

  return envVars;
}

// Function to create .env.local file
function createEnvFile(envVars: Record<string, string>): void {
  const envFilePath = path.resolve(process.cwd(), '.env.local');
  
  let envFileContent = '';
  for (const [key, value] of Object.entries(envVars)) {
    envFileContent += `${key}=${value}\n`;
  }

  fs.writeFileSync(envFilePath, envFileContent);
  console.log(`Created .env.local file at ${envFilePath}`);
}

// Main function
async function main() {
  console.log('Welcome to the BabyMusic-AI environment setup!');
  console.log('This script will help you set up your .env.local file with the required environment variables.');
  console.log('');

  // Check if .env.local already exists
  const envFilePath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envFilePath)) {
    const answer = await new Promise<string>(resolve => {
      rl.question('.env.local file already exists. Do you want to overwrite it? (y/n): ', answer => {
        resolve(answer.trim().toLowerCase());
      });
    });

    if (answer !== 'y') {
      console.log('Setup cancelled. Your existing .env.local file was not modified.');
      rl.close();
      return;
    }
  }

  // Prompt for environment variables
  const envVars = await promptForEnvVars();

  // Create .env.local file
  createEnvFile(envVars);

  console.log('');
  console.log('Setup complete! Your .env.local file has been created with the provided environment variables.');
  console.log('You can now run the application with:');
  console.log('  npm run dev');

  rl.close();
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 