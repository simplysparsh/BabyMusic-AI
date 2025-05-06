# Security

Baby Music AI takes security seriously and implements various measures to protect user data and ensure a secure application environment.

## Authentication

The application uses Supabase's built-in authentication system, which supports email/password authentication out of the box. When a user registers or logs in, Supabase generates a JSON Web Token (JWT) that is used to authenticate subsequent requests to the backend API.

The frontend stores the JWT in local storage and includes it in the `Authorization` header of API requests. The backend API verifies the JWT before processing any authenticated requests.

### Token Refresh Mechanism

To ensure uninterrupted user experience during extended sessions (particularly important for music playback), the application implements a comprehensive token refresh strategy:

1. **Automatic Periodic Refresh**: JWT tokens are automatically refreshed every 10 minutes to prevent expiration during long sessions.

2. **Event-based Refreshes**: Tokens are refreshed when the application regains focus after being in the background.

3. **Operation-specific Refreshes**: Tokens are proactively refreshed before critical operations:
   - Song creation
   - Retry of failed song generation
   - Toggling song favorites
   - Opening Stripe customer portal
   - Initiating premium checkout

4. **Enhanced Error Recovery**: The application includes a retry mechanism with automatic token refresh for Edge Function calls that fail due to authentication issues.

5. **Timeouts and Fallbacks**: For certain operations, the application implements fallback paths to ensure the user experience remains smooth even when backend services experience delays.

This multi-layered approach prevents issues where requests to Supabase Edge Functions would be dropped early ("EarlyDrop") due to stale tokens, particularly affecting long-running music playback sessions.

## Authorization

Baby Music AI implements role-based access control (RBAC) to authorize user actions based on their assigned roles. The application defines the following roles:

- `user`: Regular users who can generate songs, view their own songs, and manage their profile.
- `admin`: Administrators who have access to additional features, such as managing users and viewing analytics.

The backend API endpoints check the user's role before allowing access to specific resources or actions. For example, only users with the `admin` role can access the user management endpoints.

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

## Security Best Practices

In addition to the above measures, Baby Music AI follows general security best practices:

- Keeping all dependencies up to date with the latest security patches
- Using secure coding practices and following the OWASP Top 10 guidelines
- Conducting regular security audits and penetration testing
- Implementing a bug bounty program to encourage responsible disclosure of vulnerabilities
- Providing security training to developers and team members

By implementing these security measures and following best practices, Baby Music AI aims to provide a secure and trustworthy application for its users.
