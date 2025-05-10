import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the structure for environment variable prompts
interface EnvVarPrompt {
  name: string;
  description: string;
  isBoolean?: boolean;
  defaultValue?: string;
}

// Environment variables to prompt for
const envVarPrompts: EnvVarPrompt[] = [
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
    description: 'Your webhook secret key for local testing (can be any random string)'
  },
  {
    name: 'VITE_DISABLE_SIGNUP',
    description: 'Disable new user signups?',
    isBoolean: true,
    defaultValue: 'false'
  },
  {
    name: 'VITE_FEATURE_STREAK_ENABLED',
    description: 'Enable feature streak?',
    isBoolean: true,
    defaultValue: 'false'
  },
  {
    name: 'VITE_SHOW_UNAVAILABLE_BANNER',
    description: 'Show unavailable banner?',
    isBoolean: true,
    defaultValue: 'false'
  }
];

// Function to prompt for environment variables
async function promptForEnvVars(): Promise<Record<string, string>> {
  const envVars: Record<string, string> = {};

  for (const envVar of envVarPrompts) {
    let promptMessage: string;
    if (envVar.isBoolean) {
      promptMessage = `Enable ${envVar.name} (${envVar.description})? (y/n) [default: ${envVar.defaultValue === 'true' ? 'y' : 'n'}]: `;
    } else {
      promptMessage = `Enter ${envVar.name} (${envVar.description}): `;
    }

    const value = await new Promise<string>(resolve => {
      rl.question(promptMessage, answer => {
        let finalValue = answer.trim();
        if (envVar.isBoolean) {
          if (finalValue.toLowerCase() === 'y') {
            finalValue = 'true';
          } else if (finalValue.toLowerCase() === 'n') {
            finalValue = 'false';
          } else {
            finalValue = envVar.defaultValue || 'false'; // Default to 'false' if invalid or empty
          }
        }
        resolve(finalValue);
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
  console.log('Ensure any Supabase backend functions are configured separately if needed (see docs/deployment.md).');
  console.log('You can now run the application with:');
  console.log('  npm install (if you haven\'t already)');
  console.log('  npm run dev');

  rl.close();
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 