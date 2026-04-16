const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product API',
      version: '1.0.0',
      description: 'API documentation untuk Product CRUD dengan Authentication',
      contact: {
        name: 'API Support',
        email: 'support@productapi.com'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Current Server (Dynamic)'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Token untuk authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'Nama user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email user'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'Role user'
            },
            password: {
              type: 'string',
              description: 'Password user (hashed)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'description'],
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID'
            },
            name: {
              type: 'string',
              description: 'Nama produk'
            },
            description: {
              type: 'string',
              description: 'Deskripsi produk'
            },
            price: {
              type: 'number',
              description: 'Harga produk'
            },
            stock: {
              type: 'number',
              description: 'Stok produk'
            },
            creator: {
              type: 'string',
              description: 'ID user yang membuat produk'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: [
    './routes/authRoutes.js',
    './routes/productRoutes.js'
  ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
