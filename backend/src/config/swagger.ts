import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Web Development API',
      version: '1.0.0',
      description: 'API documentation for users and events management',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local server',
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
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Server error' },
          },
          required: ['message'],
        },
        AuthSuccess: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Authorization successful',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
          required: ['message', 'token'],
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Operation completed successfully',
            },
          },
          required: ['message'],
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Alice' },
            firstName: { type: 'string', example: 'Ivan' },
            lastName: { type: 'string', example: 'Ivanov' },
            middleName: {
              type: 'string',
              nullable: true,
              example: 'Ivanovich',
            },
            gender: {
              type: 'string',
              enum: ['male', 'female'],
              example: 'male',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '2000-05-21',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'alice@mail.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-27T10:00:00.000Z',
            },
          },
          required: [
            'id',
            'name',
            'firstName',
            'lastName',
            'gender',
            'birthDate',
            'email',
            'createdAt',
          ],
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 7 },
            title: { type: 'string', example: 'Team meetup' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Discuss Q2 goals',
            },
            category: {
              type: 'string',
              example: 'local meetup',
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-15T18:30:00.000Z',
            },
            createdBy: { type: 'integer', example: 1 },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-27T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-27T10:10:00.000Z',
            },
          },
          required: [
            'id',
            'title',
            'category',
            'date',
            'createdBy',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
