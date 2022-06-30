"use strict";

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const databaseService = require("./service/databaseService.js")

const app = express();
const port = 3000;

app.use(express.json());
app.use(helmet());
app.use(cors());

async function runServer() {
    try {
        await databaseService.connect();

        app.listen(port, () => {
            // PLACEHOLDER_LOG; info
            console.log(`App listening on port ${port}`);
        }).on("error", (err) => {
            // PLACEHOLDER_LOG; error
            console.log("Listen error: " + err);
            databaseService.disconnect();
        });
    }
    catch (err) {
        // PLACEHOLDER_LOG; error
        console.log("Error in main: " + err);
    }
}

runServer();
