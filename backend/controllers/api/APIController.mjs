import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
import YAML from "yamljs";

import apiAuthController from "./APIAuthenticationController.mjs";
import { APIPostController } from "./APIPostController.mjs";
import apiUserController from "./APIUserController.mjs";
import APISessionController from "./APISessionController.mjs";
import {APIBookingController} from "./APIBookingController.mjs";
import ApiExportController from "./APIExportController.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openapiPath = path.join(process.cwd(), 'openapi.yaml');

const swaggerOptions = {
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
          name: "auth_key",
          description: "Enter your auth_key from /auth/login"
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  },
  apis: ["./controllers/api/**/*.mjs"]
};

const swaggerSpecification = swaggerJSDoc(swaggerOptions);

export class APIController {
  static routes = express.Router();

  static {
    // Swagger UI Documentation
    this.routes.use(
      "/docs",
      swaggerUI.serve,
      swaggerUI.setup(swaggerSpecification, {
        explorer: true,
        swaggerOptions: {
          persistAuthorization: true,
        }
      })
    );

    // OpenAPI Validator Middleware
    this.routes.use(
      OpenApiValidator.middleware({
        apiSpec: openapiPath,
        validateRequests: {
          allowUnknownQueryParameters: true, // Allow unknown query params
          coerceTypes: true,
          removeAdditional: false,
        },
        validateResponses: true,
        validateSecurity: {
          handlers: {
            ApiKeyAuth: async (req, scopes, schema) => {
              //  Just pass through - let your apiAuth middleware handle it
              const authKey = req.headers['auth_key'];
              
              // Don't throw error here, just return true
              // Your apiAuth middleware will handle the actual validation
              if (authKey) {
                return true;
              }
              
              // Return true even if no auth_key
              // Your route middleware (apiAuth) will handle unauthorized access
              return true;
            }
          }
        },
        ignorePaths: /.*\/docs.*/,
      })
    );

    // Error handler for OpenAPI validation errors
    this.routes.use((err, req, res, next) => {
      if (err.status) {
        console.error('OpenAPI Validation Error:', {
          status: err.status,
          message: err.message,
          errors: err.errors,
          path: req.path,
          method: req.method
        });

        return res.status(err.status).json({
          error: err.message,
          details: err.errors || [],
          path: req.path
        });
      }
      
      next(err);
    });

    /**
     *  Public API routes
     */
    this.routes.use("/auth", apiAuthController);

    /**
     *  Protected API routes (auth_key required)
     */
    this.routes.use("/users", apiUserController);
    this.routes.use("/posts", APIPostController.routes);
    this.routes.use("/sessions", APISessionController.routes);
    this.routes.use("/bookings", APIBookingController.routes);
    // this.routes.use("/microblog", APIMicroblogController.routes);
    this.routes.use("/xml", ApiExportController.routes);
  }
}



// import express from "express";
// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUI from "swagger-ui-express";
// import fs from 'fs';
// import * as ApiValidator from "express-openapi-validator"

// import apiAuthController from "./APIAuthenticationController.mjs";
// import { APIPostController } from "./APIPostController.mjs";
// // import apiAuthMiddleware  from "../../middleware/apiauth.middleware.mjs";
// import apiUserController from "./APIUserController.mjs";
// import apiSessionController from "./APISessionController.mjs";
// import apiBookingController from "./APIBookingController.mjs";
// import apiExportController from "./APIExportController.mjs";
// import APIMicroblogController from "./APIMicroblogController.mjs";

// const options = {
//   failOnErrors: true,
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       version: "1.0.0",
//       title: "Gym Project API",
//       description: "JSON REST API interacting with the gym project backend"
//     },
//     components: {
//       securitySchemes: {
//         ApiKeyAuth: {
//           type: "apiKey",
//           in: "header",
//           name: "auth_key"
//         }
//       }
//     },
//     security: [
//       {
//         ApiKeyAuth: []
//       }
//     ]
//   },
//   apis: ["./controllers/api/**/*.{js,mjs,yaml}", "../../validator.yaml"]
// };

// const specification = swaggerJSDoc(options);
// fs.writeFileSync('./openapi.json', JSON.stringify(specification, null, 2));
// console.log('OpenAPI spec generated successfully!');

// export class APIController {
//   static routes = express.Router();

//   static {
//     /**
//      * @openapi
//      * /api/docs:
//      *   get:
//      *     summary: View automatically generated documentation pages
//      *     tags: [Documentation]
//      *     responses:
//      *       200:
//      *         description: The documentation page
//      */
//     this.routes.use(
//       "/docs",
//       swaggerUI.serve,
//       swaggerUI.setup(specification)
//     );

//     // Setup OpenAPI specification validation middleware
//         // this.routes.use(ApiValidator.middleware({
//         //     apiSpec: specification,
//         //     validateRequests: true,
//         //     validateResponses: true,
//         // }))

//         // // Setup error response for OpenAPI specification validation middleware
//         // this.routes.use((err, req, res, next) => {
//         //     // format error
//         //     res.status(err.status || 500).json({
//         //         status: err.status,
//         //         message: err.message,
//         //         errors: err.errors,
//         //     })
//         // })

//     /**
//      *  Public API routes
//      */
//     this.routes.use("/auth", apiAuthController);

//     /**
//      * Protected API routes (auth_key required)
//      */
//     // this.routes.use("/users", apiUserController);
//     // this.routes.use("/posts", APIPostController.routes);
//     // this.routes.use("/sessions", apiSessionController);
//     // this.routes.use("/bookings", apiBookingController);
//     // this.routes.use("/microblog", APIMicroblogController.routes);

//     // this.routes.use("/xml", apiExportController);

//     //  More controllers to be added here:
//     // this.routes.use("/sessions", apiAuthMiddleware, APISessionController.routes);
//     // this.routes.use("/bookings", apiAuthMiddleware, APIBookingController.routes);
//     // this.routes.use("/users", apiAuthMiddleware, APIUserController.routes);
//   }
// }
