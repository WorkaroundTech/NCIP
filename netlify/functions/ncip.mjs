const axios = require('axios');

exports.handler = async function (event, context) {
    const src = event.queryStringParameters.src;

    if (!src) {
        return {
            statusCode: 400,
            body: 'Missing "src" query parameter',
        };
    }

    try {
        const response = await axios.get(src, {
            responseType: 'arraybuffer', // Ensure binary data is handled correctly
        });

        return {
            statusCode: response.status,
            headers: response.headers,
            body: response.data.toString('base64'),
            isBase64Encoded: true, // Necessary for binary content
        };
    } catch (error) {
        if (error.response) {
            return {
                statusCode: error.response.status,
                body: error.response.data.toString('utf-8'),
            };
        } else {
            return {
                statusCode: 500,
                body: 'Error fetching the URL',
            };
        }
    }
};