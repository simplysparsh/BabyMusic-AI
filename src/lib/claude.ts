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
        apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
        dangerouslyAllowBrowser: true // Required for browser environments
      });
    }
    return this.client;
  }

  private static validateResponse(text: string, babyName?: string): ValidatedResponse {
    const trimmedText = text.trim();
    
    // Clean the response text
    const cleanedText = trimmedText
      // First remove any text before a colon at the start
      .replace(/^[^:\n]+:\s*/m, '')
      // Then clean up any remaining explanatory text
      .replace(/^(Here are|Here's|These are|I've created|The lyrics for|This is a|This song)[^:\n]*\n/gim, '')
      // Remove any empty lines at the start
      .replace(/^\s*\n/, '')
      .trim();
    
    // Check if response contains the babyName directly
    const hasName = babyName ? cleanedText.includes(babyName) : true;

    return {
      text: cleanedText.length > 3000 ? cleanedText.slice(0, 3000) : cleanedText,
      quality: {
        length: cleanedText.length,
        hasName
      }
    };
  }

  static async makeRequest(userPrompt: string, systemPrompt?: string, babyName?: string): Promise<ValidatedResponse> {
    console.log('Making Claude API request:', {
      userPromptLength: userPrompt.length,
      hasSystemPrompt: !!systemPrompt,
      hasBabyName: !!babyName
    });

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const client = this.getClient();
      
      // Construct the messages array for the API request
      const messagesParams = [];
      
      // Add system prompt if provided
      if (systemPrompt) {
        messagesParams.push({
          role: 'system' as const, // Type assertion to satisfy Anthropic SDK types
          content: systemPrompt
        });
      }
      
      // Add user prompt
      messagesParams.push({
        role: 'user' as const, // Type assertion to satisfy Anthropic SDK types
        content: userPrompt
      });
      
      const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: messagesParams,
        temperature: 0.7
      });

      clearTimeout(timeoutId);

      // Extract the text content from the response
      const rawResponse = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';
      
      // Validate and process the response with the baby name
      const validatedResponse = this.validateResponse(rawResponse, babyName);
      
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
