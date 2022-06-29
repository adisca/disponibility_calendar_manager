
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;
const url = "mongodb+srv://root:g0WL8QssCucGhsVj@db.q5ypejc.mongodb.net/?retryWrites=true&w=majority";

app.use(express.json());

try
{
    MongoClient.connect(url, function(err, cluster) {
        if(err) {
            throw err;
        }

        const db = cluster.db("testing");
        const collection = db.collection("test_set");

        // PLACEHOLDER to see if it runs
        app.get("/", async (req, res) => {
            let found = await collection.findOne();
            console.log(found);
            res.send(found);
        });

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    });
}
catch(err) {
    //PLACEHOLDER; error
    console.log(err);
}
