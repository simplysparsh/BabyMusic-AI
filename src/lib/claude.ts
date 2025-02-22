import { supabase } from './supabase';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

if (!CLAUDE_API_KEY) {
  throw new Error('VITE_CLAUDE_API_KEY environment variable is required');
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
      console.log('Making Claude API request:', {
        promptLength: prompt.length,
        apiUrl: CLAUDE_API_URL,
        hasApiKey: !!CLAUDE_API_KEY
      });

      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        throw new Error(
          response.status === 401 ? 'Invalid API key' :
          response.status === 429 ? 'Rate limit exceeded' :
          response.status >= 500 ? 'Claude API service error' :
          `Claude API error: ${errorText || response.statusText}`
        );
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error: unknown) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate lyrics. Please try again.');
    }
  }

  static async generateLyrics(prompt: string): Promise<string> {
    if (!prompt?.trim()) {
      throw new Error('Prompt is required for lyrics generation');
    }

    const systemPrompt = `You are a professional children's songwriter specializing in creating engaging, 
age-appropriate lyrics. Your task is to create lyrics based on the following requirements:

1. Name: ALWAYS use the child's name exactly as provided, do not modify or abbreviate it
2. Length: 4-8 lines maximum
3. Language: Simple, child-friendly words
4. Pattern: Include natural repetition
5. Rhythm: Maintain consistent meter
6. Tone: Positive and uplifting
7. Theme: Follow provided mood/theme
8. Format: Plain text with line breaks

Output only the lyrics, no explanations or additional text.`;

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    
    try {
      console.log('Sending lyrics prompt to Claude:', {
        promptStart: prompt.slice(0, 100) + '...',
        hasName: prompt.includes('for') && /for\s+\w+/.test(prompt)
      });

      const lyrics = await this.makeRequest(fullPrompt);
      // Ensure output doesn't exceed PIAPI limit
      const trimmedLyrics = lyrics.trim();
      
      console.log('Claude response:', {
        lyricsStart: trimmedLyrics.slice(0, 100) + '...',
        length: trimmedLyrics.length
      });
      
      return trimmedLyrics.length > 3000 ? trimmedLyrics.slice(0, 3000) : trimmedLyrics;
    } catch (error) {
      console.error('Lyrics generation failed:', error);
      throw error;
    }
  }
}