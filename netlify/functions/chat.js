// Serverless function to proxy Groq API requests
// This keeps your API key secret and secure

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const { messages } = JSON.parse(event.body);

        // Make request to Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();

        // Return the response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow CORS
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Chat function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};
