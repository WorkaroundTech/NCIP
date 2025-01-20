const axios = require('axios');

exports.handler = async function (event, context) {
    // this function will act as a proxy to a non-https endpoint
    // the endpoint is passed as a query parameter
    const src = event.queryStringParameters.src;

    // if the src parameter is missing, return an error
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

    // forward the request to the src URL, make sure to differentiate GET and POST requests and also forward the body
    try {
        const response = await axios({
            method: event.httpMethod,
            url: src,
            data: event.body,
            headers: {
                ...event.headers,
                'Host': new URL(src).host, // Ensure the host header is correct
            }
        });

        return {
            statusCode: response.status,
            headers: {
                ...response.headers,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(response.data)
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