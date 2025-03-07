const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

interface FetchOptions extends RequestInit {
  retries?: number;
}

/**
 * Enhanced fetch function with retry logic and better error handling
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = MAX_RETRIES, ...fetchOptions } = options;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url.startsWith('http') ? url : `${apiUrl}${url}`, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      // Only retry on network errors or 5xx server errors
      if (response.ok || response.status < 500) {
        return response;
      }

      console.warn(`Request failed (attempt ${i + 1}/${retries}):`, {
        status: response.status,
        url: response.url,
      });

      // On last retry, return the error response
      if (i === retries - 1) {
        return response;
      }
    } catch (error) {
      // On last retry, throw the error
      if (i === retries - 1) {
        throw error;
      }

      console.warn(`Network error (attempt ${i + 1}/${retries}):`, error);
    }

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }

  throw new Error('Request failed after max retries');
}

/**
 * Helper function to handle JSON responses
 */
export async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * API client with common request methods
 */
export const api = {
  async get<T>(url: string, options: FetchOptions = {}): Promise<T> {
    const response = await fetchWithRetry(url, {
      ...options,
      method: 'GET',
    });
    return handleJsonResponse<T>(response);
  },

  async post<T>(url: string, data: any, options: FetchOptions = {}): Promise<T> {
    const response = await fetchWithRetry(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleJsonResponse<T>(response);
  },

  async put<T>(url: string, data: any, options: FetchOptions = {}): Promise<T> {
    const response = await fetchWithRetry(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleJsonResponse<T>(response);
  },

  async delete<T>(url: string, options: FetchOptions = {}): Promise<T> {
    const response = await fetchWithRetry(url, {
      ...options,
      method: 'DELETE',
    });
    return handleJsonResponse<T>(response);
  },
}; 