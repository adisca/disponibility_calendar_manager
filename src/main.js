"use strict";

global.ENV = process.env.NODE_ENV || "development";
global.LOG = require("./service/logger");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const databaseService = require("./service/databaseService")
const logInController = require("./controller/logInController");
const reservationController = require("./controller/reservationController");
const refreshTokenController = require("./controller/refreshTokenController");

const app = express();
const middlewareRouter = express.Router();
const port = 3000;
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Calendar Manager RESTful API in Node.js, using Express.js and MongoDB",
            version: "1.0.0",
            description: "This is a simple CRUD API application"
        },
        servers: [
            {
                url: "http://localhost:3000/",
            },
        ],
    },
    apis: ["./src/controller/*.js", "./src/model/*.js"],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
let server;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use("/", middlewareRouter);

async function runServer() {
    if (!server) {
        try {
            await databaseService.connect();

            logInController(app, middlewareRouter);
            reservationController(app, middlewareRouter);
            refreshTokenController(app, middlewareRouter);

            server = app.listen(port, () => {
                LOG.info(__filename, `App listening on port ${port}`);
            }).on("error", (err) => {
                LOG.error(__filename, err, "Listen error");
                databaseService.disconnect();
            });
        }
        catch (err) {
            LOG.error(__filename, err, "Error in main");
        }
    }
}

function closeServer() {
    if (server) {
        server.close();
    }
    databaseService.disconnect();
    server = undefined;
}

if (ENV === "development")
    runServer();

module.exports = app;
module.exports.closeServer = closeServer;
module.exports.runServer = runServer;
