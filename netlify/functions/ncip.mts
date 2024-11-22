import cors from 'cors';
import axios from 'axios';
import serverless from 'serverless-http';
import express, { Router, Request, Response } from 'express';

const app = express();
const router = Router();


router.get("/", cors(), async (req: Request, res: Response): Promise<any> => {
    const sourceUrl = req.query?.src as string;
    console.log("trying to fetch image from: ", { sourceUrl });
    if (!sourceUrl) {
        return res.status(400).json({ error: 'Missing source query parameter' });
    }

    try {
        const response = await axios.get(sourceUrl);
        console.log("response headers: ", response.headers);
        console.log("response data: ", { data: response.data.toString().substring(0, 100) });
        const contentType = response.headers['Content-Type']?.toString() || 'application/octet-stream';
        const contentLength = response.headers['Content-Length']?.toString() || '0';
        res.set({
            "Content-Type": contentType,
            "Content-Length": contentLength
        })
        .status(response.status)
        .send(response.data)
    } catch (error) {
        console.error({ error })
        const status = error.response?.status || error.status || 500;
        return res.status(status).json({ error: 'Failed to fetch image', status, responseData: error?.response?.data?.toString() });
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