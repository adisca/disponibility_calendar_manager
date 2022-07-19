"use strict";

global.ENV = process.env.NODE_ENV || 'development';
global.LOG = require("./service/logger");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const databaseService = require("./service/databaseService")
const logInController = require("./controller/logInController");
const reservationController = require("./controller/reservationController");

const app = express();
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

async function runServer() {
    try {
        await databaseService.connect();

        logInController(app);

        reservationController(app);

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

function closeServer() {
    if (server) {
        server.close();
    }
    databaseService.disconnect();
}

runServer();

module.exports = app;
module.exports.closeServer = closeServer;
