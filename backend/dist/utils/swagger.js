"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
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
};
const outputfile = './src/json/swagger_output.json';
const routes = [
    './src/app.ts',
];
const options = {
    openapi: '3.0.0',
    language: 'en-US',
    autoHeaders: true,
    autoBody: true,
    autoQuery: true,
    autoResponses: true,
};
(0, swagger_autogen_1.default)(options)(outputfile, routes, config);
