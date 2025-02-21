import { supabase } from './supabase';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

if (!CLAUDE_API_KEY) {
  throw new Error('CLAUDE_API_KEY environment variable is required');
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  id: string;
  content: string;
  role: 'assistant';
}

export class ClaudeAPI {
  private static async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error: ${error}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate lyrics. Please try again.');
    }
  }

  static async generateLyrics(prompt: string): Promise<string> {
    const systemPrompt = `You are a professional children's songwriter specializing in creating engaging, 
age-appropriate lyrics. Your task is to create lyrics based on the following requirements:

1. Length: 4-8 lines maximum
2. Language: Simple, child-friendly words
3. Pattern: Include natural repetition
4. Rhythm: Maintain consistent meter
5. Tone: Positive and uplifting
6. Theme: Follow provided mood/theme
7. Name: Feature child's name prominently
8. Format: Plain text with line breaks

Output only the lyrics, no explanations or additional text.`;

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    
    try {
      const lyrics = await this.makeRequest(fullPrompt);
      // Ensure output doesn't exceed PIAPI limit
      const trimmedLyrics = lyrics.trim();
      return trimmedLyrics.length > 3000 ? trimmedLyrics.slice(0, 3000) : trimmedLyrics;
    } catch (error) {
      console.error('Lyrics generation failed:', error);
      throw error;
    }
  }
}