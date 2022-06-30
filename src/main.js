
const express = require("express");
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const uri = "mongodb://127.0.0.1:27017/dcm";

app.use(express.json());

try {
    mongoose.connect(uri, (err) => {
        if (err)
            throw err;

        //PLACEHOLDER_LOG; success
        console.log("Database connected successfully");

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    });
}
catch (err) {
    //PLACEHOLDER_LOG; error
    console.log(err);
}
