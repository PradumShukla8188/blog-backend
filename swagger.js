const swaggerJsdoc = require('swagger-jsdoc');
const { config } = require('./config');

const port = config.env.server.port || 4001;
const serverUrl = process.env.RENDER_EXTERNAL_URL
  || `http://${config.env.server.host || '127.0.0.1'}:${port}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tech-round Blog API',
      version: '1.0.0',
      description: 'REST API for authentication, blog posts, and admin user management.',
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.RENDER_EXTERNAL_URL ? 'Render server' : 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiMessage: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  value: { type: 'string' },
                  msg: { type: 'string' },
                  path: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'confirmPassword'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@yopmail.com' },
            password: { type: 'string', minLength: 6, example: 'User@123' },
            confirmPassword: { type: 'string', example: 'User@123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin12@yopmail.com' },
            password: { type: 'string', example: 'Admin@123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            roleId: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string', enum: ['admin', 'user'] },
                displayValue: { type: 'string' },
              },
            },
            roleName: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['admin', 'user'] },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['admin', 'user'] },
          },
        },
        Blog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateBlogRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string', example: 'Getting Started with Node.js' },
            content: { type: 'string', example: 'Node.js is a JavaScript runtime...' },
          },
        },
        UpdateBlogRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] },
          },
        },
      },
    },
    paths: {
      '/api/v1/onBoarding/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error or user exists' },
            500: { description: 'Server error' },
          },
        },
      },
      '/api/v1/onBoarding/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginResponse' },
                },
              },
            },
            400: { description: 'Invalid credentials' },
            500: { description: 'Server error' },
          },
        },
      },
      '/api/v1/blog': {
        get: {
          tags: ['Blog'],
          summary: 'Get all blogs (admin)',
          responses: {
            200: {
              description: 'List of blogs',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Blog' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Blog'],
          summary: 'Create a blog post',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateBlogRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Blog created' },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/v1/blog/active': {
        get: {
          tags: ['Blog'],
          summary: 'Get active blogs (public)',
          responses: {
            200: { description: 'List of active blogs' },
          },
        },
      },
      '/api/v1/blog/my': {
        get: {
          tags: ['Blog'],
          summary: 'Get current user blogs',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of user blogs' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/v1/blog/{id}': {
        get: {
          tags: ['Blog'],
          summary: 'Get blog by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Blog details' },
            404: { description: 'Blog not found' },
          },
        },
        patch: {
          tags: ['Blog'],
          summary: 'Update blog (owner or admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateBlogRequest' },
              },
            },
          },
          responses: {
            200: { description: 'Blog updated' },
            403: { description: 'Forbidden' },
            404: { description: 'Blog not found' },
          },
        },
        delete: {
          tags: ['Blog'],
          summary: 'Delete blog (owner or admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Blog deleted' },
            403: { description: 'Forbidden' },
            404: { description: 'Blog not found' },
          },
        },
      },
      '/api/v1/users': {
        get: {
          tags: ['Users (Admin)'],
          summary: 'Get all users',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of users' },
            401: { description: 'Unauthorized' },
            403: { description: 'Admin only' },
          },
        },
        post: {
          tags: ['Users (Admin)'],
          summary: 'Create user',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUserRequest' },
              },
            },
          },
          responses: {
            201: { description: 'User created' },
            400: { description: 'Validation error' },
            403: { description: 'Admin only' },
          },
        },
      },
      '/api/v1/users/{id}': {
        get: {
          tags: ['Users (Admin)'],
          summary: 'Get user by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'User details' },
            404: { description: 'User not found' },
          },
        },
        patch: {
          tags: ['Users (Admin)'],
          summary: 'Update user',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateUserRequest' },
              },
            },
          },
          responses: {
            200: { description: 'User updated' },
            404: { description: 'User not found' },
          },
        },
        delete: {
          tags: ['Users (Admin)'],
          summary: 'Delete user',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'User deleted' },
            400: { description: 'Cannot delete own account' },
            404: { description: 'User not found' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
