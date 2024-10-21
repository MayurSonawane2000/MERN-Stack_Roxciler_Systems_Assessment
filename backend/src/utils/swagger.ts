import swaggerAutogen from 'swagger-autogen';

const config = {
  info: {
    version: "1.0.0",
    title: " Roxiler Systems Application",
    description: " Roxiler Systems Application",
  },
  servers: [
    { url: 'https://roxciler-systems-assement.onrender.com', description: 'Production server' },
    { url: 'http://localhost:8000', description: 'Local server' },
  ],
  schemes: ['http', 'https'],
  tags: [],
}

const outputfile = './src/json/swagger_output.json';

const routes = [
  './src/app.ts',
]

const options = {
  openapi: '3.0.0',
  language: 'en-US',
  autoHeaders: true,
  autoBody: true,
  autoQuery: true,
  autoResponses: true,
};


swaggerAutogen(options)(outputfile, routes, config)


