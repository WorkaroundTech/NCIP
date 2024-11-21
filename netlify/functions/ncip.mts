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
        const response = await axios.get(sourceUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64url');
        const dataURL = `data:${response.headers['content-type']};base64,${base64Image}`;

        return res.status(200).json({ url: sourceUrl, dataURL });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to fetch image' });
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