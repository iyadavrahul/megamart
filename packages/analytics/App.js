const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const routes = require("./routes/routes");
const swaggerJsdoc = require("swagger-jsdoc");
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true })); //for parsing body of HTML Forms
app.use(express.static("./public")); //for serving static contenct in public folder
// eslint-disable-next-line no-undef
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/analytics", routes);
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
app.get("/analytics", (req, res) => {
  console.log("Hello");
  res.status(200).send("Welcome to aswaq analytics service");
});

// Swagger JSDoc configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Analytics Service API",
      version: "1.0.0",
      description: "API documentation for Analytics Service",
    },
  },
  tags: [
    {
      name: "Analytics",
      description: "API operations related to Analytics",
    },
  ],
  apis: ["./Routes/*.js"], // Path to the API docs (JSDoc comments)
};

app.get("/swagger.json", (req, res) => {
  const swaggerSpec = swaggerJsdoc(options);
  res.json(swaggerSpec);
});

module.exports = app;
