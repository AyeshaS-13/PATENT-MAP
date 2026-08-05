const errorHandler = (err, req, res, next) => {
  console.error('[PATENT MAP ERROR]', err.stack || err.message || err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;
