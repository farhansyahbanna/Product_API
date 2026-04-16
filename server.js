const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/database');
const { generalLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Trust proxy when deployed di platform yang menggunakan reverse proxy
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all API routes
app.use(generalLimiter);

// Swagger documentation
const swaggerUiOptions = {
  customCss: '.swagger-ui { font-family: sans-serif; }',
  customSiteTitle: 'Product API Documentation'
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Product API',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me (Private)'
      },
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:id',
        create: 'POST /api/products (Private: User/Admin)',
        update: 'PUT /api/products/:id (Private: Admin only)',
        delete: 'DELETE /api/products/:id (Private: Admin only)'
      }
    }
  });
});

// Error handler for 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});