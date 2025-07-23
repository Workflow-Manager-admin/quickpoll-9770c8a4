const app = require('./app');
const { createServer } = require('http');
const WebSocket = require('ws');
const pollController = require('./controllers/poll');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const httpServer = createServer(app);

// Set up WebSocket for poll results
const wss = new WebSocket.Server({ server: httpServer, path: '/polls/live' });
wss.on('connection', (ws, req) => {
  pollController.wsHandler(ws, req);
});

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(
    `WebSocket for poll results at ws://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/polls/live`
  );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = httpServer;
