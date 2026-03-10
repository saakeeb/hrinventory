import WebSocket, { WebSocketServer } from 'ws';
import { verifyToken } from '@/utils/jwt';
import { log } from '@/utils/logger';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, req) => {
  const user = req.user;
  log.info(`WebSocket connection established for user: ${user.id}`);

  ws.on('message', (message) => {
    log.info(`Received message from user ${user.id}:`, message);
  });

  ws.on('close', () => {
    log.info(`WebSocket connection closed for user: ${user.id}`);
  });
});

export function handleUpgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    try {
      const token = request.headers['sec-websocket-protocol'];
      if (!token) {
        throw new Error('Missing authentication token');
      }

      const user = verifyToken(token);
      request.user = user;
      wss.emit('connection', ws, request);
    } catch (error) {
      log.error('WebSocket authentication failed:', error);
      socket.destroy();
    }
  });
}

export default wss;