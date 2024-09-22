import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],  
    credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DocumentChunk {
    pageContent: string;
    metadata: Record<string, unknown>;
}

async function fetchData(): Promise<DocumentChunk[]> {
    try {
        const filePath = path.join(__dirname, '../data/knowledge_base.txt');  
        const text = await fs.readFile(filePath, 'utf8');  

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
            separators: ['###', '\n\n', '\n', ' ', '']
        });

        const splitDocuments: DocumentChunk[] = await textSplitter.createDocuments([text]);

        return splitDocuments;
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching data'); 
    }
}

app.get('/text-splitter', async (req: Request, res: Response) => {
    const splitTextData = await fetchData();
    if (splitTextData) {
        res.status(200).json({ data: splitTextData });
    } else {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));