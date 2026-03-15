const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import database connection
const db = require('./src/configs/db');

const config = require('./src/configs/config');

const userRoutes = require('./src/routes/user.routes');

dotenv.config();

const app = express();
const PORT = config.PORT || 5000;

// Function to get local time timestamp
const getLocalTimestamp = () => {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  };
  return now.toLocaleString('en-US', options);
};

// Override console methods globally
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

console.log = function(...args) {
  const timestamp = getLocalTimestamp();
  originalConsoleLog(`[${timestamp}]`, ...args);
};

console.error = function(...args) {
  const timestamp = getLocalTimestamp();
  originalConsoleError(`[${timestamp}] [ERROR]`, ...args);
};

console.warn = function(...args) {
  const timestamp = getLocalTimestamp();
  originalConsoleWarn(`[${timestamp}] [WARN]`, ...args);
};

console.info = function(...args) {
  const timestamp = getLocalTimestamp();
  originalConsoleInfo(`[${timestamp}] [INFO]`, ...args);
};

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`${req.method} ${req.url} - Request received`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    if (statusCode >= 400) {
      console.error(`${req.method} ${req.url} - Response: ${statusCode} (${duration}ms)`);
    } else if (statusCode >= 300) {
      console.warn(`${req.method} ${req.url} - Response: ${statusCode} (${duration}ms)`);
    } else {
      console.log(`${req.method} ${req.url} - Response: ${statusCode} (${duration}ms)`);
    }
  });
  
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  console.log(`Health check requested - Database: ${dbStatus}`);
  
  res.status(200).json({ 
    status: 'OK', 
    message: 'CMS API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Home route
app.get('/', (req, res) => {
  res.send('CMS API is running');
});

//routes
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  console.warn(`Route not found: ${req.method} ${req.url}`);
  
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server and connect to database
const startServer = async () => {
  try {
    console.log('Starting server...');
    
    // Connect to MongoDB
    await db.connect();
    console.log('Database connected successfully');
    
    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚀 Eventory API Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;