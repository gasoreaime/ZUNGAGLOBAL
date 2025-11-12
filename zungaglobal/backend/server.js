// backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './routes/auth.js';

// Config
dotenv.config();
import connectDatabase from './config/database.js';

const app = express();

// Connect to database
connectDatabase();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 ZungaGlobal Backend is running smoothly!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ZungaGlobal API',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/profile'
      },
      health: 'GET /api/health'
    },
    documentation: 'Coming soon...'
  });
});

// Handle undefined routes - FIXED: Remove the problematic wildcard route
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '🔍 API endpoint not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me'
    ]
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ZungaGlobal Backend API',
    version: '1.0.0',
    documentation: '/api'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Error Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || '🔥 Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 ZUNGA GLOBAL BACKEND SERVER');
  console.log('='.repeat(50));
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI ? 'Connected ✅' : 'Not configured ❌'}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
  console.log('📋 Available Endpoints:');
  console.log('   GET  /api/health     - Health check');
  console.log('   POST /api/auth/register - User registration');
  console.log('   POST /api/auth/login    - User login');
  console.log('   GET  /api/auth/me       - Get user profile');
  console.log('='.repeat(50) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

export default app;