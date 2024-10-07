const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const routes = require("./routes/routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const axios = require("axios");
const swaggerServices = require("./swaggerConfig");
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true })); //for parsing body of HTML Forms
app.use(express.static("./public")); //for serving static contenct in public folder
// eslint-disable-next-line no-undef
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/offer", routes);
app.use(morgan("tiny"));
app.use(
  morgan("common", {
    // eslint-disable-next-line no-undef
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  }),
);
app.use(
  morgan("common", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
    // eslint-disable-next-line no-undef
    stream: fs.createWriteStream(path.join(__dirname, "error.log"), {
      flags: "a",
    }),
  }),
);
app.get("/logging", (req, res) => {
  console.log("Hello");
  res.status(200).send("Welcome to aswaq logging service");
});
const getSwaggerDocs = async () => {
  const mergedDoc = {
    openapi: "3.0.0",
    info: {
      title: "Aswaq API Documentation",
      version: "1.0.0",
      description: "API documentation for all services of Aswaq",
    },
    paths: {},
    components: {
      schemas: {},
    },
    tags: [],
  };

  for (const service of swaggerServices) {
    try {
      const response = await axios.get(service.url);
      const serviceDoc = response.data;

      // Merge paths
      mergedDoc.paths = { ...mergedDoc.paths, ...serviceDoc.paths };
      mergedDoc.tags = [...mergedDoc.tags, ...serviceDoc.tags];
      console.log(mergedDoc.tags);
      // If schemas are defined, merge them as well (optional)
      if (serviceDoc.components && serviceDoc.components.schemas) {
        mergedDoc.components.schemas = {
          ...mergedDoc.components.schemas,
          ...serviceDoc.components.schemas,
        };
      }
    } catch (error) {
      console.error(
        `Failed to fetch Swagger docs from ${service.name}:`,
        error.message,
      );
    }
  }
  console.log(mergedDoc);
  return mergedDoc;
};

// Serve combined Swagger UI
app.use("/api-docs", swaggerUi.serve, async (req, res, next) => {
  const swaggerDocument = await getSwaggerDocs();
  swaggerUi.setup(swaggerDocument)(req, res, next);
});

app.get("/swagger.json", (req, res) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Logging Service API",
        version: "1.0.0",
        description: "API documentation for Logging Service",
      },
    },
    tags: [
      {
        name: "Logging",
        description: "API operations related to Loggings",
      },
    ],
    apis: ["./Routes/*.js"], // Path to the API docs (JSDoc comments)
  };
  const swaggerSpec = swaggerJsdoc(options);
  res.json(swaggerSpec);
});

module.exports = app;
