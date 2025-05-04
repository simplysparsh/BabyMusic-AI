// supabase/functions/_shared/cors.ts

// Define standard CORS headers
// Initially allow all origins, but consider restricting this in production
// to your actual frontend URL(s).
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE', // Add methods as needed
};

// Helper function to handle OPTIONS preflight requests
export function handleCorsPreflight() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204, // No Content for preflight
  });
}

// Helper to add CORS headers to a standard Response
export function addCorsHeaders(response: Response): Response {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
} 