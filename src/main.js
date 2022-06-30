
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;
const uri = "mongodb://127.0.0.1:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000";

app.use(express.json());

try
{
    MongoClient.connect(uri, function(err, cluster) {
        if(err) {
            throw err;
        }

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    });
}
catch(err) {
    //PLACEHOLDER; error
    console.log(err);
}
