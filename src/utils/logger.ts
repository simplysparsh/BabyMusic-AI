/**
 * Logger utility that selectively enables logging based on environment
 * All console logs will be stripped in production by the babel plugin
 * This provides a unified interface for logging that's easy to control
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  // Add timestamp to logged messages
  timestamp?: boolean;
  // Add any tags for filtering logs
  tags?: string[];
}

const defaultOptions: LogOptions = {
  timestamp: true,
  tags: []
};

/**
 * Environment-aware logger that provides consistent formatting
 * In production, all output will be removed automatically by babel
 */
class Logger {
  /**
   * Log information at specified level
   */
  static log(level: LogLevel, message: string, data?: any, options: LogOptions = defaultOptions): void {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV !== 'production';
    
    // Get console method based on level
    const method = console[level] || console.log;
    
    // Format the log message
    const timestamp = options.timestamp ? `[${new Date().toISOString()}]` : '';
    const tags = options.tags?.length ? `[${options.tags.join('][')}]` : '';
    const prefix = `${timestamp}${tags}[${level.toUpperCase()}]`;
    
    // Log the message with appropriate formatting
    if (data) {
      method(`${prefix} ${message}`, data);
    } else {
      method(`${prefix} ${message}`);
    }
  }
  
  /**
   * Shorthand methods for each log level
   */
  static debug(message: string, data?: any, options?: LogOptions): void {
    this.log('debug', message, data, options);
  }
  
  static info(message: string, data?: any, options?: LogOptions): void {
    this.log('info', message, data, options);
  }
  
  static warn(message: string, data?: any, options?: LogOptions): void {
    this.log('warn', message, data, options);
  }
  
  static error(message: string, data?: any, options?: LogOptions): void {
    this.log('error', message, data, options);
  }
}

export default Logger; 