/**
 * Utility function for robust database operations with retry logic
 * @param operation The database operation to perform
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @param timeoutMs Timeout in milliseconds (default: 8000)
 * @returns The result of the operation
 */
export const withRetry = async <T>(operation: () => Promise<T> | T, maxRetries = 3, timeoutMs = 8000): Promise<T> => {
  let lastError: any;
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    let timeoutHandle: NodeJS.Timeout | undefined;
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      });
      
      // Race between the operation and the timeout
      const result = await Promise.race([
        Promise.resolve(operation()), // Ensure operation() result is treated as a Promise
        timeoutPromise
      ]);
      
      clearTimeout(timeoutHandle); // Clear the timeout if operation completed
      return result;

    } catch (error: any) {
      if (timeoutHandle) clearTimeout(timeoutHandle); // Clear timeout in case of non-timeout error

      lastError = error;
      
      // If this is a timeout error, log and continue to retry
      if (error.message && error.message.includes('timed out')) {
        console.warn(`Operation timed out, retrying (attempt ${retryCount + 1}/${maxRetries})`);
      }
      // If this is a known non-retriable Supabase/Postgres error, throw immediately
      // PGRST116: Object not found
      // 23505: Unique violation
      // Add other non-retriable codes as needed
      else if (error?.code === 'PGRST116' || error?.code === '23505') {
        console.error('Non-retriable database error:', error);
        throw error;
      }
      // Log other types of errors before retrying
      else {
        console.warn(`Database operation failed with non-timeout error (attempt ${retryCount + 1}/${maxRetries}):`, error);
      }
      
      if (retryCount >= maxRetries) {
        break;
      }
      
      // Exponential backoff
      const delay = 500 * Math.pow(2, retryCount);
      console.warn(`Retrying database operation in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
    }
  }
  
  console.error(`All ${maxRetries} retry attempts failed for database operation. Last error:`, lastError);
  // Add more context to the final error thrown
  const finalError = new Error(`Database operation failed after ${maxRetries + 1} attempts.`);
  (finalError as any).cause = lastError; 
  throw finalError;
}; 