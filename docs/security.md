# Security

Baby Music AI takes security seriously and implements various measures to protect user data and ensure a secure application environment.

## Authentication

The application uses Supabase's built-in authentication system, which supports email/password authentication out of the box. When a user registers or logs in, Supabase generates a JSON Web Token (JWT) that is used to authenticate subsequent requests to the backend API.

The frontend stores the JWT in local storage and includes it in the `Authorization` header of API requests. The backend API verifies the JWT before processing any authenticated requests.

Supabase automatically handles token refresh with its built-in `autoRefreshToken: true` configuration, ensuring seamless authentication during extended sessions.

## Authorization

Baby Music AI implements role-based access control (RBAC) to authorize user actions based on their assigned roles. The application defines the following roles:

- `user`: Regular users who can generate songs, view their own songs, and manage their profile.
- `admin`: Administrators who have access to additional features, such as managing users and viewing analytics.

The backend API endpoints check the user's role before allowing access to specific resources or actions. For example, only users with the `admin` role can access the user management endpoints.

## Real-time Security

The application implements comprehensive security measures for real-time data synchronization:

### Row Level Security (RLS)

All real-time subscriptions are protected by Supabase Row Level Security policies:

```sql
-- Example RLS policy for songs table
CREATE POLICY "Users can view their own songs" ON songs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own songs" ON songs
  FOR UPDATE USING (auth.uid() = user_id);
```

**RLS Benefits:**
- **Data Isolation**: Users can only access their own data through real-time subscriptions
- **Automatic Filtering**: Database-level filtering prevents unauthorized data exposure
- **Consistent Security**: Same security model for API calls and real-time updates

### Token Management in RealtimeHandler

The custom `RealtimeHandler` system implements secure token handling:

```typescript
// Automatic token refresh for real-time connections
private async refreshSessionIfNeeded() {
  const { data, error } = await this.supabaseClient.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error('Session not found');
  
  // Update real-time connection with fresh token
  if (this.supabaseClient.realtime.accessTokenValue !== data.session.access_token) {
    await this.supabaseClient.realtime.setAuth(data.session.access_token);
  }
}
```

**Security Features:**
- **Token Expiration Detection**: Automatically detects expired tokens and refreshes them
- **Secure Reconnection**: Ensures real-time connections use valid authentication
- **Error Handling**: Properly handles authentication errors in real-time contexts

### Real-time Subscription Security

All real-time channels implement user-specific filtering:

```typescript
// Secure channel setup with user filtering
const songsChannelFactory: ChannelFactory = (supabase) => {
  return supabase
    .channel(`songs-${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'songs',
      filter: `user_id=eq.${userId}`, // Critical: User-specific filtering
    }, handleSongUpdate);
};
```

**Key Security Measures:**
- **User-Specific Channels**: Each user subscribes only to their own data
- **Database-Level Filtering**: Combines with RLS for defense in depth
- **Channel Isolation**: Prevents cross-user data leakage

## Data Protection

Baby Music AI takes several measures to protect user data:

### Encryption

Sensitive user data, such as passwords, are never stored in plain text. Passwords are hashed using a secure hashing algorithm (e.g., bcrypt) before being stored in the database.

### Secure Communication

All communication between the frontend and backend is done over HTTPS, ensuring that data is encrypted in transit. The application uses SSL/TLS certificates to establish secure connections.

### Input Validation and Sanitization

User input is always validated and sanitized before being processed by the backend API. This helps prevent common security vulnerabilities, such as SQL injection and cross-site scripting (XSS) attacks.

### Rate Limiting

The backend API implements rate limiting to prevent abuse and protect against denial-of-service (DoS) attacks. It limits the number of requests a user can make within a specific time window.

### Secure Cookies

When using cookies for authentication or session management, the application sets the `secure` and `httpOnly` flags to ensure that cookies are only sent over HTTPS and are not accessible via JavaScript.

## Third-Party Dependencies

Baby Music AI relies on several third-party libraries and services, such as Supabase, PIAPI.ai, and Anthropic Claude. The application carefully vets these dependencies and keeps them up to date to ensure they are secure and free from known vulnerabilities.

## Real-time Connection Security

The RealtimeHandler system implements additional security measures:

### Connection Lifecycle Management

- **Tab Visibility Handling**: Automatically disconnects real-time when tabs are hidden for extended periods to prevent unauthorized long-running connections
- **Resource Cleanup**: Properly cleans up connections to prevent memory leaks and reduce attack surface
- **Connection Limits**: Manages the number of concurrent real-time connections per user

### Error Handling Security

```typescript
// Secure error handling in RealtimeHandler
case REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR: {
  if (document.hidden) {
    // Security: Remove channels when tab is hidden to prevent lingering connections
    await this.supabaseClient.removeChannel(channel);
    return;
  } else if (err && isTokenExpiredError(err)) {
    // Security: Handle token expiration securely
    this.resubscribeToChannel(topic);
  }
  // Log errors securely without exposing sensitive information
  console.warn(`Channel error in '${topic}': `, err?.message);
}
```

## Security Best Practices

In addition to the above measures, Baby Music AI follows general security best practices:

- Keeping all dependencies up to date with the latest security patches
- Using secure coding practices and following the OWASP Top 10 guidelines
- Conducting regular security audits and penetration testing
- Implementing a bug bounty program to encourage responsible disclosure of vulnerabilities
- Providing security training to developers and team members
- **Real-time Security Monitoring**: Monitoring real-time connection patterns for unusual activity
- **Secure Token Handling**: Implementing proper token refresh and expiration handling in real-time contexts
- **Data Access Controls**: Ensuring real-time subscriptions respect the same security boundaries as API endpoints

By implementing these security measures and following best practices, Baby Music AI aims to provide a secure and trustworthy application for its users, with particular attention to the security of real-time data synchronization.
