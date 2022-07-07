"use strict";

global.LOG = require("./service/logger");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const databaseService = require("./service/databaseService")
const logInController = require("./controller/logInController");

const app = express();
const port = 3000;

app.use(express.json());
app.use(helmet());
app.use(cors());

async function runServer() {
    try {
        await databaseService.connect();

        logInController(app);

        app.listen(port, () => {
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

runServer();
