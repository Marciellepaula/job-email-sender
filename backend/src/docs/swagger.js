import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Email Sender API",
      version: "1.0.0",
      description:
        "Professional REST API for automated job application emails. " +
        "Built with Express, PostgreSQL, Sequelize, and JWT authentication.",
      contact: { name: "API Support" },
    },
    servers: [{ url: "/api", description: "API base path" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        CreateUser: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", example: "jane@example.com" },
            password: { type: "string", example: "secret123" },
          },
        },
        UpdateUser: {
          type: "object",
          properties: {
            name: { type: "string", example: "Jane Updated" },
            email: { type: "string", example: "jane.new@example.com" },
            password: { type: "string", example: "newsecret123" },
          },
        },
        CreateContact: {
          type: "object",
          required: ["companyName", "email"],
          properties: {
            companyName: { type: "string", example: "TechCorp Brasil" },
            email: { type: "string", example: "rh@techcorp.com" },
            recruiterName: { type: "string", example: "Ana Silva" },
          },
        },
        UpdateContact: {
          type: "object",
          properties: {
            companyName: { type: "string", example: "TechCorp Updated" },
            email: { type: "string", example: "newemail@techcorp.com" },
            recruiterName: { type: "string", example: "Carlos" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
            message: { type: "string", example: "Operation successful" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management (CRUD)" },
      { name: "Contacts", description: "Contact management" },
      { name: "Emails", description: "Email sending and logs" },
      { name: "Resume", description: "Resume upload" },
      { name: "Health", description: "Health check" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const spec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Job Email Sender — API Docs",
  }));
}
