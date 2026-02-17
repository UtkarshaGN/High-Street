// scripts/generate-openapi-spec.mjs
import fs from 'fs';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Gym Project API",
      description: "JSON REST API interacting with the gym project backend"
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "auth_key"
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  },
  apis: ["./controllers/api/**/*.{js,mjs,yaml}"]
};

const specification = swaggerJSDoc(options);
fs.writeFileSync('./openapi.json', JSON.stringify(specification, null, 2));
console.log('OpenAPI spec generated successfully!');