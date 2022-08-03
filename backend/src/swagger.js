const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app.js'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'Social Media API',
    description: 'API for app </b>Social Media</b>',
  },
  host: process.env.VIRTUAL_HOST || 'localhost:8080',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],

  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      in: 'header', // can be "header", "query" or "cookie"
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'Please enter a valid token to test the requests below...',
    },
  },
  definitions: {
    User: {},
    Post: {},
    Conversation: {},
    Message: {},
    Comment: {},
    addUser: {},
    editUser: {},
    addPost: {},
    editPost: {},
    addConversation: {},
    addMessage: {},
    addComment: {},
    editComment: {},
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
