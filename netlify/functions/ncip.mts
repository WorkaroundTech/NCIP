import cors from 'cors';
import axios from 'axios';
import serverless from 'serverless-http';
import express, { Router, Request, Response } from 'express';

const app = express();
const router = Router();


router.get("/", cors(), async (req: Request, res: Response): Promise<any> => {
    const sourceUrl = req.query?.src as string;
    console.log("trying to fetch data from: ", { sourceUrl });
    if (!sourceUrl) {
        return res.status(400).json({ error: 'Missing source query parameter' });
    }

    try {
        const response = await axios.get(sourceUrl, {
            responseType: 'arraybuffer', // Ensures binary data (e.g., images) is handled correctly.
        });

        // Set headers from the proxied response
        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        console.log("response status: ", response.status);
        console.log("response headers: ", response.headers);

        // Send the exact response data
        // send
        res.status(response.status).write(response.data);
        res.end()
    } catch (error) {
        console.error({ error })
        const status = error.response?.status || error.status || 500;
        return res.status(status).json({ error: 'Failed to fetch data', status, responseData: error?.response?.data?.toString() });
    }
});

app.use('/api', router)

app.use((req: Request, res: Response): any => {
    return res.status(404).json({
      path: req.path,
      error: "Not Found",
    });
});

export const handler = serverless(app);