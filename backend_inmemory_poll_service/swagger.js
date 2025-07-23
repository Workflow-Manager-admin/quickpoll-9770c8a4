const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuickPoll Poll API',
      version: '1.0.0',
      description:
        'A simple in-memory poll API for QuickPoll. Poll creation, voting, and results. See /ws-info for WebSocket live update instructions.',
    },
    components: {
      schemas: {
        Poll: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Poll ID' },
            question: { type: 'string', description: 'The poll question' },
            options: {
              type: 'array',
              items: { type: 'string' },
              description: 'Poll answer options',
            },
            createdAt: { type: 'string', format: 'date-time' },
            closed: { type: 'boolean', description: 'If true, poll is closed to voting' },
          },
        },
        PollWithVotes: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            question: { type: 'string' },
            options: {
              type: 'array',
              items: { type: 'string' },
            },
            votes: {
              type: 'array',
              items: { type: 'integer' },
              description: 'Vote counts for each option (parallel to options array)',
            },
            createdAt: { type: 'string', format: 'date-time' },
            closed: { type: 'boolean' },
          },
        },
      },
    },
    tags: [
      { name: 'Polls', description: 'Poll management and voting endpoints' },
      { name: 'WebSocket', description: 'Real-time updates via WebSocket' }
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
