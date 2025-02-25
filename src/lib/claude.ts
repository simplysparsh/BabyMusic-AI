import Anthropic from '@anthropic-ai/sdk';

interface ValidatedResponse {
  text: string;
  quality: {
    length: number;
    hasName: boolean
  };
}

export class ClaudeAPI {
  private static client: Anthropic;

  private static getClient(): Anthropic {
    if (!this.client) {
      if (!import.meta.env.VITE_CLAUDE_API_KEY) {
        throw new Error('Claude API key is not configured');
      }
      this.client = new Anthropic({
        apiKey: import.meta.env.VITE_CLAUDE_API_KEY
      });
    }
    return this.client;
  }

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
    console.log('Making Claude API request:', {
      promptLength: fullPrompt.length
    });

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const client = this.getClient();
      
      const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
        temperature: 0.7
      });

      clearTimeout(timeoutId);

      const rawResponse = response.content[0].text;
      
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
      
      // Handle Anthropic API errors
      if (fetchError instanceof Anthropic.APIError) {
        console.error('Claude API error:', fetchError);
        throw new Error(
          fetchError.status === 401
            ? 'Invalid API key'
            : fetchError.status === 429
            ? 'Rate limit exceeded'
            : fetchError.status >= 500
            ? 'Claude API service error'
            : `Claude API error: ${fetchError.message}`
        );
      }
      
      // Rethrow the error to be handled by the caller
      throw fetchError;
    }
  }
}
