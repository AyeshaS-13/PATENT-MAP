const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Root /api endpoint overview
app.get(['/api', '/api/'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PATENT MAP REST API Gateway Active',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      patent: '/api/patent',
      history: '/api/history',
      explorer: '/api/explorer'
    }
  });
});

// Root health check endpoint
app.get('/api/info', (req, res) => {
  res.status(200).json({
    name: 'PATENT MAP Backend Service',
    status: 'Running',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Serve Vite production bundle statically
const path = require('path');
const distPath = path.join(__dirname, '../../web/dist');
if (require('fs').existsSync(distPath)) {
  console.log('[STATIC BUILD] Serving Vite web bundle from:', distPath);
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.originalUrl} not found on this server.` }
  });
});

// Global Error Middleware
app.use(errorHandler);

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('[SOCKET.IO] Connected client:', socket.id);

  socket.on('DEVICE_NAVIGATION', (payload) => {
    socket.broadcast.emit('REMOTE_NAVIGATION', payload);
  });

  socket.on('DEVICE_STATE_CHANGE', (payload) => {
    socket.broadcast.emit('REMOTE_STATE_CHANGE', payload);
  });

  socket.on('PATENT_UPLOAD_SYNC', (payload) => {
    socket.broadcast.emit('REMOTE_PATENT_UPLOAD', payload);
  });

  socket.on('disconnect', () => {
    console.log('[SOCKET.IO] Disconnected client:', socket.id);
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(` PATENT MAP Express Backend running on port ${PORT}`);
    console.log(` Web App Local URL: http://localhost:${PORT}/ (or http://localhost:5173/)`);
    console.log(` REST API Base URL: http://localhost:${PORT}/api`);
    console.log(`=================================================`);
  });
}

module.exports = app;
