import express from 'express';
import cors from 'cors';
import path from 'path';
import { router } from './root.routes';
import dotenv from 'dotenv';
import json from './middlewares/json';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import './types/global.request';
import https from 'https';

export const app = express();

app.use('/static', express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://192.168.2.154:3000/',
      process.env.FRONTEND_BASE_URL || 'http://localhost:3000'
    ],
    credentials: true
  })
);
// Trust the proxy
app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config({ path: path.join('.env') });

app.use(json);

app.use('/api', router);

let PORT = parseInt(process.env.APP_PORT || '8000');
const HOST = process.env.APP_HOST || 'localhost';
if (process.env.NODE_ENV === 'test') {
  PORT = parseInt(process.env.TEST_APP_PORT || '8000');
}

const sslOptions = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

https.createServer(sslOptions, app).listen(PORT, HOST, () => {
  console.log(`Secure server running at https://${HOST}:${PORT}`);
});
