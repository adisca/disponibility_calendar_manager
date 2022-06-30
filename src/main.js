
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const databaseService = require("./service/databaseService.js")

const app = express();
const port = 3000;
const uri = "mongodb://127.0.0.1:27017/dcm";

app.use(express.json());
app.use(helmet());
app.use(cors());

databaseService.connect(uri)
    .then((success) => {
        // PLACEHOLDER_LOG; success
        console.log(success);

        app.listen(port, () => {
            // PLACEHOLDER_LOG; information
            console.log(`App listening on port ${port}`);
        });
    })
    .catch((err) => {
        // PLACEHOLDER_LOG; error
        console.log(err);
    })
