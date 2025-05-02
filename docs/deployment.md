# Deployment

This document provides instructions on how to deploy the Baby Music AI application to production environments.

## Prerequisites

Before deploying the application, ensure that you have the following:

- A Supabase project set up with the required database tables and configurations
- API keys for PIAPI.ai and Anthropic Claude
- A Netlify account for deploying the frontend
- The latest version of the application code

## Frontend Deployment

The Baby Music AI frontend is deployed using Netlify, a popular platform for deploying static websites and web applications.

To deploy the frontend:

1. Create a new site in your Netlify account.
2. Connect the site to your Git repository containing the frontend code.
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set the following environment variables in the Netlify site settings:
   - `VITE_SUPABASE_URL`: The URL of your Supabase project
   - `VITE_SUPABASE_ANON_KEY`: The anonymous key of your Supabase project
   - `VITE_PIAPI_KEY`: Your PIAPI.ai API key
   - `VITE_CLAUDE_API_KEY`: Your Anthropic Claude API key
5. Trigger a new deploy by pushing changes to your Git repository or manually deploying from the Netlify dashboard.

Netlify will automatically build and deploy your frontend application whenever changes are pushed to the connected Git repository.

## Quick Deploy Commands

For a quick deployment of updated code, use:

```bash
# Build the application
npm run build

# Deploy to production
netlify deploy --prod
```

## Netlify Functions

The application uses Netlify Functions for serverless backend operations. The following functions are deployed:

- **waitlist.ts**: Handles email signup for the waitlist when user registration is disabled.

To deploy Netlify Functions:

1. Ensure your `netlify.toml` file has the functions directory specified:
   ```
   [build]
     functions = "netlify/functions"
   ```
2. Set the required environment variables in the Netlify dashboard.
3. Functions will be automatically deployed when you deploy your application to Netlify.

## Backend Deployment

The Baby Music AI backend is deployed using Supabase Edge Functions, which are serverless functions that run on the Supabase infrastructure.

### Deploy Edge Functions

To deploy the backend:

1. Install the Supabase CLI by running `npm install -g supabase`.
2. Log in to your Supabase account using `supabase login`.
3. Link your local project to your Supabase project using `supabase link --project-ref your-project-ref`.

### ⚠️ CRITICAL: Webhook Function Deployment

When deploying webhook functions (e.g., `piapi-webhook`), you **MUST** disable JWT verification:

```bash
supabase functions deploy piapi-webhook --no-verify-jwt
```

**Reason:** External services calling webhooks don't have Supabase JWT tokens. Without this flag, the webhook will reject all external calls with 401 Unauthorized errors.

**Verification:** After deployment, check the Supabase Dashboard to confirm JWT verification is disabled:
1. Go to the Supabase dashboard > Edge Functions
2. Select the webhook function
3. Verify "JWT verification" is set to "Disabled"

### Regular Functions (Non-Webhooks)

For functions that should only be called by authenticated users, use:

```bash
supabase functions deploy function-name

supabase functions deploy toggle-favorite
```

The default behavior will require valid JWT tokens.

### Environment Variables and Database

4. Set the required environment variables for your Edge Functions using `supabase secrets set`:
   - `PIAPI_KEY`: Your PIAPI.ai API key
   - `CLAUDE_API_KEY`: Your Anthropic Claude API key
   - `WEBHOOK_SECRET`: Your webhook secret for handling PIAPI.ai callbacks
5. Push the database schema and migrations using `supabase db push`.

Your backend Edge Functions and database schema will now be deployed and ready to handle requests from the frontend.

## Troubleshooting Webhooks

If webhook is not receiving events:
1. Check JWT verification is disabled
2. Verify webhook secret matches between sender and receiver
3. Check Supabase logs for any errors

## Continuous Deployment

To automate the deployment process and enable continuous deployment, you can set up a CI/CD pipeline using tools like GitHub Actions or GitLab CI/CD.

The basic steps for setting up a CI/CD pipeline are:

1. Create a new workflow file in your Git repository (e.g., `.github/workflows/deploy.yml` for GitHub Actions).
2. Define the triggers for the workflow, such as pushing to the main branch or creating a new release.
3. Set up the required environment variables for your CI/CD pipeline, such as API keys and Supabase project details.
4. Add steps to your workflow to build and deploy the frontend and backend:
   - Install dependencies
   - Build the frontend
   - Deploy the frontend to Netlify
   - Install the Supabase CLI
   - Link the project to your Supabase project
   - Deploy the Edge Functions
   - Push the database schema and migrations
5. Commit and push the workflow file to your Git repository.

**Important:** In CI/CD pipelines, always include the `--no-verify-jwt` flag when deploying webhook functions:

```yaml
# Example GitHub Action step
- name: Deploy webhook functions
  run: supabase functions deploy piapi-webhook --no-verify-jwt
```

With a CI/CD pipeline in place, your application will be automatically deployed whenever changes are pushed to the specified branch or a new release is created.

## Monitoring and Error Tracking

To ensure the stability and reliability of your deployed application, it's important to set up monitoring and error tracking.

Some popular tools for monitoring and error tracking include:

- Sentry: For capturing and tracking frontend and backend errors
- New Relic: For monitoring application performance and identifying bottlenecks
- Supabase Logs: For monitoring and analyzing Supabase Edge Function logs
- Netlify Analytics: For tracking frontend usage and performance metrics

By setting up these tools and configuring appropriate alerts, you can proactively identify and resolve issues in your production environment.

## Key URLs

- Production site: https://www.babymusic.ai
- Netlify dashboard: https://app.netlify.com/sites/babymusic
- Supabase dashboard: https://supabase.com/dashboard/project/ustflrmqamppbghixjyl

## Conclusion

Deploying the Baby Music AI application involves deploying the frontend to Netlify, deploying the backend Edge Functions to Supabase, and setting up the required environment variables and database schema.

By following the steps outlined in this document and implementing a CI/CD pipeline, you can automate the deployment process and ensure a smooth and reliable deployment of your application to production environments.

Remember to monitor your application and set up error tracking to identify and resolve any issues that may arise in production.
