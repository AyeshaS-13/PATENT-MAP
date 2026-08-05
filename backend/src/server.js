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

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'PATENT MAP Backend Service',
    status: 'Running',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.originalUrl} not found on this server.` }
  });
});

// Global Error Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` PATENT MAP Express Backend running on port ${PORT}`);
    console.log(` REST API URL: http://localhost:${PORT}/api`);
    console.log(`=================================================`);
  });
}

module.exports = app;
