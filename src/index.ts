require('dotenv').config();

import express, { Express, Request, Response } from 'express';
import { Service } from './Service';

const app: Express = express();
const port = process.env.PORT || 3001;

app.get('/', async (_req: Request, res: Response) => {
    const service = new Service();
    const accounts = await service.getAccountsWithTransactions();

    res.send(accounts);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
