import { Handler } from '@netlify/functions';

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Safely parse JSON with error handling
    let email = '';
    try {
      const body = JSON.parse(event.body || '{}');
      email = body.email || '';
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Validate API key and publication ID
    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      console.error('Missing Beehiiv API key or publication ID');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Call Beehiiv API to add subscriber
    try {
      const apiUrl = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`;
      
      const requestBody = {
        email: email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'website_waitlist',
        utm_medium: 'organic',
        utm_campaign: 'waitlist_signup',
        referring_site: 'tuneloom.com'
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      let data;
      try {
        const responseText = await response.text();
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Error parsing response as JSON:', jsonError);
          data = { text: responseText };
        }
      } catch (textError) {
        console.error('Error getting response text:', textError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error processing response from email service' }),
        };
      }

      // Check for success (201 Created or 200 OK)
      if (response.status === 201 || response.status === 200) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            message: 'Successfully added to waitlist! Please check your email to confirm your subscription.'
          }),
        };
      }
      
      // Handle duplicate email more gracefully
      if (response.status === 409 || (data.error && data.error.includes('already exists'))) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            message: 'You\'re already on our waitlist!'
          }),
        };
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: data.message || data.error || 'Failed to subscribe' 
        }),
      };
    } catch (fetchError) {
      console.error('Fetch error calling Beehiiv API:', fetchError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Error connecting to email service' }),
      };
    }
  } catch (error) {
    console.error('Waitlist error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}; 