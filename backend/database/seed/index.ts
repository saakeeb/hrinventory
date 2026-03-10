import http from 'http';
import app from './app';
import { config } from './config';
import { log } from './utils/logger';
import { handleUpgrade } from '../websocket/server';

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
  // The handleUpgrade function contains authentication logic for websockets
  handleUpgrade(request, socket, head);
});

server.listen(config.port, () => {
  log.info(`Server listening on http://localhost:${config.port}`);
});