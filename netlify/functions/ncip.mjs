const axios = require('axios');

exports.handler = async function (event, context) {
    const src = event.queryStringParameters.src;

    if (!src) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: 'Missing "src" query parameter',
        };
    }

    try {
        const response = await axios.get(src, {
            responseType: 'arraybuffer', // Ensure binary data is handled correctly
        });

        return {
            statusCode: response.status,
            headers: {
                ...response.headers,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: response.data.toString('base64'),
            isBase64Encoded: true, // Necessary for binary content
        };
    } catch (error) {
        if (error.response) {
            return {
                statusCode: error.response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: error.response.data.toString('utf-8'),
            };
        } else {
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: 'Error fetching the URL',
            };
        }
    }
};