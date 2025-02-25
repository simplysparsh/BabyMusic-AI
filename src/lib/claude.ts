import { supabase } from './supabase';

interface ValidatedResponse {
  text: string;
  quality: {
    length: number;
    hasName: boolean
  };
}

export class ClaudeAPI {
  private static validateResponse(text: string, prompt: string): ValidatedResponse {
    const trimmedText = text.trim();
    
    // Check if response contains the name from the prompt
    const nameMatch = prompt.match(/for\s+(\w+)/);
    const expectedName = nameMatch ? nameMatch[1] : null;
    const hasName = expectedName ? trimmedText.includes(expectedName) : true;

    return {
      text: trimmedText.length > 3000 ? trimmedText.slice(0, 3000) : trimmedText,
      quality: {
        length: trimmedText.length,
        hasName
      }
    };
  }

  static async makeRequest(fullPrompt: string): Promise<ValidatedResponse> {
    try {
      console.log('Making Claude API request:', {
        promptLength: fullPrompt.length
      });

      if (!import.meta.env.VITE_CLAUDE_API_KEY) {
        throw new Error('Claude API key is not configured');
      }

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1000,
            messages: [
              {
                role: 'user',
                content: fullPrompt,
              },
            ],
            temperature: 0.7,
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Claude API error response:', {
            status: response.status,
            statusText: response.statusText,
            errorText
          });

          throw new Error(
            response.status === 401
              ? 'Invalid API key'
              : response.status === 429
              ? 'Rate limit exceeded'
              : response.status >= 500
              ? 'Claude API service error'
              : `Claude API error: ${errorText || response.statusText}`
          );
        }

        const data = await response.json();
        const rawResponse = data.content[0].text;
        
        // Validate and process the response
        const validatedResponse = this.validateResponse(rawResponse, fullPrompt);
        
        // Log validation results
        console.log('Claude response validation:', {
          length: validatedResponse.quality.length,
          hasName: validatedResponse.quality.hasName,
          truncated: validatedResponse.text.length < rawResponse.length
        });

        return validatedResponse;
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        
        // Check if it's an abort error (timeout)
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('Claude API request timed out after 30 seconds');
          throw new Error('Claude API request timed out. Please try again.');
        }
        
        throw fetchError;
      }
    } catch (error: unknown) {
      console.error('Claude API error:', error);
      
      // Create a fallback response with a simple placeholder
      const nameMatch = fullPrompt.match(/for\s+(\w+)/);
      const name = nameMatch ? nameMatch[1] : 'little one';
      
      const fallbackText = `Let's sing a song for ${name}!\n` +
        `${name}, ${name}, bright and strong,\n` +
        `We're so happy to sing along.\n` +
        `Music and joy all day long,\n` +
        `This is ${name}'s special song!`;
      
      console.log('Using fallback lyrics due to API error');
      
      return {
        text: fallbackText,
        quality: {
          length: fallbackText.length,
          hasName: true
        }
      };
    }
  }
}
