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

databaseService.connect()
    .then(() => {
        app.listen(port, () => {
            // PLACEHOLDER_LOG; information
            console.log(`App listening on port ${port}`);
        });
    })
    .catch((err) => {
        if (err) {
            // PLACEHOLDER_LOG; error
            console.log(err);
        }
        // else it was managed already
    })
