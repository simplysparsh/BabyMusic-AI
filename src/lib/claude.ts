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
          model: 'claude-3-opus-20240229',
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

1. The lyrics are for songs upto 2 mins.
2. Use simple, clear language appropriate for young children
3. Include natural repetition for memorability
4. Maintain consistent rhythm and meter
5. Ensure lyrics are positive and uplifting
6. Follow all specific mood, theme, and tempo guidance provided
7. Always feature the child's name prominently
8. Keep total output under 3000 characters

Format the output as plain text lyrics with line breaks.
Do not include any explanations or additional text.`;

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