import { join } from 'path';

import * as express from 'express';

import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';

import { createServer } from 'http';
import router from './router';
import upgradeHandler from './upgradeHandler';


const app = express();

// cors
app.use(cors({
    credentials: true,
    origin: [
        new RegExp('gruppe-adler.de$', 'i'),
        new RegExp('localhost:[0-9]+$', 'i'),
        new RegExp('127.0.0.1:[0-9]+$', 'i'),
        new RegExp('127.0.0.1$', 'i'),
        new RegExp('localhost$', 'i')
    ]
}));

// body parser
app.use(bodyParser.json());

// logger
app.use(morgan('short'));

// api
app.use('/api/', router);

// frontend
app.use('/', express.static(join(__dirname, '../frontend')));
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/index.html'));
});

const {
    PORT = '80'
} = process.env;

const port = Number.parseInt(PORT, 10);

const server = createServer(app);

server.on('upgrade', upgradeHandler);

server.listen(port);

console.log(`
    Server listening on: 127.0.0.1:${port}
`);
